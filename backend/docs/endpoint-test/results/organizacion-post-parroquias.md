# organizacion-post-parroquias

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.538Z
- durationMs: 33

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/parroquias
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Parroquia TEST 1789062473974",
  "vicariaId": "5caf5bc7-cefc-4329-a1a8-ea728ca6ecc6"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 421
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"1a5-K6pqh46x7iJ7NnvGuVICieMMgwM"
keep-alive: timeout=5
x-powered-by: Express

{"id":"f9c3ced6-626f-46f8-b8a6-e86536f2a9d1","vicariaId":"5caf5bc7-cefc-4329-a1a8-ea728ca6ecc6","nombre":"Parroquia TEST 1789062473974","codigo":"D05-V01-P001","creadoEn":"2026-09-10T17:47:55.611346+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.611346+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

