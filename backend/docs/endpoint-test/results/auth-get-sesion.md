# auth-get-sesion

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:28.625Z
- durationMs: 1

## Assertions

- fail: HTTP 401 matches expected 200
- fail: tokenAcceso available before authenticated request
- fail: cuerpo presente

## Request

```http
GET http://localhost:3000/api/v1/auth/sesion
Authorization: (missing tokenAcceso)
```

## Response

```http
HTTP 401
connection: keep-alive
content-length: 54
content-type: application/json; charset=utf-8
date: Tue, 08 Sep 2026 14:24:28 GMT
etag: W/"36-7/fXKejgUjZKN8aW/UmVt+Lgj/Q"
keep-alive: timeout=5
x-powered-by: Express

{"codigo":"NO_AUTENTICADO","mensaje":"No autenticado"}
```

