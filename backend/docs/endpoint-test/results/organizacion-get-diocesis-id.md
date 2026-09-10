# organizacion-get-diocesis-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.270Z
- durationMs: 27

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/diocesis/5ab240bd-b47b-4510-a0dd-cb9506a518ee
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 359
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"167-A637hHusav1rDb0xY9mDAZk9EoE"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5ab240bd-b47b-4510-a0dd-cb9506a518ee","nombre":"Diócesis TEST 1789062473974","codigo":"D05","creadoEn":"2026-09-10T17:47:55.31023+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.31023+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

