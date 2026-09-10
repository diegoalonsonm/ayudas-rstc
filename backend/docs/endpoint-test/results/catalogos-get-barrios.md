# catalogos-get-barrios

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.002Z
- durationMs: 17

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/barrios
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
keep-alive: timeout=5
x-powered-by: Express

[]
```

