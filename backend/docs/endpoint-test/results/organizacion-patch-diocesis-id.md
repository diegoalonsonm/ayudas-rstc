# organizacion-patch-diocesis-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.213Z
- durationMs: 23

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/diocesis/db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Diócesis TEST 1789061435274 actualizado"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 407
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"197-TlIKidtmqekbpT4HGr28dEPv+P0"
keep-alive: timeout=5
x-powered-by: Express

{"id":"db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8","nombre":"Diócesis TEST 1789061435274 actualizado","codigo":"D04","creadoEn":"2026-09-10T17:30:36.276741+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.315728+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

