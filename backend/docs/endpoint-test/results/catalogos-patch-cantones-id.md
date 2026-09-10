# catalogos-patch-cantones-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.110Z
- durationMs: 29

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/catalogos/cantones/6c5bdf33-f127-4f87-a11e-77147b563573
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Canton TEST 1789062473974 actualizado"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 407
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"197-lQFQU5iLS4OWlJrOOhHucFiMf1Y"
keep-alive: timeout=5
x-powered-by: Express

{"id":"6c5bdf33-f127-4f87-a11e-77147b563573","codigo":"T73974","nombre":"Canton TEST 1789062473974 actualizado","creadoEn":"2026-09-10T17:47:55.154983+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.182779+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

