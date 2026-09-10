# salud-get

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:53.998Z
- durationMs: 23

## Assertions

- pass: HTTP 200 matches expected 200
- pass: estado === ok

## Request

```http
GET http://localhost:3000/api/v1/salud
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 15
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:53 GMT
etag: W/"f-zEyU8uspYexNXQo+eM6rxYB/Bc0"
keep-alive: timeout=5
x-powered-by: Express

{"estado":"ok"}
```

