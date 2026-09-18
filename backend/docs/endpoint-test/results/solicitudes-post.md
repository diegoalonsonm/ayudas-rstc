# solicitudes-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.664Z
- durationMs: 90

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "personaSolicitanteId": "b08e9a8c-c91e-4533-ab8a-fa55c89a0d63",
  "parroquiaReceptoraId": "f9c3ced6-626f-46f8-b8a6-e86536f2a9d1",
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
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"2d-SuPMAruBWd/ikSdnQFWBZZNCAGw"
keep-alive: timeout=5
x-powered-by: Express

{"id":"3fd57ce9-a675-42c1-a602-bb146b54280b"}
```

