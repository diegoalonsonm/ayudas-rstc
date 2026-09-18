# personas-get-direcciones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.524Z
- durationMs: 22

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/personas/b08e9a8c-c91e-4533-ab8a-fa55c89a0d63/direcciones
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 505
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"1f9-WhJJhPI4ZMx1jnoFUwkBR6HqkaU"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"1a3b8309-b5e3-46d9-8c59-00e408b4a0c9","personaId":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","cantonId":null,"distritoId":null,"barrioId":null,"senas":"100 m sur de la iglesia","esActual":true,"vigenteDesde":"2026-09-07","vigenteHasta":null,"creadoEn":"2026-09-10T17:47:56.57866+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.57866+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

