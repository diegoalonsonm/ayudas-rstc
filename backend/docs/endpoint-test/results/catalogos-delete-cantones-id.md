# catalogos-delete-cantones-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.169Z
- durationMs: 59

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/catalogos/cantones/6c5bdf33-f127-4f87-a11e-77147b563573
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Fila de prueba endpoint-test"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 493
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"1ed-0qSal5YCkRI0Nr13XG/wvClXBVw"
keep-alive: timeout=5
x-powered-by: Express

{"id":"6c5bdf33-f127-4f87-a11e-77147b563573","codigo":"T73974","nombre":"Canton TEST 1789062473974 actualizado","creadoEn":"2026-09-10T17:47:55.154983+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.24291+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:47:55.152+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Fila de prueba endpoint-test"}
```

