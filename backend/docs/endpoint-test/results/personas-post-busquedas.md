# personas-post-busquedas

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.089Z
- durationMs: 38

## Assertions

- pass: HTTP 201 matches expected 200

## Request

```http
POST http://localhost:3000/api/v1/personas/busquedas
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "numeroDocumento": "1-2345-5274"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 2
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
keep-alive: timeout=5
x-powered-by: Express

[]
```

