import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS = join(__dirname, "results");
const FIXTURE_PDF = join(__dirname, "fixtures", "consentimiento-prueba.pdf");
const BASE = process.env.BASE_URL ?? "http://localhost:3000/api/v1";
const LOGIN = {
  correo: process.env.AUTH_CORREO ?? "admin@local.test",
  contrasena: process.env.AUTH_CONTRASENA ?? "Cambiar1234",
};
const MISSING_ID = "00000000-0000-0000-0000-000000000000";
const STAMP = Date.now();

const ctx = {
  tokenAcceso: "",
  tokenRenovacion: "",
  tipoDocumentoId: "",
  tipoAyudaId: "",
  rolId: "",
  cantonId: "",
  diocesisId: "",
  vicariaId: "",
  parroquiaId: "",
  testDiocesisId: "",
  testVicariaId: "",
  testParroquiaId: "",
  usuarioId: "",
  usuarioCreadoId: "",
  personaId: "",
  direccionId: "",
  solicitudId: "",
  integranteId: "",
  ayudaId: "",
  planId: "",
  detallePlanId: "",
  documentoId: "",
};

const summary = [];

function redact(value) {
  if (value == null) return value;
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return text
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/"(tokenAcceso|tokenRenovacion|urlFirmada)"\s*:\s*"[^"]*"/g, '"$1": "[REDACTED]"')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[REDACTED_JWT]");
}

function asList(body) {
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.items)) return body.items;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
}

function pickId(body) {
  if (!body) return "";
  if (typeof body.id === "string") return body.id;
  const first = asList(body)[0];
  return first?.id ?? "";
}

function idOrMissing(value) {
  return value || MISSING_ID;
}

function expectedOk(status, expected) {
  if (expected.includes("204") && status === 204) return true;
  if (expected.includes("201") && (status === 200 || status === 201)) return true;
  if (expected.includes("200") && status >= 200 && status < 300) return true;
  return status >= 200 && status < 300 && expected.some((code) => String(status) === code);
}

async function writeResult(id, payload) {
  const lines = [
    `# ${id}`,
    "",
    `- verdict: **${payload.verdict}**`,
    `- timestamp: ${payload.timestamp}`,
    `- durationMs: ${payload.durationMs ?? "n/a"}`,
    payload.notes ? `- notes: ${payload.notes}` : "",
    "",
    "## Assertions",
    "",
    ...(payload.assertions ?? []).map((a) => `- ${a.ok ? "pass" : "fail"}: ${a.text}`),
    payload.assertions?.length ? "" : "- (none)",
    "",
    "## Request",
    "",
    "```http",
    payload.request ?? "(not sent)",
    "```",
    "",
    "## Response",
    "",
    "```http",
    payload.response ?? "(no response)",
    "```",
    "",
  ].filter((line, i, arr) => !(line === "" && arr[i - 1] === ""));
  await writeFile(join(RESULTS, `${id}.md`), `${lines.join("\n")}\n`);
  summary.push({ id, verdict: payload.verdict, notes: payload.notes ?? "" });
}

