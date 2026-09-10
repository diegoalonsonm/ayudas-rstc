# organizacion-delete-parroquias-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.646Z
- durationMs: 29
- notes: DELETE de parroquia creada en esta corrida

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/parroquias/029075e4-f2a0-4efc-86e4-7a1a4dbdd382
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Reorganización (prueba endpoint-test)"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 564
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"234-eLn46q797wQVg1SqVNjBKnjTl94"
keep-alive: timeout=5
x-powered-by: Express

{"id":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","vicariaId":"7014888f-750d-4a61-b07f-52335c4a683c","nombre":"Parroquia TEST 1789061435274 actualizado","codigo":"D04-V01-P001","creadoEn":"2026-09-10T17:30:36.485486+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.748387+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:30:38.632+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Reorganización (prueba endpoint-test)"}
```

