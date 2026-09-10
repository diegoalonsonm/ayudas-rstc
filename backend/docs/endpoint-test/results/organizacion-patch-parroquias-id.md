# organizacion-patch-parroquias-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.620Z
- durationMs: 43

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/parroquias/f9c3ced6-626f-46f8-b8a6-e86536f2a9d1
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Parroquia TEST 1789062473974 actualizado"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 466
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"1d2-iI/tO6kx5+4xgNJHMPY5tf65sd0"
keep-alive: timeout=5
x-powered-by: Express

{"id":"f9c3ced6-626f-46f8-b8a6-e86536f2a9d1","vicariaId":"5caf5bc7-cefc-4329-a1a8-ea728ca6ecc6","nombre":"Parroquia TEST 1789062473974 actualizado","codigo":"D05-V01-P001","creadoEn":"2026-09-10T17:47:55.611346+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.69556+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