async function send({
  id,
  method,
  path,
  auth = true,
  json,
  formFile,
  expected = ["200"],
  assertions = [],
  capture,
  notes,
}) {
  const url = `${BASE}${path}`;
  const headers = {};
  if (auth && ctx.tokenAcceso) {
    headers.Authorization = `Bearer ${ctx.tokenAcceso}`;
  }

  let body;
  if (formFile) {
    const bytes = await readFile(formFile.path);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const form = new FormData();
    form.append(formFile.field, blob, formFile.filename);
    body = form;
  } else if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  const requestDump = redact(
    [
      `${method} ${url}`,
      ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
      auth && !ctx.tokenAcceso ? "Authorization: (missing tokenAcceso)" : "",
      json !== undefined ? `\n${JSON.stringify(json, null, 2)}` : "",
      formFile ? `\nmultipart form-data field=${formFile.field} file=${formFile.filename}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const started = Date.now();
  let status = 0;
  let responseText = "";
  let parsed = null;
  let headerLines = "";
  try {
    const res = await fetch(url, { method, headers, body });
    status = res.status;
    headerLines = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
    responseText = await res.text();
    try {
      parsed = responseText ? JSON.parse(responseText) : null;
    } catch {
      parsed = null;
    }
  } catch (error) {
    await writeResult(id, {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - started,
      notes: notes ?? String(error),
      assertions: [{ ok: false, text: `request completed (${error.message})` }],
      request: requestDump,
      response: String(error),
    });
    return { ok: false, status: 0, body: null, error };
  }

  const durationMs = Date.now() - started;
  const statusOk = expectedOk(status, expected);
  const assertionResults = [{ ok: statusOk, text: `HTTP ${status} matches expected ${expected.join("|")}` }];
  if (auth && !ctx.tokenAcceso) {
    assertionResults.push({ ok: false, text: "tokenAcceso available before authenticated request" });
  }
  for (const fn of assertions) {
    try {
      const result = fn(parsed, status);
      assertionResults.push(typeof result === "object" ? result : { ok: Boolean(result), text: String(result) });
    } catch (error) {
      assertionResults.push({ ok: false, text: error.message });
    }
  }

  if (statusOk && capture) {
    capture(parsed, status);
  }

  const failedAsserts = assertionResults.filter((a) => !a.ok);
  let verdict = "succeeded";
  if (!statusOk) verdict = "failed entirely";
  else if (failedAsserts.length) verdict = "failed partially";

  await writeResult(id, {
    verdict,
    timestamp: new Date().toISOString(),
    durationMs,
    notes,
    assertions: assertionResults,
    request: requestDump,
    response: redact(`HTTP ${status}\n${headerLines}\n\n${responseText || "(empty)"}`),
  });
  return { ok: statusOk, status, body: parsed };
}

async function getCatalogo(slug, captureKey) {
  await send({
    id: `catalogos-get-${slug}`,
    method: "GET",
    path: `/catalogos/${slug}`,
    expected: ["200"],
    assertions: [
      (body, status) => ({
        ok: status >= 200 && status < 300 && Array.isArray(asList(body)),
        text: "lista presente",
      }),
    ],
    capture: captureKey
      ? (body) => {
          ctx[captureKey] = pickId(body);
        }
      : undefined,
  });
}

async function main() {
  await mkdir(RESULTS, { recursive: true });

  await send({
    id: "salud-get",
    method: "GET",
    path: "/salud",
    auth: false,
    expected: ["200"],
    assertions: [(body) => ({ ok: body?.estado === "ok", text: "estado === ok" })],
  });

  await send({
    id: "auth-post-sesiones",
    method: "POST",
    path: "/auth/sesiones",
    auth: false,
    json: LOGIN,
    expected: ["200", "201"],
    assertions: [
      (body) => ({ ok: Boolean(body?.tokenAcceso), text: "tokenAcceso presente" }),
      (body) => ({ ok: Boolean(body?.tokenRenovacion), text: "tokenRenovacion presente" }),
      (body) => ({ ok: Boolean(body?.usuario), text: "usuario presente" }),
    ],
    capture: (body) => {
      ctx.tokenAcceso = body.tokenAcceso;
      ctx.tokenRenovacion = body.tokenRenovacion;
      ctx.usuarioId = body.usuario?.id ?? body.usuarioId ?? "";
    },
  });

  await send({
    id: "auth-get-sesion",
    method: "GET",
    path: "/auth/sesion",
    expected: ["200"],
    assertions: [
      (body, status) => ({
        ok: status >= 200 && status < 300 && Boolean(body),
        text: "cuerpo presente",
      }),
    ],
    capture: (body) => {
      ctx.usuarioId = body.usuario?.id ?? body.usuarioId ?? body.id ?? ctx.usuarioId;
    },
  });

  await send({
    id: "auth-post-sesiones-renovacion",
    method: "POST",
    path: "/auth/sesiones/renovacion",
    auth: false,
    json: { tokenRenovacion: ctx.tokenRenovacion || "token-renovacion-ausente" },
    expected: ["200", "201"],
    assertions: [
      (body) => ({ ok: Boolean(body?.tokenAcceso), text: "tokenAcceso presente" }),
      (body) => ({ ok: Boolean(body?.tokenRenovacion), text: "tokenRenovacion presente" }),
    ],
    capture: (body) => {
      ctx.tokenAcceso = body.tokenAcceso;
      ctx.tokenRenovacion = body.tokenRenovacion;
    },
    notes: ctx.tokenRenovacion ? undefined : "tokenRenovacion no capturado; se envía placeholder",
  });

  await getCatalogo("tipos-documento", "tipoDocumentoId");
  await getCatalogo("sexos");
  await getCatalogo("grados-academicos");
  await getCatalogo("parentescos");
  await getCatalogo("rangos-ingreso");
  await getCatalogo("tipos-vivienda");
  await getCatalogo("tipos-tenencia");
  await getCatalogo("condiciones-vivienda");
  await getCatalogo("tipos-ayuda", "tipoAyudaId");
  await getCatalogo("roles", "rolId");
  await getCatalogo("cantones");
  await getCatalogo("distritos");
  await getCatalogo("barrios");

  await send({
    id: "catalogos-get-roles-id",
    method: "GET",
    path: `/catalogos/roles/${idOrMissing(ctx.rolId)}`,
    expected: ["200"],
    assertions: [
      (body, status) => ({
        ok: status >= 200 && status < 300 && Boolean(body),
        text: "objeto de rol",
      }),
    ],
    notes: ctx.rolId ? undefined : "rolId no capturado; se usa UUID placeholder",
  });

  const cantonCodigo = `T${String(STAMP).slice(-5)}`;
  await send({
    id: "catalogos-post-cantones",
    method: "POST",
    path: "/catalogos/cantones",
    json: { codigo: cantonCodigo, nombre: `Canton TEST ${STAMP}` },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.cantonId = pickId(body);
    },
  });
  await send({
    id: "catalogos-patch-cantones-id",
    method: "PATCH",
    path: `/catalogos/cantones/${idOrMissing(ctx.cantonId)}`,
    json: { nombre: `Canton TEST ${STAMP} actualizado` },
    expected: ["200"],
    notes: ctx.cantonId ? undefined : "cantonId no capturado; se usa UUID placeholder",
  });
  await send({
    id: "catalogos-delete-cantones-id",
    method: "DELETE",
    path: `/catalogos/cantones/${idOrMissing(ctx.cantonId)}`,
    json: { motivo: "Fila de prueba endpoint-test" },
    expected: ["200", "204"],
  });

  await send({
    id: "organizacion-get-diocesis",
    method: "GET",
    path: "/diocesis",
    expected: ["200"],
    capture: (body) => {
      ctx.diocesisId = pickId(body);
    },
  });
  await send({
    id: "organizacion-post-diocesis",
    method: "POST",
    path: "/diocesis",
    json: { nombre: `Diócesis TEST ${STAMP}` },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.testDiocesisId = pickId(body);
      if (!ctx.diocesisId) ctx.diocesisId = ctx.testDiocesisId;
    },
  });
  await send({
    id: "organizacion-get-diocesis-id",
    method: "GET",
    path: `/diocesis/${idOrMissing(ctx.testDiocesisId || ctx.diocesisId)}`,
    expected: ["200"],
  });
  await send({
    id: "organizacion-patch-diocesis-id",
    method: "PATCH",
    path: `/diocesis/${idOrMissing(ctx.testDiocesisId || ctx.diocesisId)}`,
    json: { nombre: `Diócesis TEST ${STAMP} actualizado` },
    expected: ["200"],
  });

  await send({
    id: "organizacion-get-vicarias",
    method: "GET",
    path: "/vicarias",
    expected: ["200"],
    capture: (body) => {
      ctx.vicariaId = pickId(body);
    },
  });
  await send({
    id: "organizacion-post-vicarias",
    method: "POST",
    path: "/vicarias",
    json: {
      nombre: `Vicaría TEST ${STAMP}`,
      diocesisId: idOrMissing(ctx.testDiocesisId || ctx.diocesisId),
    },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.testVicariaId = pickId(body);
      if (!ctx.vicariaId) ctx.vicariaId = ctx.testVicariaId;
    },
  });
  await send({
    id: "organizacion-get-vicarias-id",
    method: "GET",
    path: `/vicarias/${idOrMissing(ctx.testVicariaId || ctx.vicariaId)}`,
    expected: ["200"],
  });
  await send({
    id: "organizacion-patch-vicarias-id",
    method: "PATCH",
    path: `/vicarias/${idOrMissing(ctx.testVicariaId || ctx.vicariaId)}`,
    json: { nombre: `Vicaría TEST ${STAMP} actualizado` },
    expected: ["200"],
  });

  await send({
    id: "organizacion-get-parroquias",
    method: "GET",
    path: "/parroquias",
    expected: ["200"],
    capture: (body) => {
      ctx.parroquiaId = pickId(body);
    },
  });
  await send({
    id: "organizacion-post-parroquias",
    method: "POST",
    path: "/parroquias",
    json: {
      nombre: `Parroquia TEST ${STAMP}`,
      vicariaId: idOrMissing(ctx.testVicariaId || ctx.vicariaId),
    },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.testParroquiaId = pickId(body);
      if (!ctx.parroquiaId) ctx.parroquiaId = ctx.testParroquiaId;
    },
  });
  await send({
    id: "organizacion-get-parroquias-id",
    method: "GET",
    path: `/parroquias/${idOrMissing(ctx.testParroquiaId || ctx.parroquiaId)}`,
    expected: ["200"],
  });
  await send({
    id: "organizacion-patch-parroquias-id",
    method: "PATCH",
    path: `/parroquias/${idOrMissing(ctx.testParroquiaId || ctx.parroquiaId)}`,
    json: { nombre: `Parroquia TEST ${STAMP} actualizado` },
    expected: ["200"],
  });

  await send({
    id: "usuarios-get",
    method: "GET",
    path: "/usuarios",
    expected: ["200"],
    capture: (body) => {
      if (!ctx.usuarioId) ctx.usuarioId = pickId(body);
    },
  });
  await send({
    id: "usuarios-get-id",
    method: "GET",
    path: `/usuarios/${idOrMissing(ctx.usuarioId)}`,
    expected: ["200"],
  });
  await send({
    id: "usuarios-post",
    method: "POST",
    path: "/usuarios",
    json: {
      nombreCompleto: `Usuario TEST ${STAMP}`,
      correo: `endpoint.test.${STAMP}@local.test`,
      contrasena: "Cambiar1234",
      rolCodigo: "PERSONAL_PASTORAL",
      parroquiaId: idOrMissing(ctx.testParroquiaId || ctx.parroquiaId),
      motivo: "Alta de prueba endpoint-test",
    },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.usuarioCreadoId = pickId(body);
    },
  });
  const usuarioMutacion = ctx.usuarioCreadoId || ctx.usuarioId;
  await send({
    id: "usuarios-patch-id",
    method: "PATCH",
    path: `/usuarios/${idOrMissing(usuarioMutacion)}`,
    json: { activo: false, motivo: "Baja temporal de prueba endpoint-test" },
    expected: ["200"],
    notes: ctx.usuarioCreadoId
      ? "PATCH sobre usuario creado en esta corrida"
      : "PATCH sobre usuario de sesión (no se pudo crear uno de prueba)",
  });
  if (ctx.usuarioCreadoId) {
    await send({
      id: "usuarios-post-asignaciones",
      method: "POST",
      path: `/usuarios/${ctx.usuarioCreadoId}/asignaciones`,
      json: {
        rolCodigo: "COORDINADOR_PARROQUIAL",
        parroquiaId: idOrMissing(ctx.testParroquiaId || ctx.parroquiaId),
        motivo: "Promoción de prueba endpoint-test",
      },
      expected: ["200", "201"],
    });
  } else {
    await send({
      id: "usuarios-post-asignaciones",
      method: "POST",
      path: `/usuarios/${idOrMissing(ctx.usuarioId)}/asignaciones`,
      json: {
        rolCodigo: "COORDINADOR_PARROQUIAL",
        parroquiaId: idOrMissing(ctx.testParroquiaId || ctx.parroquiaId),
        motivo: "Promoción de prueba endpoint-test",
      },
      expected: ["200", "201"],
      notes: "Sin usuario creado; se intenta contra usuario de sesión (puede fallar por autoasignación)",
    });
  }

  const personaBody = {
    primerNombre: "María",
    primerApellido: "Solano",
    numeroDocumento: `1-2345-${String(STAMP).slice(-4)}`,
    telefono: "88881111",
  };
  if (ctx.tipoDocumentoId) personaBody.tipoDocumentoId = ctx.tipoDocumentoId;

  await send({
    id: "personas-post",
    method: "POST",
    path: "/personas",
    json: personaBody,
    expected: ["200", "201"],
    assertions: [(body) => ({ ok: Boolean(pickId(body)), text: "id presente" })],
    capture: (body) => {
      ctx.personaId = pickId(body);
    },
  });
  await send({
    id: "personas-get",
    method: "GET",
    path: "/personas",
    expected: ["200"],
  });
  await send({
    id: "personas-get-id",
    method: "GET",
    path: `/personas/${idOrMissing(ctx.personaId)}`,
    expected: ["200"],
  });
  await send({
    id: "personas-patch-id",
    method: "PATCH",
    path: `/personas/${idOrMissing(ctx.personaId)}`,
    json: { segundoNombre: "Elena", telefono: "88882222" },
    expected: ["200"],
  });
  await send({
    id: "personas-post-busquedas",
    method: "POST",
    path: "/personas/busquedas",
    json: { numeroDocumento: personaBody.numeroDocumento },
    expected: ["200"],
  });
  await send({
    id: "personas-post-direcciones",
    method: "POST",
    path: `/personas/${idOrMissing(ctx.personaId)}/direcciones`,
    json: { senas: "100 m sur de la iglesia", esActual: true, vigenteDesde: "2026-09-07" },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.direccionId = pickId(body);
    },
  });
  await send({
    id: "personas-get-direcciones",
    method: "GET",
    path: `/personas/${idOrMissing(ctx.personaId)}/direcciones`,
    expected: ["200"],
  });
  await send({
    id: "personas-patch-direcciones-id",
    method: "PATCH",
    path: `/personas/${idOrMissing(ctx.personaId)}/direcciones/${idOrMissing(ctx.direccionId)}`,
    json: { esActual: false, vigenteHasta: "2026-09-07" },
    expected: ["200"],
  });

  const solicitudJson = {
    personaSolicitanteId: idOrMissing(ctx.personaId),
    parroquiaReceptoraId: idOrMissing(ctx.testParroquiaId || ctx.parroquiaId),
    sectorOficial: "Barrio Centro",
    estado: "BORRADOR",
  };
  if (ctx.tipoAyudaId) solicitudJson.tiposAyuda = [ctx.tipoAyudaId];

  await send({
    id: "solicitudes-post",
    method: "POST",
    path: "/solicitudes-ayuda",
    json: solicitudJson,
    expected: ["200", "201"],
    capture: (body) => {
      ctx.solicitudId = pickId(body);
    },
  });
  await send({
    id: "solicitudes-get",
    method: "GET",
    path: "/solicitudes-ayuda",
    expected: ["200"],
  });
  await send({
    id: "solicitudes-get-id",
    method: "GET",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}`,
    expected: ["200"],
  });
  await send({
    id: "solicitudes-patch-id",
    method: "PATCH",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}`,
    json: { fechaEntrevista: "2026-09-07", observaciones: "Visita domiciliaria pendiente" },
    expected: ["200"],
  });
  await send({
    id: "solicitudes-post-estado-presentada",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/estado`,
    json: { estadoNuevo: "PRESENTADA", motivo: "Entrevista completa" },
    expected: ["200"],
  });
  await send({
    id: "solicitudes-get-integrantes",
    method: "GET",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/integrantes`,
    expected: ["200"],
  });
  await send({
    id: "solicitudes-post-integrantes",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/integrantes`,
    json: { nombreCompleto: "Juan Solano", ocupacion: "Jornalero" },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.integranteId = pickId(body);
    },
  });
  await send({
    id: "solicitudes-patch-integrantes-id",
    method: "PATCH",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/integrantes/${idOrMissing(ctx.integranteId)}`,
    json: { ocupacion: "Jornalero (actualizado)" },
    expected: ["200"],
  });
  await send({
    id: "solicitudes-get-evaluacion-vivienda",
    method: "GET",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/evaluacion-vivienda`,
    expected: ["200"],
  });
  await send({
    id: "solicitudes-post-evaluacion-vivienda",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/evaluacion-vivienda`,
    json: { observaciones: "Techo de zinc" },
    expected: ["200", "201"],
  });
  await send({
    id: "solicitudes-get-ayudas-solicitadas",
    method: "GET",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/ayudas-solicitadas`,
    expected: ["200"],
  });
  await send({
    id: "solicitudes-post-ayudas-solicitadas",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/ayudas-solicitadas`,
    json: { tipoAyudaId: ctx.tipoAyudaId || MISSING_ID, detalle: null },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.ayudaId = pickId(body);
    },
  });
  await send({
    id: "solicitudes-delete-ayudas-solicitadas-id",
    method: "DELETE",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/ayudas-solicitadas/${idOrMissing(ctx.ayudaId)}`,
    json: { motivo: "Selección incorrecta (fila de prueba)" },
    expected: ["200", "204"],
  });

  await send({
    id: "planes-get",
    method: "GET",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/planes-ayuda`,
    expected: ["200"],
  });
  await send({
    id: "planes-post",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/planes-ayuda`,
    json: {
      decision: "APROBADA",
      fechaInicio: "2026-09-01",
      fechaFin: "2026-12-01",
      motivoDecision: "Comité parroquial",
    },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.planId = pickId(body);
    },
  });
  await send({
    id: "planes-get-detalles",
    method: "GET",
    path: `/planes-ayuda/${idOrMissing(ctx.planId)}/detalles`,
    expected: ["200"],
  });
  const detalleJson = { frecuencia: "MENSUAL", montoEstimado: 25000 };
  if (ctx.tipoAyudaId) detalleJson.tipoAyudaId = ctx.tipoAyudaId;
  else detalleJson.tipoAyudaId = MISSING_ID;
  await send({
    id: "planes-post-detalles",
    method: "POST",
    path: `/planes-ayuda/${idOrMissing(ctx.planId)}/detalles`,
    json: detalleJson,
    expected: ["200", "201"],
    capture: (body) => {
      ctx.detallePlanId = pickId(body);
    },
  });
  await send({
    id: "planes-get-entregas",
    method: "GET",
    path: `/detalles-plan-ayuda/${idOrMissing(ctx.detallePlanId)}/entregas`,
    expected: ["200"],
  });
  await send({
    id: "planes-post-entregas",
    method: "POST",
    path: `/detalles-plan-ayuda/${idOrMissing(ctx.detallePlanId)}/entregas`,
    json: { fechaEntrega: "2026-09-15", monto: 25000, descripcion: "Paquete de alimentos" },
    expected: ["200", "201"],
  });

  await send({
    id: "documentos-get",
    method: "GET",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/documentos-consentimiento`,
    expected: ["200"],
  });
  await send({
    id: "documentos-post",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/documentos-consentimiento?fechaFirma=2026-09-07`,
    formFile: { field: "archivo", path: FIXTURE_PDF, filename: "consentimiento-prueba.pdf" },
    expected: ["200", "201"],
    capture: (body) => {
      ctx.documentoId = pickId(body);
    },
  });
  await send({
    id: "documentos-get-url",
    method: "GET",
    path: `/documentos-consentimiento/${idOrMissing(ctx.documentoId)}/url`,
    expected: ["200"],
    assertions: [
      (body) => ({ ok: Boolean(body?.urlFirmada), text: "urlFirmada presente" }),
      (body) => ({ ok: body?.expiraEnSegundos != null, text: "expiraEnSegundos presente" }),
    ],
  });

  await send({
    id: "auditoria-get",
    method: "GET",
    path: "/eventos-auditoria",
    expected: ["200"],
  });

  await send({
    id: "solicitudes-post-eliminacion",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/eliminacion`,
    json: { motivo: "Duplicada (prueba endpoint-test)" },
    expected: ["200"],
  });
  await send({
    id: "solicitudes-post-restauracion",
    method: "POST",
    path: `/solicitudes-ayuda/${idOrMissing(ctx.solicitudId)}/restauracion`,
    json: { motivo: "Eliminada por error (prueba endpoint-test)" },
    expected: ["200"],
  });

  await send({
    id: "organizacion-delete-parroquias-id",
    method: "DELETE",
    path: `/parroquias/${idOrMissing(ctx.testParroquiaId)}`,
    json: { motivo: "Reorganización (prueba endpoint-test)" },
    expected: ["200", "204"],
    notes: ctx.testParroquiaId ? "DELETE de parroquia creada en esta corrida" : "Sin parroquia TEST; UUID placeholder",
  });
  await send({
    id: "organizacion-delete-vicarias-id",
    method: "DELETE",
    path: `/vicarias/${idOrMissing(ctx.testVicariaId)}`,
    json: { motivo: "Reorganización (prueba endpoint-test)" },
    expected: ["200", "204"],
  });
  await send({
    id: "organizacion-delete-diocesis-id",
    method: "DELETE",
    path: `/diocesis/${idOrMissing(ctx.testDiocesisId)}`,
    json: { motivo: "Reorganización (prueba endpoint-test)" },
    expected: ["200", "204"],
  });

  await send({
    id: "auth-delete-sesiones",
    method: "DELETE",
    path: "/auth/sesiones",
    expected: ["200", "204"],
  });

  const extra = ctx.tokenAcceso
    ? ""
    : "POST /auth/sesiones no devolvió tokenAcceso (la API no pudo hablar con Auth/Supabase). Los casos autenticados se enviaron igual y quedaron documentados, en su mayoría HTTP 401.";
  await writeFile(join(RESULTS, "_summary.md"), buildSummary(extra));
}

function buildSummary(extra = "") {
  const counts = { succeeded: 0, "failed partially": 0, "failed entirely": 0 };
  for (const row of summary) {
    counts[row.verdict] = (counts[row.verdict] ?? 0) + 1;
  }
  const lines = [
    "# Resultados de endpoints",
    "",
    `- baseUrl: \`${BASE}\``,
    `- timestamp: ${new Date().toISOString()}`,
    "",
    "## Conteos",
    "",
    `- succeeded: ${counts.succeeded}`,
    `- failed partially: ${counts["failed partially"]}`,
    `- failed entirely: ${counts["failed entirely"]}`,
    extra ? `\n${extra}\n` : "",
    "## Detalle",
    "",
    "| id | verdict | notes |",
    "| --- | --- | --- |",
    ...summary.map((row) => `| ${row.id} | ${row.verdict} | ${row.notes.replaceAll("|", "/")} |`),
    "",
  ];
  return `${lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n")}\n`;
}

await main();
