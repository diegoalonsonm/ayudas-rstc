# usuarios-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.939Z
- durationMs: 233

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/usuarios
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombreCompleto": "Usuario TEST 1789062473974",
  "correo": "endpoint.test.1789062473974@local.test",
  "contrasena": "[REDACTED]",
  "rolCodigo": "PERSONAL_PASTORAL",
  "parroquiaId": "f9c3ced6-626f-46f8-b8a6-e86536f2a9d1",
  "motivo": "Alta de prueba endpoint-test"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 504
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"1f8-7qrQc9dRokjYsfM2Jjs+UIhuIgY"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5f7a3586-070f-429c-8d2f-9b58180c3307","identidadAutenticacionId":"8ae594de-4761-4cc3-b381-f801bbf00688","nombreCompleto":"Usuario TEST 1789062473974","correo":"endpoint.test.1789062473974@local.test","activo":true,"ultimoAccesoEn":null,"creadoEn":"2026-09-10T17:47:55.997028+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.997028+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

