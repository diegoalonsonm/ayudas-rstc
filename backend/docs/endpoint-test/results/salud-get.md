# salud-get

- verdict: **failed entirely**
- timestamp: 2026-09-07T19:12:22.235Z
- durationMs: 23

## Assertions

- fail: HTTP 500 matches expected 200
- fail: estado === ok

## Request

```http
GET http://localhost:3000/api/v1/salud
```

## Response

```http
HTTP 500
connection: keep-alive
content-length: 46
content-type: application/json; charset=utf-8
date: Mon, 07 Sep 2026 19:12:22 GMT
etag: W/"2e-Dh0HQtbGhii9BnpI31Ko0y4VuTg"
keep-alive: timeout=5
x-powered-by: Express

{"codigo":"INTERNO","mensaje":"Error interno"}
```

