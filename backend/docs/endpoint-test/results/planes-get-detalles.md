# planes-get-detalles

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.002Z
- durationMs: 20

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/planes-ayuda/410f64a7-e7d7-41b5-afca-ca564f3eb6fe/detalles
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
keep-alive: timeout=5
x-powered-by: Express

[]
```

