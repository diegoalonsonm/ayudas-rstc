# catalogos-patch-cantones-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.082Z
- durationMs: 24

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/catalogos/cantones/867a4cbe-651f-45d3-b48d-f7adabf5e465
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Canton TEST 1789061435274 actualizado"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 407
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"197-gpHBuxA8pdFs4IEHyZjiPX2Hy6U"
keep-alive: timeout=5
x-powered-by: Express

{"id":"867a4cbe-651f-45d3-b48d-f7adabf5e465","codigo":"T35274","nombre":"Canton TEST 1789061435274 actualizado","creadoEn":"2026-09-10T17:30:36.159972+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.186341+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

