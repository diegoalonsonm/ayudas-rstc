# personas-post-direcciones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.501Z
- durationMs: 58

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/personas/b08e9a8c-c91e-4533-ab8a-fa55c89a0d63/direcciones
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "senas": "100 m sur de la iglesia",
  "esActual": true,
  "vigenteDesde": "2026-09-07"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 503
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"1f7-WrCR6IMjwn4mPkqoPJHiUM6Ix7M"
keep-alive: timeout=5
x-powered-by: Express

{"id":"1a3b8309-b5e3-46d9-8c59-00e408b4a0c9","personaId":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","cantonId":null,"distritoId":null,"barrioId":null,"senas":"100 m sur de la iglesia","esActual":true,"vigenteDesde":"2026-09-07","vigenteHasta":null,"creadoEn":"2026-09-10T17:47:56.57866+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.57866+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

