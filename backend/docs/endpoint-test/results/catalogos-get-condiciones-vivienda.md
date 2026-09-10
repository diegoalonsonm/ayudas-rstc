# catalogos-get-condiciones-vivienda

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.897Z
- durationMs: 19

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/condiciones-vivienda
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1538
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"602-I18n0CFQAfGl0mkOIEm57sPvjyc"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"4796ad65-318e-5eb4-aa26-284007fd859a","codigo":"BUENA","nombre":"Buena","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"a17c0ef4-a13f-57db-a4ec-bab8352a94ca","codigo":"REGULAR","nombre":"Regular","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"1edb1f92-3fa8-50df-a148-bcbaa20801ed","codigo":"MALA","nombre":"Mala","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"c7ed9bbb-c011-5ac2-ab68-d2b2ab32e4fe","codigo":"PRECARIO","nombre":"Precario","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"b9703b11-5e04-5f1f-ab80-8899f04c6033","codigo":"TUGURIO","nombre":"Tugurio","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

