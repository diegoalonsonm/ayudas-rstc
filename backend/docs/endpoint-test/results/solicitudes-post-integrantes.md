# solicitudes-post-integrantes

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.023Z
- durationMs: 72

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/integrantes
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombreCompleto": "Juan Solano",
  "ocupacion": "Jornalero"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 619
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"26b-Ua+bL+hM6LzYD5NVmZaKvMtf8K4"
keep-alive: timeout=5
x-powered-by: Express

{"id":"9d2fea18-dd2c-48a2-9810-1035c198df0e","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","personaId":null,"nombreCompleto":"Juan Solano","sexoId":null,"ocupacion":"Jornalero","tipoDocumentoId":null,"numeroDocumentoCifrado":null,"numeroDocumentoHash":null,"gradoAcademicoId":null,"rangoIngresoId":null,"cuentaConSeguro":null,"parentescoId":null,"creadoEn":"2026-09-10T17:47:57.095939+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.095939+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

