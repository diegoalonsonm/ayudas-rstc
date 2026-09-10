# usuarios-get-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.503Z
- durationMs: 24

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/usuarios/6bf12564-ed1f-4a20-809d-bf6b23e029ad
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1046
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"416-qHB0S/ge8P6tj54p9Tnu2WA5k0k"
keep-alive: timeout=5
x-powered-by: Express

{"usuario":{"id":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","identidadAutenticacionId":"a3b2077f-3165-470a-b7f0-4e59724edf54","nombreCompleto":"Administrador","correo":"admin2@local.test","activo":true,"ultimoAccesoEn":"2026-09-10T17:30:35.542+00:00","creadoEn":"2026-09-08T17:32:13.660082+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-10T17:30:35.657445+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},"asignacion":{"id":"55d7c9ea-50b5-4331-814c-e50615537733","usuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","rolId":"5338e242-36c3-5147-a318-b6b9cd6a99dc","diocesisId":null,"vicariaId":null,"parroquiaId":null,"vigenteDesde":"2026-09-08T17:32:13.674342+00:00","vigenteHasta":null,"creadoEn":"2026-09-08T17:32:13.674342+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T17:32:13.674342+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null,"roles":{"codigo":"ADMINISTRADOR"},"rolCodigo":"ADMINISTRADOR"}}
```

