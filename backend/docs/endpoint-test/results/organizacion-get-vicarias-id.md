# organizacion-get-vicarias-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.293Z
- durationMs: 19

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/vicarias/7014888f-750d-4a61-b07f-52335c4a683c
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 416
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"1a0-DS/OzfegEhIyzRjC62oN596nLHs"
keep-alive: timeout=5
x-powered-by: Express

{"id":"7014888f-750d-4a61-b07f-52335c4a683c","diocesisId":"db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8","nombre":"Vicaría TEST 1789061435274","codigo":"D04-V01","creadoEn":"2026-09-10T17:30:36.376065+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.376065+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

