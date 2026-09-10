# auth-post-sesiones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.577Z
- durationMs: 263

## Assertions

- pass: HTTP 201 matches expected 200|201
- pass: tokenAcceso presente
- pass: tokenRenovacion presente
- pass: usuario presente

## Request

```http
POST http://localhost:3000/api/v1/auth/sesiones
Content-Type: application/json

{
  "correo": "admin2@local.test",
  "contrasena": "[REDACTED]"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 1345
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"541-a3S/zed4lO5+oVLt1hRd9Yf2/H8"
keep-alive: timeout=5
x-powered-by: Express

{"tokenAcceso": "[REDACTED]","tokenRenovacion": "[REDACTED]","expiraEn":3600,"usuario":{"id":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","identidadAutenticacionId":"a3b2077f-3165-470a-b7f0-4e59724edf54","nombreCompleto":"Administrador","correo":"admin2@local.test","activo":true,"ultimoAccesoEn":"2026-09-10T17:17:31.725+00:00","creadoEn":"2026-09-08T17:32:13.660082+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-10T17:17:31.791802+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},"asignacion":{"rolCodigo":"ADMINISTRADOR","diocesisId":null,"vicariaId":null,"parroquiaId":null}}
```

