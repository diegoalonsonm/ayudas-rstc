# catalogos-post-cantones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.081Z
- durationMs: 28

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/catalogos/cantones
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "codigo": "T73974",
  "nombre": "Canton TEST 1789062473974"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 361
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"169-zPV1FGgcEt/0lm9yzNETPm91FS8"
keep-alive: timeout=5
x-powered-by: Express

{"id":"6c5bdf33-f127-4f87-a11e-77147b563573","codigo":"T73974","nombre":"Canton TEST 1789062473974","creadoEn":"2026-09-10T17:47:55.154983+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.154983+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

