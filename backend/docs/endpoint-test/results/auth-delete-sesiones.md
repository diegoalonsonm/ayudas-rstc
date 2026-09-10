# auth-delete-sesiones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:58.273Z
- durationMs: 33

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/auth/sesiones
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 0
date: Thu, 10 Sep 2026 17:47:58 GMT
keep-alive: timeout=5
x-powered-by: Express

(empty)
```

