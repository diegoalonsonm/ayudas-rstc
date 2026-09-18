# documentos-get-url

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.842Z
- durationMs: 61

## Assertions

- pass: HTTP 200 matches expected 200
- pass: urlFirmada presente
- pass: expiraEnSegundos presente

## Request

```http
GET http://localhost:3000/api/v1/documentos-consentimiento/adc795b5-f27c-4dc6-aa8c-5470027ddec4/url
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 452
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"1c4-zf9chwJ+zbkYpxrQmOSq4F3QMgo"
keep-alive: timeout=5
x-powered-by: Express

{"urlFirmada": "[REDACTED]","expiraEnSegundos":60}
```

