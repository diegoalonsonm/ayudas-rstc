# usuarios-patch-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.776Z
- durationMs: 78
- notes: PATCH sobre usuario creado en esta corrida

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/usuarios/8c0d106d-fa71-41f4-8cb3-cfb919458ff1
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "activo": false,
  "motivo": "Baja temporal de prueba endpoint-test"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 539
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"21b-gQjdquUz+ebamfWPyTPQGzhm+68"
keep-alive: timeout=5
x-powered-by: Express

{"id":"8c0d106d-fa71-41f4-8cb3-cfb919458ff1","identidadAutenticacionId":"9f704fc4-8203-4586-90e9-ceb009104940","nombreCompleto":"Usuario TEST 1789061435274","correo":"endpoint.test.1789061435274@local.test","activo":false,"ultimoAccesoEn":null,"creadoEn":"2026-09-10T17:30:36.783233+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.871286+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

