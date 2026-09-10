# personas-post-direcciones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.133Z
- durationMs: 43

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/personas/b0d46173-e137-4089-9757-7527223677e9/direcciones
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
content-length: 505
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"1f9-qf78ZYtD9zyPtSVI6z+3hxfMZro"
keep-alive: timeout=5
x-powered-by: Express

{"id":"323c3275-675e-4ae9-a6f4-24ac415f7838","personaId":"b0d46173-e137-4089-9757-7527223677e9","cantonId":null,"distritoId":null,"barrioId":null,"senas":"100 m sur de la iglesia","esActual":true,"vigenteDesde":"2026-09-07","vigenteHasta":null,"creadoEn":"2026-09-10T17:30:37.238177+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.238177+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

