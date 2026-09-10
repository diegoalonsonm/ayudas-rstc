# personas-get-direcciones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.172Z
- durationMs: 38

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/personas/b0d46173-e137-4089-9757-7527223677e9/direcciones
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 507
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"1fb-0yfB0SxvwFZhze1zZ+chp7LsVuM"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"323c3275-675e-4ae9-a6f4-24ac415f7838","personaId":"b0d46173-e137-4089-9757-7527223677e9","cantonId":null,"distritoId":null,"barrioId":null,"senas":"100 m sur de la iglesia","esActual":true,"vigenteDesde":"2026-09-07","vigenteHasta":null,"creadoEn":"2026-09-10T17:30:37.238177+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.238177+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

