# auth-post-sesiones

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:28.623Z
- durationMs: 8

## Assertions

- fail: HTTP 422 matches expected 200|201
- fail: tokenAcceso presente
- fail: tokenRenovacion presente
- fail: usuario presente

## Request

```http
POST http://localhost:3000/api/v1/auth/sesiones
Content-Type: application/json

{
  "correo": "admin@local.test",
  "contrasena": "Cambiar1234"
}
```

## Response

```http
HTTP 422
connection: keep-alive
content-length: 59
content-type: application/json; charset=utf-8
date: Tue, 08 Sep 2026 14:24:28 GMT
etag: W/"3b-h5NK9Dq/79ode4EYae2bKMhTZr8"
keep-alive: timeout=5
x-powered-by: Express

{"codigo":"VALIDACION","mensaje":"TypeError: fetch failed"}
```

