# personas-post-busquedas

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:54.171Z
- durationMs: 3

## Assertions

- fail: HTTP 401 matches expected 200
- fail: tokenAcceso available before authenticated request

## Request

```http
POST http://localhost:3000/api/v1/personas/busquedas
Content-Type: application/json
Authorization: (missing tokenAcceso)

{
  "numeroDocumento": "1-2345-8590"
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

