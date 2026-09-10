# solicitudes-patch-integrantes-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.068Z
- durationMs: 44

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/integrantes/9d2fea18-dd2c-48a2-9810-1035c198df0e
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "ocupacion": "Jornalero (actualizado)"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 667
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"29b-CRonSyhXRb9Dn9j2dTsBuo9dPPU"
keep-alive: timeout=5
x-powered-by: Express

{"id":"9d2fea18-dd2c-48a2-9810-1035c198df0e","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","personaId":null,"nombreCompleto":"Juan Solano","sexoId":null,"ocupacion":"Jornalero (actualizado)","tipoDocumentoId":null,"numeroDocumentoCifrado":null,"numeroDocumentoHash":null,"gradoAcademicoId":null,"rangoIngresoId":null,"cuentaConSeguro":null,"parentescoId":null,"creadoEn":"2026-09-10T17:47:57.095939+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.143904+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

