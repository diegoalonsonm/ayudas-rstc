# usuarios-get

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.479Z
- durationMs: 19

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/usuarios
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2414
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"96e-ve5+S+rUAq2ethfaaeX0Qhns6oQ"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"39d925cc-a5cf-4158-b07f-8a7c65addb4c","identidadAutenticacionId":null,"nombreCompleto":"Diego Naranjo","correo":"diego@correo.com","activo":true,"ultimoAccesoEn":null,"creadoEn":"2026-09-08T15:10:53.879785+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T15:10:53.879785+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","identidadAutenticacionId":"a3b2077f-3165-470a-b7f0-4e59724edf54","nombreCompleto":"Administrador","correo":"admin2@local.test","activo":true,"ultimoAccesoEn":"2026-09-10T17:30:35.542+00:00","creadoEn":"2026-09-08T17:32:13.660082+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-10T17:30:35.657445+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"05651f61-5fb0-4e2c-aaad-5385a8434d96","identidadAutenticacionId":"77a19511-72aa-4f20-ad5d-4fc28b73e3c2","nombreCompleto":"Ana Pastoral","correo":"ana2@local.test","activo":true,"ultimoAccesoEn":null,"creadoEn":"2026-09-08T18:42:00.979232+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-08T18:42:00.979232+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"78e71574-7159-4683-956f-87af59f5c9e2","identidadAutenticacionId":"3867b10b-00db-4c04-9d18-62a92d6cb01d","nombreCompleto":"Usuario TEST 1788894096964","correo":"endpoint.test.1788894096964@local.test","activo":false,"ultimoAccesoEn":null,"creadoEn":"2026-09-08T19:01:38.654371+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-08T19:01:38.707279+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"07557a59-99e2-4d2e-b883-660a830079c6","identidadAutenticacionId":"b416ef06-8613-47da-af30-834d08638452","nombreCompleto":"Usuario TEST 1788894584274","correo":"endpoint.test.1788894584274@local.test","activo":false,"ultimoAccesoEn":null,"creadoEn":"2026-09-08T19:09:46.38087+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-08T19:09:46.454611+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

