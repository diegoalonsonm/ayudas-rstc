# planes-post

- verdict: **failed entirely**
- timestamp: 2026-09-08T14:24:54.234Z
- durationMs: 2

## Assertions

- fail: HTTP 401 matches expected 200|201
- fail: tokenAcceso available before authenticated request

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/00000000-0000-0000-0000-000000000000/planes-ayuda
Content-Type: application/json
Authorization: (missing tokenAcceso)

{
  "decision": "APROBADA",
  "fechaInicio": "2026-09-01",
  "fechaFin": "2026-12-01",
  "motivoDecision": "Comité parroquial"
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

