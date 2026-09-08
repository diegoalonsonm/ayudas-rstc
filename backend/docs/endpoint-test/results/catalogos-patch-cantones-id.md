# catalogos-patch-cantones-id

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:54.104Z
- durationMs: 2
- notes: cantonId no capturado; se usa UUID placeholder

## Assertions

- fail: HTTP 401 matches expected 200
- fail: tokenAcceso available before authenticated request

## Request

```http
PATCH http://localhost:3000/api/v1/catalogos/cantones/00000000-0000-0000-0000-000000000000
Content-Type: application/json
Authorization: (missing tokenAcceso)

{
  "nombre": "Canton TEST 1788877468590 actualizado"
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

