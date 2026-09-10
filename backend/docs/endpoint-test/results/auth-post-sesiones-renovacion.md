# auth-post-sesiones-renovacion

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.674Z
- durationMs: 76

## Assertions

- pass: HTTP 201 matches expected 200|201
- pass: tokenAcceso presente
- pass: tokenRenovacion presente

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
HTTP 201
connection: keep-alive
content-length: 774
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"306-0bLfLJTQpTInbc/HSy2XLLcLzlk"
keep-alive: timeout=5
x-powered-by: Express

{"tokenAcceso": "[REDACTED]","tokenRenovacion": "[REDACTED]","expiraEn":3600}
```

