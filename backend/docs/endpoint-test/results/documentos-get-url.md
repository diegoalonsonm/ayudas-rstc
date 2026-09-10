# documentos-get-url

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.402Z
- durationMs: 57

## Assertions

- pass: HTTP 200 matches expected 200
- pass: urlFirmada presente
- pass: expiraEnSegundos presente

## Request

```http
GET http://localhost:3000/api/v1/documentos-consentimiento/1273433c-1274-4654-8cd5-0c059fc4c65a/url
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 452
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"1c4-IXSoIcgS7Q510a7d1MOtcmq91LY"
keep-alive: timeout=5
x-powered-by: Express

{"urlFirmada": "[REDACTED]","expiraEnSegundos":60}
```

