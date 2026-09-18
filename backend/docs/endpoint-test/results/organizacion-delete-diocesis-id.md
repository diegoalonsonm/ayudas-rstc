# organizacion-delete-diocesis-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:58.239Z
- durationMs: 39

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/diocesis/5ab240bd-b47b-4510-a0dd-cb9506a518ee
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Reorganización (prueba endpoint-test)"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 503
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:58 GMT
etag: W/"1f7-jyRQ76rrSPa2CWbAETKiQ5me5AI"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5ab240bd-b47b-4510-a0dd-cb9506a518ee","nombre":"Diócesis TEST 1789062473974 actualizado","codigo":"D05","creadoEn":"2026-09-10T17:47:55.31023+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:58.315284+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:47:58.224+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Reorganización (prueba endpoint-test)"}
```

