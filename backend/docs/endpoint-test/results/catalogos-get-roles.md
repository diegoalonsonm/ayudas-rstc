# catalogos-get-roles

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:54.954Z
- durationMs: 39

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/roles
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1673
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:54 GMT
etag: W/"689-HY6L753rYOIBceN3A7Z2OvtEA4E"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"fa3ecfec-e752-53b3-aebd-0c88cc1b40bb","codigo":"PERSONAL_PASTORAL","nombre":"Personal pastoral","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"c92754d1-90c0-5114-a861-c156355dc7c6","codigo":"COORDINADOR_PARROQUIAL","nombre":"Coordinador parroquial / Párroco","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"b486ed1e-2976-5ef1-a9fc-74e776628015","codigo":"COORDINADOR_VICARIAL","nombre":"Coordinador vicarial","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"79052751-41b4-523f-a8c4-4c486e67e7b1","codigo":"COORDINADOR_DIOCESANO","nombre":"Coordinador diocesano","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"5338e242-36c3-5147-a318-b6b9cd6a99dc","codigo":"ADMINISTRADOR","nombre":"Administrador","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

