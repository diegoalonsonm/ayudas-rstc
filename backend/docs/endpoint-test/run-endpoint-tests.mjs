#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

if (false) {
const ROOT = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(ROOT, "results");
const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000/api/v1").replace(/\/+$/, "");
const EMAIL = process.env.TEST_EMAIL ?? "admin2@local.test";
const PASSWORD = process.env.TEST_PASSWORD;
const PROVIDED_TOKEN = process.env.BEARER_TOKEN;
const RUN_ID = new Date().toISOString().replace(/\D/g, "").slice(0, 14);

if (!PASSWORD && !PROVIDED_TOKEN) {
  console.error("Set TEST_PASSWORD or BEARER_TOKEN before running the endpoint tests.");
  process.exit(2);
}

await mkdir(RESULTS_DIR, { recursive: true });

const tests = [];
const results = [];
const state = {
  token: PROVIDED_TOKEN,
  refreshToken: undefined,
  catalogs: {},
};

const secretKey = /(authorization|contrasena|password|token|urlFirmada)/i;

function redact(value, key = "") {
  if (secretKey.test(key) && value !== undefined && value !== null) {
    return "<REDACTED>";
  }
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, redact(child, childKey)]));
  }
  return value;
}

function bodyForEvidence(body) {
  if (body === undefined) return undefined;
  if (typeof body === "string") {
    try {
      return redact(JSON.parse(body));
    } catch {
      return body;
    }
  }
  return redact(body);
}

function add(source, name, method, path, options = {}) {
  tests.push({ source, name, method, path, ...options });
}

