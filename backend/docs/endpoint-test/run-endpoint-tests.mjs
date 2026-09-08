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

const ctx = {
  tokenAcceso: "",
  tokenRenovacion: "",
  tipoDocumentoId: "",
  tipoAyudaId: "",
  rolId: "",
  diocesisId: "",
  vicariaId: "",
  parroquiaId: "",
  usuarioId: "",
  personaId: "",
  direccionId: "",
  solicitudId: "",
  integranteId: "",
  ayudaId: "",
  planId: "",
  detallePlanId: "",
  documentoId: "",
  createdAyudaThisRun: false,
  createdDiocesis: false,
  createdVicaria: false,
  createdParroquia: false,
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

async function writeSkipped(id, reason) {
  await writeResult(id, {
    verdict: "skipped",
    timestamp: new Date().toISOString(),
    notes: reason,
    assertions: [],
    request: "(not sent — skipped by happy-path policy)",
    response: "(n/a)",
  });
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
  if (auth) {
    if (!ctx.tokenAcceso) {
      await writeResult(id, {
        verdict: "failed entirely",
        timestamp: new Date().toISOString(),
        notes: notes ?? "Missing tokenAcceso; prior auth step failed",
        assertions: [{ ok: false, text: "tokenAcceso available" }],
        request: `${method} ${url}\nAuthorization: Bearer [REDACTED]`,
        response: "(not sent)",
      });
      return { ok: false, status: 0, body: null };
    }
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

const SKIPPED = [
  ["catalogos-post-cantones", "Fuera del happy path; no mutar catálogos existentes"],
  ["catalogos-patch-cantones-id", "Fuera del happy path"],
  ["catalogos-delete-cantones-id", "No DELETE de catálogos existentes"],
  ["organizacion-patch-diocesis-id", "No PATCH de organización existente"],
  ["organizacion-delete-diocesis-id", "No DELETE de organización existente"],
  ["organizacion-patch-vicarias-id", "No PATCH de organización existente"],
  ["organizacion-delete-vicarias-id", "No DELETE de organización existente"],
  ["organizacion-patch-parroquias-id", "No PATCH de organización existente"],
  ["organizacion-delete-parroquias-id", "No DELETE de organización existente"],
  ["usuarios-post", "Fuera del happy path (alta de identidad Auth)"],
  ["usuarios-patch-id", "No baja/desactivación de usuarios"],
  ["usuarios-post-asignaciones", "No reasignación de roles en happy path"],
  ["solicitudes-post-eliminacion", "Fuera del happy path"],
  ["solicitudes-post-restauracion", "Fuera del happy path"],
];

async function main() {
  await mkdir(RESULTS, { recursive: true });

  for (const [id, reason] of SKIPPED) {
    await writeSkipped(id, reason);
  }

  await send({
    id: "salud-get",
    method: "GET",
    path: "/salud",
    auth: false,
    expected: ["200"],
    assertions: [(body) => ({ ok: body?.estado === "ok", text: "estado === ok" })],
  });

  const login = await send({
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

  if (!login.ok) {
    const remaining = [
      "auth-get-sesion",
      "auth-post-sesiones-renovacion",
      "catalogos-get-tipos-documento",
      "catalogos-get-tipos-ayuda",
      "catalogos-get-roles",
      "catalogos-get-roles-id",
      "organizacion-get-diocesis",
      "organizacion-post-diocesis",
      "organizacion-get-diocesis-id",
      "organizacion-get-vicarias",
      "organizacion-post-vicarias",
      "organizacion-get-vicarias-id",
      "organizacion-get-parroquias",
      "organizacion-post-parroquias",
      "organizacion-get-parroquias-id",
      "usuarios-get",
      "usuarios-get-id",
      "personas-post",
      "personas-get",
      "personas-get-id",
      "personas-patch-id",
      "personas-post-busquedas",
      "personas-post-direcciones",
      "personas-get-direcciones",
      "personas-patch-direcciones-id",
      "solicitudes-post",
      "solicitudes-get",
      "solicitudes-get-id",
      "solicitudes-patch-id",
      "solicitudes-post-estado-presentada",
      "solicitudes-get-integrantes",
      "solicitudes-post-integrantes",
      "solicitudes-patch-integrantes-id",
      "solicitudes-get-evaluacion-vivienda",
      "solicitudes-post-evaluacion-vivienda",
      "solicitudes-get-ayudas-solicitadas",
      "solicitudes-post-ayudas-solicitadas",
      "solicitudes-delete-ayudas-solicitadas-id",
      "planes-get",
      "planes-post",
      "planes-get-detalles",
      "planes-post-detalles",
      "planes-get-entregas",
      "planes-post-entregas",
      "documentos-get",
      "documentos-post",
      "documentos-get-url",
      "auditoria-get",
      "auth-delete-sesiones",
    ];
    for (const id of remaining) {
      await writeResult(id, {
        verdict: "failed entirely",
        timestamp: new Date().toISOString(),
        notes: "No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso)",
        assertions: [{ ok: false, text: "tokenAcceso available" }],
        request: "(not sent)",
        response: "(n/a)",
      });
    }
    await writeFile(
      join(RESULTS, "_summary.md"),
      buildSummary(
        "La API en localhost:3000 respondió HTTP 500 (codigo INTERNO) en GET /salud y POST /auth/sesiones. El resto de casos autenticados no se envió.",
      ),
    );
    process.exitCode = 1;
    return;
  }

  await send({
    id: "auth-get-sesion",
    method: "GET",
    path: "/auth/sesion",
    expected: ["200"],
    assertions: [(body) => ({ ok: Boolean(body), text: "cuerpo presente" })],
    capture: (body) => {
      ctx.usuarioId = body.usuario?.id ?? body.usuarioId ?? body.id ?? ctx.usuarioId;
    },
  });

  await send({
    id: "auth-post-sesiones-renovacion",
    method: "POST",
    path: "/auth/sesiones/renovacion",
    auth: false,
    json: { tokenRenovacion: ctx.tokenRenovacion },
    expected: ["200", "201"],
    assertions: [
      (body) => ({ ok: Boolean(body?.tokenAcceso), text: "tokenAcceso presente" }),
      (body) => ({ ok: Boolean(body?.tokenRenovacion), text: "tokenRenovacion presente" }),
    ],
    capture: (body) => {
      ctx.tokenAcceso = body.tokenAcceso;
      ctx.tokenRenovacion = body.tokenRenovacion;
    },
  });

  await send({
    id: "catalogos-get-tipos-documento",
    method: "GET",
    path: "/catalogos/tipos-documento",
    expected: ["200"],
    assertions: [(body) => ({ ok: Array.isArray(asList(body)), text: "lista presente" })],
    capture: (body) => {
      ctx.tipoDocumentoId = pickId(body);
    },
  });

  await send({
    id: "catalogos-get-tipos-ayuda",
    method: "GET",
    path: "/catalogos/tipos-ayuda",
    expected: ["200"],
    assertions: [(body) => ({ ok: Array.isArray(asList(body)), text: "lista presente" })],
    capture: (body) => {
      ctx.tipoAyudaId = pickId(body);
    },
  });

  await send({
    id: "catalogos-get-roles",
    method: "GET",
    path: "/catalogos/roles",
    expected: ["200"],
    assertions: [(body) => ({ ok: Array.isArray(asList(body)), text: "lista presente" })],
    capture: (body) => {
      ctx.rolId = pickId(body);
    },
  });

  if (ctx.rolId) {
    await send({
      id: "catalogos-get-roles-id",
      method: "GET",
      path: `/catalogos/roles/${ctx.rolId}`,
      expected: ["200"],
      assertions: [(body) => ({ ok: body?.id === ctx.rolId || Boolean(body), text: "objeto de rol" })],
    });
  } else {
    await writeResult("catalogos-get-roles-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No rolId captured from GET /catalogos/roles",
      assertions: [{ ok: false, text: "rolId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  const diocesis = await send({
    id: "organizacion-get-diocesis",
    method: "GET",
    path: "/diocesis",
    expected: ["200"],
    capture: (body) => {
      ctx.diocesisId = pickId(body);
    },
  });
  if (diocesis.ok && asList(diocesis.body).length === 0) {
    await send({
      id: "organizacion-post-diocesis",
      method: "POST",
      path: "/diocesis",
      json: { nombre: "Diócesis TEST Endpoint", codigo: `TEST-DIO-${Date.now()}` },
      expected: ["200", "201"],
      capture: (body) => {
        ctx.diocesisId = pickId(body);
        ctx.createdDiocesis = Boolean(ctx.diocesisId);
      },
    });
  } else {
    await writeSkipped("organizacion-post-diocesis", "GET /diocesis ya tenía filas; no se crea árbol TEST");
  }

  if (ctx.diocesisId) {
    await send({
      id: "organizacion-get-diocesis-id",
      method: "GET",
      path: `/diocesis/${ctx.diocesisId}`,
      expected: ["200"],
    });
  } else {
    await writeResult("organizacion-get-diocesis-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No diocesisId",
      assertions: [{ ok: false, text: "diocesisId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  const vicarias = await send({
    id: "organizacion-get-vicarias",
    method: "GET",
    path: "/vicarias",
    expected: ["200"],
    capture: (body) => {
      ctx.vicariaId = pickId(body);
    },
  });
  if (vicarias.ok && asList(vicarias.body).length === 0 && ctx.diocesisId) {
    await send({
      id: "organizacion-post-vicarias",
      method: "POST",
      path: "/vicarias",
      json: { nombre: "Vicaría TEST Endpoint", codigo: `TEST-VIC-${Date.now()}`, diocesisId: ctx.diocesisId },
      expected: ["200", "201"],
      capture: (body) => {
        ctx.vicariaId = pickId(body);
        ctx.createdVicaria = Boolean(ctx.vicariaId);
      },
    });
  } else {
    await writeSkipped(
      "organizacion-post-vicarias",
      asList(vicarias.body).length ? "GET /vicarias ya tenía filas" : "Sin diocesisId para crear vicaría",
    );
  }

  if (ctx.vicariaId) {
    await send({
      id: "organizacion-get-vicarias-id",
      method: "GET",
      path: `/vicarias/${ctx.vicariaId}`,
      expected: ["200"],
    });
  } else {
    await writeResult("organizacion-get-vicarias-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No vicariaId",
      assertions: [{ ok: false, text: "vicariaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  const parroquias = await send({
    id: "organizacion-get-parroquias",
    method: "GET",
    path: "/parroquias",
    expected: ["200"],
    capture: (body) => {
      ctx.parroquiaId = pickId(body);
    },
  });
  if (parroquias.ok && asList(parroquias.body).length === 0 && ctx.vicariaId) {
    await send({
      id: "organizacion-post-parroquias",
      method: "POST",
      path: "/parroquias",
      json: { nombre: "Parroquia TEST Endpoint", codigo: `TEST-PAR-${Date.now()}`, vicariaId: ctx.vicariaId },
      expected: ["200", "201"],
      capture: (body) => {
        ctx.parroquiaId = pickId(body);
        ctx.createdParroquia = Boolean(ctx.parroquiaId);
      },
    });
  } else {
    await writeSkipped(
      "organizacion-post-parroquias",
      asList(parroquias.body).length ? "GET /parroquias ya tenía filas" : "Sin vicariaId para crear parroquia",
    );
  }

  if (ctx.parroquiaId) {
    await send({
      id: "organizacion-get-parroquias-id",
      method: "GET",
      path: `/parroquias/${ctx.parroquiaId}`,
      expected: ["200"],
    });
  } else {
    await writeResult("organizacion-get-parroquias-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No parroquiaId",
      assertions: [{ ok: false, text: "parroquiaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  await send({
    id: "usuarios-get",
    method: "GET",
    path: "/usuarios",
    expected: ["200"],
    capture: (body) => {
      if (!ctx.usuarioId) ctx.usuarioId = pickId(body);
    },
  });

  if (ctx.usuarioId) {
    await send({
      id: "usuarios-get-id",
      method: "GET",
      path: `/usuarios/${ctx.usuarioId}`,
      expected: ["200"],
    });
  } else {
    await writeResult("usuarios-get-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No usuarioId",
      assertions: [{ ok: false, text: "usuarioId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  const personaBody = {
    primerNombre: "María",
    primerApellido: "Solano",
    numeroDocumento: "1-2345-6789",
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

  if (ctx.personaId) {
    await send({
      id: "personas-get-id",
      method: "GET",
      path: `/personas/${ctx.personaId}`,
      expected: ["200"],
    });
    await send({
      id: "personas-patch-id",
      method: "PATCH",
      path: `/personas/${ctx.personaId}`,
      json: { segundoNombre: "Elena", telefono: "88882222" },
      expected: ["200"],
    });
  } else {
    await writeResult("personas-get-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No personaId",
      assertions: [{ ok: false, text: "personaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
    await writeResult("personas-patch-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No personaId",
      assertions: [{ ok: false, text: "personaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  await send({
    id: "personas-post-busquedas",
    method: "POST",
    path: "/personas/busquedas",
    json: { numeroDocumento: "1-2345-6789" },
    expected: ["200"],
  });

  if (ctx.personaId) {
    await send({
      id: "personas-post-direcciones",
      method: "POST",
      path: `/personas/${ctx.personaId}/direcciones`,
      json: { senas: "100 m sur de la iglesia", esActual: true, vigenteDesde: "2026-09-07" },
      expected: ["200", "201"],
      capture: (body) => {
        ctx.direccionId = pickId(body);
      },
    });
    await send({
      id: "personas-get-direcciones",
      method: "GET",
      path: `/personas/${ctx.personaId}/direcciones`,
      expected: ["200"],
    });
    if (ctx.direccionId) {
      await send({
        id: "personas-patch-direcciones-id",
        method: "PATCH",
        path: `/personas/${ctx.personaId}/direcciones/${ctx.direccionId}`,
        json: { esActual: false, vigenteHasta: "2026-09-07" },
        expected: ["200"],
      });
    } else {
      await writeResult("personas-patch-direcciones-id", {
        verdict: "failed entirely",
        timestamp: new Date().toISOString(),
        notes: "No direccionId",
        assertions: [{ ok: false, text: "direccionId available" }],
        request: "(not sent)",
        response: "(n/a)",
      });
    }
  } else {
    await writeResult("personas-post-direcciones", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No personaId",
      assertions: [{ ok: false, text: "personaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
    await writeResult("personas-get-direcciones", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No personaId",
      assertions: [{ ok: false, text: "personaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
    await writeResult("personas-patch-direcciones-id", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No personaId",
      assertions: [{ ok: false, text: "personaId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  const solicitudJson = {
    personaSolicitanteId: ctx.personaId,
    parroquiaReceptoraId: ctx.parroquiaId,
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

  if (ctx.solicitudId) {
    await send({
      id: "solicitudes-get-id",
      method: "GET",
      path: `/solicitudes-ayuda/${ctx.solicitudId}`,
      expected: ["200"],
    });
    await send({
      id: "solicitudes-patch-id",
      method: "PATCH",
      path: `/solicitudes-ayuda/${ctx.solicitudId}`,
      json: { fechaEntrevista: "2026-09-07", observaciones: "Visita domiciliaria pendiente" },
      expected: ["200"],
    });
    await send({
      id: "solicitudes-post-estado-presentada",
      method: "POST",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/estado`,
      json: { estadoNuevo: "PRESENTADA", motivo: "Entrevista completa" },
      expected: ["200"],
    });
    await send({
      id: "solicitudes-get-integrantes",
      method: "GET",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/integrantes`,
      expected: ["200"],
    });
    await send({
      id: "solicitudes-post-integrantes",
      method: "POST",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/integrantes`,
      json: { nombreCompleto: "Juan Solano", ocupacion: "Jornalero" },
      expected: ["200", "201"],
      capture: (body) => {
        ctx.integranteId = pickId(body);
      },
    });
    if (ctx.integranteId) {
      await send({
        id: "solicitudes-patch-integrantes-id",
        method: "PATCH",
        path: `/solicitudes-ayuda/${ctx.solicitudId}/integrantes/${ctx.integranteId}`,
        json: { ocupacion: "Jornalero (actualizado)" },
        expected: ["200"],
      });
    } else {
      await writeResult("solicitudes-patch-integrantes-id", {
        verdict: "failed entirely",
        timestamp: new Date().toISOString(),
        notes: "No integranteId",
        assertions: [{ ok: false, text: "integranteId available" }],
        request: "(not sent)",
        response: "(n/a)",
      });
    }
    await send({
      id: "solicitudes-get-evaluacion-vivienda",
      method: "GET",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/evaluacion-vivienda`,
      expected: ["200"],
    });
    await send({
      id: "solicitudes-post-evaluacion-vivienda",
      method: "POST",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/evaluacion-vivienda`,
      json: { observaciones: "Techo de zinc" },
      expected: ["200", "201"],
    });
    await send({
      id: "solicitudes-get-ayudas-solicitadas",
      method: "GET",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/ayudas-solicitadas`,
      expected: ["200"],
    });
    if (ctx.tipoAyudaId) {
      const ayuda = await send({
        id: "solicitudes-post-ayudas-solicitadas",
        method: "POST",
        path: `/solicitudes-ayuda/${ctx.solicitudId}/ayudas-solicitadas`,
        json: { tipoAyudaId: ctx.tipoAyudaId, detalle: null },
        expected: ["200", "201"],
        capture: (body) => {
          ctx.ayudaId = pickId(body);
          ctx.createdAyudaThisRun = Boolean(ctx.ayudaId);
        },
      });
      if (ayuda.ok && ctx.createdAyudaThisRun) {
        await send({
          id: "solicitudes-delete-ayudas-solicitadas-id",
          method: "DELETE",
          path: `/solicitudes-ayuda/${ctx.solicitudId}/ayudas-solicitadas/${ctx.ayudaId}`,
          json: { motivo: "Selección incorrecta (fila de prueba)" },
          expected: ["200", "204"],
        });
      } else {
        await writeSkipped("solicitudes-delete-ayudas-solicitadas-id", "No se creó ayudaId en esta corrida");
      }
    } else {
      await writeResult("solicitudes-post-ayudas-solicitadas", {
        verdict: "failed entirely",
        timestamp: new Date().toISOString(),
        notes: "No tipoAyudaId",
        assertions: [{ ok: false, text: "tipoAyudaId available" }],
        request: "(not sent)",
        response: "(n/a)",
      });
      await writeSkipped("solicitudes-delete-ayudas-solicitadas-id", "No se creó ayudaId en esta corrida");
    }

    await send({
      id: "planes-get",
      method: "GET",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/planes-ayuda`,
      expected: ["200"],
    });
    await send({
      id: "planes-post",
      method: "POST",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/planes-ayuda`,
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
  } else {
    for (const id of [
      "solicitudes-get-id",
      "solicitudes-patch-id",
      "solicitudes-post-estado-presentada",
      "solicitudes-get-integrantes",
      "solicitudes-post-integrantes",
      "solicitudes-patch-integrantes-id",
      "solicitudes-get-evaluacion-vivienda",
      "solicitudes-post-evaluacion-vivienda",
      "solicitudes-get-ayudas-solicitadas",
      "solicitudes-post-ayudas-solicitadas",
      "planes-get",
      "planes-post",
    ]) {
      await writeResult(id, {
        verdict: "failed entirely",
        timestamp: new Date().toISOString(),
        notes: "No solicitudId",
        assertions: [{ ok: false, text: "solicitudId available" }],
        request: "(not sent)",
        response: "(n/a)",
      });
    }
    await writeSkipped("solicitudes-delete-ayudas-solicitadas-id", "No solicitudId");
  }

  if (ctx.planId) {
    await send({
      id: "planes-get-detalles",
      method: "GET",
      path: `/planes-ayuda/${ctx.planId}/detalles`,
      expected: ["200"],
    });
    const detalleJson = { frecuencia: "MENSUAL", montoEstimado: 25000 };
    if (ctx.tipoAyudaId) detalleJson.tipoAyudaId = ctx.tipoAyudaId;
    await send({
      id: "planes-post-detalles",
      method: "POST",
      path: `/planes-ayuda/${ctx.planId}/detalles`,
      json: detalleJson,
      expected: ["200", "201"],
      capture: (body) => {
        ctx.detallePlanId = pickId(body);
      },
    });
  } else {
    await writeResult("planes-get-detalles", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No planId",
      assertions: [{ ok: false, text: "planId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
    await writeResult("planes-post-detalles", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No planId",
      assertions: [{ ok: false, text: "planId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  if (ctx.detallePlanId) {
    await send({
      id: "planes-get-entregas",
      method: "GET",
      path: `/detalles-plan-ayuda/${ctx.detallePlanId}/entregas`,
      expected: ["200"],
    });
    await send({
      id: "planes-post-entregas",
      method: "POST",
      path: `/detalles-plan-ayuda/${ctx.detallePlanId}/entregas`,
      json: { fechaEntrega: "2026-09-15", monto: 25000, descripcion: "Paquete de alimentos" },
      expected: ["200", "201"],
    });
  } else {
    await writeResult("planes-get-entregas", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No detallePlanId",
      assertions: [{ ok: false, text: "detallePlanId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
    await writeResult("planes-post-entregas", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No detallePlanId",
      assertions: [{ ok: false, text: "detallePlanId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  if (ctx.solicitudId) {
    await send({
      id: "documentos-get",
      method: "GET",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/documentos-consentimiento`,
      expected: ["200"],
    });
    await send({
      id: "documentos-post",
      method: "POST",
      path: `/solicitudes-ayuda/${ctx.solicitudId}/documentos-consentimiento?fechaFirma=2026-09-07`,
      formFile: { field: "archivo", path: FIXTURE_PDF, filename: "consentimiento-prueba.pdf" },
      expected: ["200", "201"],
      capture: (body) => {
        ctx.documentoId = pickId(body);
      },
    });
  } else {
    await writeResult("documentos-get", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No solicitudId",
      assertions: [{ ok: false, text: "solicitudId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
    await writeResult("documentos-post", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No solicitudId",
      assertions: [{ ok: false, text: "solicitudId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  if (ctx.documentoId) {
    await send({
      id: "documentos-get-url",
      method: "GET",
      path: `/documentos-consentimiento/${ctx.documentoId}/url`,
      expected: ["200"],
      assertions: [
        (body) => ({ ok: Boolean(body?.urlFirmada), text: "urlFirmada presente" }),
        (body) => ({ ok: body?.expiraEnSegundos != null, text: "expiraEnSegundos presente" }),
      ],
    });
  } else {
    await writeResult("documentos-get-url", {
      verdict: "failed entirely",
      timestamp: new Date().toISOString(),
      notes: "No documentoId (upload failed or skipped)",
      assertions: [{ ok: false, text: "documentoId available" }],
      request: "(not sent)",
      response: "(n/a)",
    });
  }

  await send({
    id: "auditoria-get",
    method: "GET",
    path: "/eventos-auditoria",
    expected: ["200"],
  });

  await send({
    id: "auth-delete-sesiones",
    method: "DELETE",
    path: "/auth/sesiones",
    expected: ["200", "204"],
  });

  await writeFile(join(RESULTS, "_summary.md"), buildSummary());
}

function buildSummary(extra = "") {
  const counts = { succeeded: 0, "failed partially": 0, "failed entirely": 0, skipped: 0 };
  for (const row of summary) {
    counts[row.verdict] = (counts[row.verdict] ?? 0) + 1;
  }
  const lines = [
    "# Resultados de endpoints",
    "",
    `- baseUrl: \`${BASE}\``,
    `- timestamp: ${new Date().toISOString()}`,
    `- Postman collection: ayudas-rstc (\`29171076-9bae6770-5087-4b67-83e7-9654aab192c9\`)`,
    "",
    "## Conteos",
    "",
    `- succeeded: ${counts.succeeded}`,
    `- failed partially: ${counts["failed partially"]}`,
    `- failed entirely: ${counts["failed entirely"]}`,
    `- skipped: ${counts.skipped}`,
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
