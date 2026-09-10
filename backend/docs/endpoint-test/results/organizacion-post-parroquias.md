# organizacion-post-parroquias

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.382Z
- durationMs: 26

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/parroquias
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Parroquia TEST 1789061435274",
  "vicariaId": "7014888f-750d-4a61-b07f-52335c4a683c"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 421
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"1a5-ZsyOK3lKhS6lENXypRc7PMv7Pto"
keep-alive: timeout=5
x-powered-by: Express

{"id":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","vicariaId":"7014888f-750d-4a61-b07f-52335c4a683c","nombre":"Parroquia TEST 1789061435274","codigo":"D04-V01-P001","creadoEn":"2026-09-10T17:30:36.485486+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.485486+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

