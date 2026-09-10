# solicitudes-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.267Z
- durationMs: 64

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "personaSolicitanteId": "b0d46173-e137-4089-9757-7527223677e9",
  "parroquiaReceptoraId": "029075e4-f2a0-4efc-86e4-7a1a4dbdd382",
  "sectorOficial": "Barrio Centro",
  "estado": "BORRADOR",
  "tiposAyuda": [
    "c0048440-8693-5959-a613-bd7d4c0b61ee"
  ]
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 45
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"2d-G70FkZv0gU1O9VnkgTOb6lHYTWo"
keep-alive: timeout=5
x-powered-by: Express

{"id":"98468a57-02c3-4f43-8120-13ed93f72a48"}
```