async function request(test) {
  const path = typeof test.path === "function" ? test.path() : test.path;
  const url = `${BASE_URL}${path}`;
  const headers = { Accept: "application/json", ...(test.headers ?? {}) };
  if (test.auth !== false) {
    if (!state.token) throw new Error("No bearer token is available");
    headers.Authorization = `Bearer ${state.token}`;
  }

  let requestBody;
  let fetchBody;
  if (test.multipart) {
    const form = new FormData();
    form.append(
      "archivo",
      new Blob(["%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n"], {
        type: "application/pdf",
      }),
      `consentimiento-${RUN_ID}.pdf`,
    );
    fetchBody = form;
    requestBody = {
      archivo: {
        nombre: `consentimiento-${RUN_ID}.pdf`,
        tipoMime: "application/pdf",
        contenido: "<BINARY_PDF_REDACTED>",
      },
    };
  } else if (test.body !== undefined) {
    const value = typeof test.body === "function" ? test.body() : test.body;
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(value);
    requestBody = value;
  }

  const startedAt = new Date();
  let response;
  try {
    response = await fetch(url, { method: test.method, headers, body: fetchBody, signal: AbortSignal.timeout(15000) });
  } catch (error) {
    return {
      source: test.source,
      name: test.name,
      method: test.method,
      path,
      outcome: "FAILED_ENTIRELY",
      startedAt: startedAt.toISOString(),
      durationMs: Date.now() - startedAt.getTime(),
      request: { url, headers: redact(headers), body: bodyForEvidence(requestBody) },
      response: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  const text = await response.text();
  let responseBody = text;
  try {
    responseBody = text ? JSON.parse(text) : null;
  } catch {
    // Keep non-JSON responses as text.
  }

  const expected = test.expectedStatuses ?? [200, 201, 204];
  let validationError;
  if (expected.includes(response.status) && test.validate) {
    try {
      test.validate(responseBody);
    } catch (error) {
      validationError = error instanceof Error ? error.message : String(error);
    }
  }
  const outcome = expected.includes(response.status) && !validationError ? "SUCCEEDED" : "FAILED_PARTIALLY";

  const result = {
    source: test.source,
    name: test.name,
    method: test.method,
    path,
    outcome,
    startedAt: startedAt.toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    request: { url, headers: redact(headers), body: bodyForEvidence(requestBody) },
    response: {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: redact(responseBody),
    },
    error: validationError,
  };

  if (outcome === "SUCCEEDED" && test.capture) test.capture(responseBody);
  return result;
}

async function runOne(test) {
  let result;
  try {
    result = await request(test);
  } catch (error) {
    const path = typeof test.path === "function" ? safely(test.path) : test.path;
    result = {
      source: test.source,
      name: test.name,
      method: test.method,
      path,
      outcome: "FAILED_ENTIRELY",
      startedAt: new Date().toISOString(),
      durationMs: 0,
      request: null,
      response: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  results.push(result);
  console.log(`${result.outcome.padEnd(18)} ${test.method.padEnd(6)} ${result.path} — ${test.name}`);
  return result;
}

function safely(fn) {
  try {
    return fn();
  } catch {
    return "<dependency unavailable>";
  }
}

function idOf(value) {
  if (Array.isArray(value)) return idOf(value[0]);
  if (!value || typeof value !== "object") return undefined;
  if (typeof value.id === "string") return value.id;
  for (const key of ["data", "resultado", "usuario", "solicitud", "persona", "plan", "detalle", "entrega"]) {
    const id = idOf(value[key]);
    if (id) return id;
  }
  return undefined;
}

function requireId(value, label) {
  const id = idOf(value);
  if (!id) throw new Error(`The response did not contain ${label} id`);
  return id;
}

function catalogId(name, index = 0) {
  const items = state.catalogs[name];
  const id = Array.isArray(items) ? idOf(items[index]) : undefined;
  if (!id) throw new Error(`Catalog ${name} has no item at index ${index}`);
  return id;
}

function uniqueCode(prefix) {
  return `${prefix}${RUN_ID.slice(-8)}`;
}

// Public health and authentication.
add("salud.md", "API health", "GET", "/salud", {
  auth: false,
  validate: (body) => {
    if (body?.estado !== "ok") throw new Error('Expected {"estado":"ok"}');
  },
});
add("auth.md", "Create session", "POST", "/auth/sesiones", {
  auth: false,
  body: () => ({ correo: EMAIL, contrasena: PASSWORD }),
  capture: (body) => {
    state.token = body.tokenAcceso ?? state.token;
    state.refreshToken = body.tokenRenovacion;
    state.currentUserId = body.usuario?.id;
  },
  validate: (body) => {
    if (!body?.tokenAcceso || !body?.tokenRenovacion) throw new Error("Access and refresh tokens were expected");
  },
});

// Session-dependent auth tests are inserted after login.
add("auth.md", "Get current session", "GET", "/auth/sesion");
add("auth.md", "Renew session", "POST", "/auth/sesiones/renovacion", {
  auth: false,
  body: () => ({ tokenRenovacion: state.refreshToken }),
  validate: (body) => {
    if (!body?.tokenAcceso || !body?.tokenRenovacion) throw new Error("Renewed tokens were expected");
  },
});

// Catalog reads: test every documented catalog and every item endpoint when seeded.
const catalogNames = [
  "tipos-documento",
  "sexos",
  "grados-academicos",
  "parentescos",
  "rangos-ingreso",
  "tipos-vivienda",
  "tipos-tenencia",
  "condiciones-vivienda",
  "tipos-ayuda",
  "roles",
  "cantones",
  "distritos",
  "barrios",
];
for (const name of catalogNames) {
  add("catalogos.md", `List catalog ${name}`, "GET", `/catalogos/${name}`, {
    capture: (body) => {
      state.catalogs[name] = body;
    },
    validate: (body) => {
      if (!Array.isArray(body)) throw new Error("Expected an array");
    },
  });
}

// Organization hierarchy is created before domain records and removed in reverse order.
add("organizacion.md", "List dioceses", "GET", "/diocesis");
add("organizacion.md", "Create diocese", "POST", "/diocesis", {
  body: () => ({ nombre: `Diócesis prueba ${RUN_ID}` }),
  capture: (body) => {
    state.dioceseId = requireId(body, "diocese");
  },
});
add("organizacion.md", "Get diocese", "GET", () => `/diocesis/${state.dioceseId}`);
add("organizacion.md", "Update diocese", "PATCH", () => `/diocesis/${state.dioceseId}`, {
  body: { nombre: `Diócesis prueba actualizada ${RUN_ID}` },
});
add("organizacion.md", "List vicariates", "GET", "/vicarias");
add("organizacion.md", "Create vicariate", "POST", "/vicarias", {
  body: () => ({ nombre: `Vicaría prueba ${RUN_ID}`, diocesisId: state.dioceseId }),
  capture: (body) => {
    state.vicariateId = requireId(body, "vicariate");
  },
});
add("organizacion.md", "Get vicariate", "GET", () => `/vicarias/${state.vicariateId}`);
add("organizacion.md", "Update vicariate", "PATCH", () => `/vicarias/${state.vicariateId}`, {
  body: { nombre: `Vicaría prueba actualizada ${RUN_ID}` },
});
add("organizacion.md", "List parishes", "GET", "/parroquias");
add("organizacion.md", "Create parish", "POST", "/parroquias", {
  body: () => ({ nombre: `Parroquia prueba ${RUN_ID}`, vicariaId: state.vicariateId }),
  capture: (body) => {
    state.parishId = requireId(body, "parish");
  },
});
add("organizacion.md", "Get parish", "GET", () => `/parroquias/${state.parishId}`);
add("organizacion.md", "Update parish", "PATCH", () => `/parroquias/${state.parishId}`, {
  body: { nombre: `Parroquia prueba actualizada ${RUN_ID}` },
});

// Catalog item reads are added after catalog list calls have populated IDs.
for (const name of catalogNames) {
  add("catalogos.md", `Get catalog item ${name}`, "GET", () => `/catalogos/${name}/${catalogId(name)}`);
}
add("catalogos.md", "Create canton catalog item", "POST", "/catalogos/cantones", {
  body: () => ({ codigo: uniqueCode("T"), nombre: `Cantón prueba ${RUN_ID}` }),
  capture: (body) => {
    state.testCantonId = requireId(body, "canton");
  },
});
add("catalogos.md", "Update canton catalog item", "PATCH", () => `/catalogos/cantones/${state.testCantonId}`, {
  body: { nombre: `Cantón prueba actualizado ${RUN_ID}` },
});
add("catalogos.md", "Delete canton catalog item", "DELETE", () => `/catalogos/cantones/${state.testCantonId}`, {
  body: { motivo: "Limpieza de prueba automatizada" },
});

// People and addresses.
add("personas.md", "Create person", "POST", "/personas", {
  body: () => ({
    tipoDocumentoId: catalogId("tipos-documento"),
    numeroDocumento: `TEST-${RUN_ID}`,
    primerNombre: "María",
    primerApellido: "Prueba",
    telefono: "88881111",
  }),
  capture: (body) => {
    state.personId = requireId(body, "person");
  },
});
add("personas.md", "List people", "GET", "/personas");
add("personas.md", "Get person", "GET", () => `/personas/${state.personId}`);
add("personas.md", "Update person", "PATCH", () => `/personas/${state.personId}`, {
  body: { segundoNombre: "Elena", telefono: "88882222" },
});
add("personas.md", "Search person", "POST", "/personas/busquedas", {
  body: () => ({ numeroDocumento: `TEST-${RUN_ID}` }),
});
add("personas.md", "Create address", "POST", () => `/personas/${state.personId}/direcciones`, {
  body: { senas: "100 m sur de la iglesia — prueba automatizada", esActual: true, vigenteDesde: "2026-09-08" },
  capture: (body) => {
    state.addressId = requireId(body, "address");
  },
});
add("personas.md", "List addresses", "GET", () => `/personas/${state.personId}/direcciones`);
add("personas.md", "Update address", "PATCH", () => `/personas/${state.personId}/direcciones/${state.addressId}`, {
  body: { esActual: false, vigenteHasta: "2026-09-08" },
});

// Aid request and nested resources.
add("solicitudesAyuda.md", "Create aid request", "POST", "/solicitudes-ayuda", {
  body: () => ({
    personaSolicitanteId: state.personId,
    parroquiaReceptoraId: state.parishId,
    sectorOficial: "Barrio Centro",
    tiposAyuda: [catalogId("tipos-ayuda")],
    estado: "BORRADOR",
  }),
  capture: (body) => {
    state.requestId = requireId(body, "aid request");
  },
});
add("solicitudesAyuda.md", "List aid requests", "GET", "/solicitudes-ayuda");
add("solicitudesAyuda.md", "Get aid request", "GET", () => `/solicitudes-ayuda/${state.requestId}`);
add("solicitudesAyuda.md", "Update aid request", "PATCH", () => `/solicitudes-ayuda/${state.requestId}`, {
  body: { fechaEntrevista: "2026-09-08", observaciones: "Visita domiciliaria pendiente" },
});
add("solicitudesAyuda.md", "Create household member", "POST", () => `/solicitudes-ayuda/${state.requestId}/integrantes`, {
  body: { nombreCompleto: "Juan Prueba", ocupacion: "Jornalero" },
  capture: (body) => {
    state.memberId = requireId(body, "household member");
  },
});
add("solicitudesAyuda.md", "List household members", "GET", () => `/solicitudes-ayuda/${state.requestId}/integrantes`);
add(
  "solicitudesAyuda.md",
  "Update household member",
  "PATCH",
  () => `/solicitudes-ayuda/${state.requestId}/integrantes/${state.memberId}`,
  { body: { ocupacion: "Trabajador independiente" } },
);
add("solicitudesAyuda.md", "Save housing evaluation", "POST", () => `/solicitudes-ayuda/${state.requestId}/evaluacion-vivienda`, {
  body: { observaciones: "Techo de zinc" },
});
add("solicitudesAyuda.md", "Get housing evaluation", "GET", () => `/solicitudes-ayuda/${state.requestId}/evaluacion-vivienda`);
add("solicitudesAyuda.md", "List requested aid", "GET", () => `/solicitudes-ayuda/${state.requestId}/ayudas-solicitadas`);
add("solicitudesAyuda.md", "Create requested aid", "POST", () => `/solicitudes-ayuda/${state.requestId}/ayudas-solicitadas`, {
  body: () => ({ tipoAyudaId: catalogId("tipos-ayuda", 1), detalle: "Ítem de prueba automatizada" }),
  capture: (body) => {
    state.requestedAidId = requireId(body, "requested aid");
  },
});
add(
  "solicitudesAyuda.md",
  "Delete requested aid",
  "DELETE",
  () => `/solicitudes-ayuda/${state.requestId}/ayudas-solicitadas/${state.requestedAidId}`,
  { body: { motivo: "Limpieza de prueba automatizada" } },
);

// Consent documents.
add(
  "documentosConsentimiento.md",
  "Upload consent document",
  "POST",
  () => `/solicitudes-ayuda/${state.requestId}/documentos-consentimiento?fechaFirma=2026-09-08`,
  {
    multipart: true,
    capture: (body) => {
      state.documentId = requireId(body, "document");
    },
  },
);
add(
  "documentosConsentimiento.md",
  "List consent documents",
  "GET",
  () => `/solicitudes-ayuda/${state.requestId}/documentos-consentimiento`,
);
add(
  "documentosConsentimiento.md",
  "Get signed document URL",
  "GET",
  () => `/documentos-consentimiento/${state.documentId}/url?descargar=true`,
  {
    validate: (body) => {
      if (!body?.urlFirmada) throw new Error("A signed URL was expected");
    },
  },
);

// Plans, plan details, and deliveries.
add("planesAyuda.md", "Create aid plan", "POST", () => `/solicitudes-ayuda/${state.requestId}/planes-ayuda`, {
  body: {
    decision: "APROBADA",
    fechaInicio: "2026-09-08",
    fechaFin: "2026-12-01",
    motivoDecision: "Prueba automatizada",
  },
  capture: (body) => {
    state.planId = requireId(body, "aid plan");
  },
});
add("planesAyuda.md", "List aid plans", "GET", () => `/solicitudes-ayuda/${state.requestId}/planes-ayuda`);
add("planesAyuda.md", "Create plan detail", "POST", () => `/planes-ayuda/${state.planId}/detalles`, {
  body: () => ({ tipoAyudaId: catalogId("tipos-ayuda"), frecuencia: "MENSUAL", montoEstimado: 25000 }),
  capture: (body) => {
    state.planDetailId = requireId(body, "plan detail");
  },
});
add("planesAyuda.md", "List plan details", "GET", () => `/planes-ayuda/${state.planId}/detalles`);
add("planesAyuda.md", "Register delivery", "POST", () => `/detalles-plan-ayuda/${state.planDetailId}/entregas`, {
  body: { fechaEntrega: "2026-09-15", monto: 25000, descripcion: "Paquete de alimentos" },
  capture: (body) => {
    state.deliveryId = requireId(body, "delivery");
  },
});
add("planesAyuda.md", "List deliveries", "GET", () => `/detalles-plan-ayuda/${state.planDetailId}/entregas`);

// Workflow and logical deletion are tested after nested records exist.
add("solicitudesAyuda.md", "Change aid request state", "POST", () => `/solicitudes-ayuda/${state.requestId}/estado`, {
  body: { estadoNuevo: "PRESENTADA", motivo: "Entrevista completa" },
});
add("solicitudesAyuda.md", "Logically delete aid request", "POST", () => `/solicitudes-ayuda/${state.requestId}/eliminacion`, {
  body: { motivo: "Prueba de eliminación lógica" },
});
add("solicitudesAyuda.md", "Restore aid request", "POST", () => `/solicitudes-ayuda/${state.requestId}/restauracion`, {
  body: { motivo: "Restauración de prueba automatizada" },
});

// User lifecycle.
add("usuarios.md", "List users", "GET", "/usuarios");
add("usuarios.md", "Create user", "POST", "/usuarios", {
  body: () => ({
    nombreCompleto: "Usuario Prueba Automatizada",
    correo: `endpoint-test-${RUN_ID}@local.test`,
    contrasena: "Cambiar1234",
    rolCodigo: "PERSONAL_PASTORAL",
    parroquiaId: state.parishId,
    motivo: "Alta para prueba automatizada",
  }),
  capture: (body) => {
    state.userId = requireId(body, "user");
  },
});
add("usuarios.md", "Get user", "GET", () => `/usuarios/${state.userId}`);
add("usuarios.md", "Change user assignment", "POST", () => `/usuarios/${state.userId}/asignaciones`, {
  body: () => ({
    rolCodigo: "COORDINADOR_PARROQUIAL",
    parroquiaId: state.parishId,
    motivo: "Prueba de reasignación",
  }),
});
add("usuarios.md", "Deactivate user", "PATCH", () => `/usuarios/${state.userId}`, {
  body: { activo: false, motivo: "Limpieza de prueba automatizada" },
});

// Read-only audit and organization cleanup.
add("eventosAuditoria.md", "List audit events", "GET", "/eventos-auditoria");
add("organizacion.md", "Delete parish", "DELETE", () => `/parroquias/${state.parishId}`, {
  body: { motivo: "Limpieza de prueba automatizada" },
});
add("organizacion.md", "Delete vicariate", "DELETE", () => `/vicarias/${state.vicariateId}`, {
  body: { motivo: "Limpieza de prueba automatizada" },
});
add("organizacion.md", "Delete diocese", "DELETE", () => `/diocesis/${state.dioceseId}`, {
  body: { motivo: "Limpieza de prueba automatizada" },
});

// Closing the session must be last because it can revoke the active JWT.
add("auth.md", "Close session", "DELETE", "/auth/sesiones");

for (const test of tests) {
  await runOne(test);
}

function overall(items) {
  const successful = items.filter((item) => item.outcome === "SUCCEEDED").length;
  if (successful === items.length) return "SUCCEEDED";
  if (successful === 0) return "FAILED_ENTIRELY";
  return "FAILED_PARTIALLY";
}

function formatJson(value) {
  if (value === undefined) return "_None_";
  return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

function resultMarkdown(source, items) {
  const lines = [
    `# Results: ${source}`,
    "",
    `- Run: \`${RUN_ID}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Overall: **${overall(items)}**`,
    `- Succeeded: ${items.filter((item) => item.outcome === "SUCCEEDED").length}/${items.length}`,
    "",
  ];
  items.forEach((item, index) => {
    lines.push(
      `## ${index + 1}. ${item.method} ${item.path}`,
      "",
      `- Case: ${item.name}`,
      `- Outcome: **${item.outcome}**`,
      `- Started: \`${item.startedAt}\``,
      `- Duration: ${item.durationMs} ms`,
      "",
      "### Request",
      "",
      formatJson(item.request),
      "",
      "### Response",
      "",
      formatJson(item.response),
    );
    if (item.error) lines.push("", "### Error", "", `\`${item.error}\``);
    lines.push("");
  });
  return `${lines.join("\n")}\n`;
}

const grouped = Map.groupBy(results, (result) => result.source);
for (const [source, items] of grouped) {
  const outputName = source.replace(/\.md$/, ".results.md");
  await writeFile(join(RESULTS_DIR, outputName), resultMarkdown(source, items), "utf8");
}

const summary = [
  "# Endpoint test results",
  "",
  `- Run: \`${RUN_ID}\``,
  `- Base URL: \`${BASE_URL}\``,
  `- Overall: **${overall(results)}**`,
  `- Total: ${results.length}`,
  `- Succeeded: ${results.filter((item) => item.outcome === "SUCCEEDED").length}`,
  `- Failed partially: ${results.filter((item) => item.outcome === "FAILED_PARTIALLY").length}`,
  `- Failed entirely: ${results.filter((item) => item.outcome === "FAILED_ENTIRELY").length}`,
  "",
  "## By documentation file",
  "",
  ...[...grouped.entries()].map(
    ([source, items]) =>
      `- [${source}](${source.replace(/\.md$/, ".results.md")}): **${overall(items)}** (${items.filter((item) => item.outcome === "SUCCEEDED").length}/${items.length})`,
  ),
  "",
  "Secrets, bearer tokens, refresh tokens, passwords, signed URLs, and uploaded binary content are redacted.",
  "",
].join("\n");
await writeFile(join(RESULTS_DIR, "README.md"), summary, "utf8");

const cases = [
  "# Endpoint test cases",
  "",
  `Generated by \`run-endpoint-tests.mjs\`. Total cases: ${tests.length}.`,
  "",
  "| # | Documentation | Method | Endpoint | Case |",
  "|---:|---|---|---|---|",
  ...tests.map(
    (test, index) =>
      `| ${index + 1} | ${test.source} | ${test.method} | \`${typeof test.path === "function" ? safely(test.path) : test.path}\` | ${test.name} |`,
  ),
  "",
].join("\n");
await writeFile(join(ROOT, "CASES.md"), cases, "utf8");

console.log(`\nOverall: ${overall(results)}. Results written to ${RESULTS_DIR}`);
if (overall(results) !== "SUCCEEDED") process.exitCode = 1;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS = join(__dirname, "results");
const FIXTURE_PDF = join(__dirname, "fixtures", "consentimiento-prueba.pdf");
const BASE = process.env.BASE_URL ?? "http://localhost:3000/api/v1";
const LOGIN = {
  correo: process.env.AUTH_CORREO ?? "admin2@local.test",
  contrasena: process.env.AUTH_CONTRASENA ?? "Cambiar1234",
};
const MISSING_ID = "00000000-0000-0000-0000-000000000000";
const STAMP = Date.now();

const ctx = {
  tokenAcceso: "",
  tokenRenovacion: "",
  tipoDocumentoId: "",
  tipoAyudaId: "",
  tipoAyudaIdAlterno: "",
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
    .replace(/"(contrasena|password)"\s*:\s*"[^"]*"/gi, '"$1": "[REDACTED]"')
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
          const list = asList(body);
          ctx[captureKey] = list[0]?.id ?? pickId(body);
          if (captureKey === "tipoAyudaId") {
            ctx.tipoAyudaIdAlterno = list[1]?.id ?? "";
          }
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
    json: { tipoAyudaId: ctx.tipoAyudaIdAlterno || ctx.tipoAyudaId || MISSING_ID, detalle: null },
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
