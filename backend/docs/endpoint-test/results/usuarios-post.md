# usuarios-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.697Z
- durationMs: 194

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/usuarios
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombreCompleto": "Usuario TEST 1789061435274",
  "correo": "endpoint.test.1789061435274@local.test",
  "contrasena": "[REDACTED]",
  "rolCodigo": "PERSONAL_PASTORAL",
  "parroquiaId": "029075e4-f2a0-4efc-86e4-7a1a4dbdd382",
  "motivo": "Alta de prueba endpoint-test"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 504
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"1f8-9olftsdFbtkcGz2zC4EUiPXvOaI"
keep-alive: timeout=5
x-powered-by: Express

{"id":"8c0d106d-fa71-41f4-8cb3-cfb919458ff1","identidadAutenticacionId":"9f704fc4-8203-4586-90e9-ceb009104940","nombreCompleto":"Usuario TEST 1789061435274","correo":"endpoint.test.1789061435274@local.test","activo":true,"ultimoAccesoEn":null,"creadoEn":"2026-09-10T17:30:36.783233+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.783233+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

