# organizacion-get-diocesis

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.150Z
- durationMs: 41

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/diocesis
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 308
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"134-6cmwzXjLCy7wan7uW7i3qtuKuRc"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"ea083179-dd5b-40e5-91b7-763db583e219","nombre":"Cartago","codigo":"D01","creadoEn":"2026-09-08T14:53:13.293992+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T14:53:13.293992+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

