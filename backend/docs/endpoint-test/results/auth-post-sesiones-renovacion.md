# auth-post-sesiones-renovacion

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:54.051Z
- durationMs: 25424
- notes: tokenRenovacion no capturado; se envía placeholder

## Assertions

- fail: HTTP 401 matches expected 200|201
- fail: tokenAcceso presente
- fail: tokenRenovacion presente

## Request

```http
POST http://localhost:3000/api/v1/auth/sesiones/renovacion
Content-Type: application/json

{
  "tokenRenovacion": "[REDACTED]"
}
```

## Response

```http
HTTP 401
connection: keep-alive
content-length: 69
content-type: application/json; charset=utf-8
date: Tue, 08 Sep 2026 14:24:54 GMT
etag: W/"45-0X+XBxGzfqMTiiUGOsUcVjbxSVc"
keep-alive: timeout=5
x-powered-by: Express

{"codigo":"NO_AUTENTICADO","mensaje":"No se pudo renovar la sesión"}
```

