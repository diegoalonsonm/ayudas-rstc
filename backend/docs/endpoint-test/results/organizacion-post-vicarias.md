# organizacion-post-vicarias

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.273Z
- durationMs: 26

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/vicarias
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Vicaría TEST 1789061435274",
  "diocesisId": "db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 416
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"1a0-DS/OzfegEhIyzRjC62oN596nLHs"
keep-alive: timeout=5
x-powered-by: Express

{"id":"7014888f-750d-4a61-b07f-52335c4a683c","diocesisId":"db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8","nombre":"Vicaría TEST 1789061435274","codigo":"D04-V01","creadoEn":"2026-09-10T17:30:36.376065+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.376065+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

