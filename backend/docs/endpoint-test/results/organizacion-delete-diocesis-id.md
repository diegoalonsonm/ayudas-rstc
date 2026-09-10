# organizacion-delete-diocesis-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.724Z
- durationMs: 41

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/diocesis/db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8
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
content-length: 504
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"1f8-IXR3/1b/E8sEtuKkw6z1XGNluY0"
keep-alive: timeout=5
x-powered-by: Express

{"id":"db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8","nombre":"Diócesis TEST 1789061435274 actualizado","codigo":"D04","creadoEn":"2026-09-10T17:30:36.276741+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.826392+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:30:38.708+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Reorganización (prueba endpoint-test)"}
```

