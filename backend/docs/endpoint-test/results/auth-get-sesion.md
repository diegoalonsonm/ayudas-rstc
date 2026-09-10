# auth-get-sesion

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.597Z
- durationMs: 19

## Assertions

- pass: HTTP 200 matches expected 200
- pass: cuerpo presente

## Request

```http
GET http://localhost:3000/api/v1/auth/sesion
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 196
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"c4-w1WXnGG9lcXvAjBLOqMEhu52IeE"
keep-alive: timeout=5
x-powered-by: Express

{"usuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","correo":"admin2@local.test","nombreCompleto":"Administrador","rolCodigo":"ADMINISTRADOR","diocesisId":null,"vicariaId":null,"parroquiaId":null}
```

