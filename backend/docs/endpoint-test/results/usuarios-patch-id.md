# usuarios-patch-id

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:54.155Z
- durationMs: 2
- notes: PATCH sobre usuario de sesión (no se pudo crear uno de prueba)

## Assertions

- fail: HTTP 401 matches expected 200
- fail: tokenAcceso available before authenticated request

## Request

```http
PATCH http://localhost:3000/api/v1/usuarios/00000000-0000-0000-0000-000000000000
Content-Type: application/json
Authorization: (missing tokenAcceso)

{
  "activo": false,
  "motivo": "Baja temporal de prueba endpoint-test"
}
```

## Response

```http
HTTP 401
connection: keep-alive
content-length: 54
content-type: application/json; charset=utf-8
date: Tue, 08 Sep 2026 14:24:54 GMT
etag: W/"36-7/fXKejgUjZKN8aW/UmVt+Lgj/Q"
keep-alive: timeout=5
x-powered-by: Express

{"codigo":"NO_AUTENTICADO","mensaje":"No autenticado"}
```

