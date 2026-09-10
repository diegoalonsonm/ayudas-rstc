# catalogos-get-tipos-vivienda

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:54.796Z
- durationMs: 80

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/tipos-vivienda
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1231
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:54 GMT
etag: W/"4cf-meloPQ4KTwYrs9KRbcvyYhjrIrc"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"1d4a4514-e48b-57de-ad92-2ae6cbed4b22","codigo":"CASA","nombre":"Casa","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"5119926e-2141-5b6b-a500-d89425cbfc12","codigo":"CUARTO","nombre":"Cuarto","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"2807731d-126c-56e3-ad7e-a35de503abcb","codigo":"ALBERGUE","nombre":"Albergue","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"b06a2e11-7b3c-5f10-a7a9-9f4a718e3fd9","codigo":"REFUGIO","nombre":"Refugio","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

