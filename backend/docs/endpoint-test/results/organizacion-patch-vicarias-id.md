# organizacion-patch-vicarias-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.319Z
- durationMs: 25

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/vicarias/7014888f-750d-4a61-b07f-52335c4a683c
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Vicaría TEST 1789061435274 actualizado"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 462
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"1ce-bVOpWKRFg9fDJzu5jNCJ4Ec5eDE"
keep-alive: timeout=5
x-powered-by: Express

{"id":"7014888f-750d-4a61-b07f-52335c4a683c","diocesisId":"db2bb6a1-1eb0-47c6-a19f-67ef2d945ed8","nombre":"Vicaría TEST 1789061435274 actualizado","codigo":"D04-V01","creadoEn":"2026-09-10T17:30:36.376065+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.423279+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

