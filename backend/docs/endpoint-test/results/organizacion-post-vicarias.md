# organizacion-post-vicarias

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.396Z
- durationMs: 37

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/vicarias
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Vicaría TEST 1789062473974",
  "diocesisId": "5ab240bd-b47b-4510-a0dd-cb9506a518ee"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 414
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"19e-3efOWXGTrCj0vGbD8KcZyzRUCfQ"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5caf5bc7-cefc-4329-a1a8-ea728ca6ecc6","diocesisId":"5ab240bd-b47b-4510-a0dd-cb9506a518ee","nombre":"Vicaría TEST 1789062473974","codigo":"D05-V01","creadoEn":"2026-09-10T17:47:55.47072+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.47072+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

