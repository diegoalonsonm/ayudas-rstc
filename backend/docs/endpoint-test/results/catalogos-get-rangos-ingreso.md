# catalogos-get-rangos-ingreso

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.803Z
- durationMs: 21

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/rangos-ingreso
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 3175
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"c67-cpib73dJS8c1edhZyqMSBZZSbjQ"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"5f2cd249-1270-557e-abaf-f1f73df1b529","codigo":"SIN_INGRESOS_REPORTADOS","nombre":"Sin ingresos reportados","montoMinimo":null,"montoMaximo":0,"ordenPresentacion":1,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"1d9235f3-1b57-5bac-a065-4deebf608d57","codigo":"HASTA_100000","nombre":"Hasta ₡100.000","montoMinimo":0.01,"montoMaximo":100000,"ordenPresentacion":2,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"7cf719ea-5b6a-53b6-a02b-fb74fbc3cff8","codigo":"DE_100001_A_180000","nombre":"₡100.001 - ₡180.000","montoMinimo":100001,"montoMaximo":180000,"ordenPresentacion":3,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"5f10efc5-8d95-5915-a16f-1121112019c8","codigo":"DE_180001_A_280000","nombre":"₡180.001 - ₡280.000","montoMinimo":180001,"montoMaximo":280000,"ordenPresentacion":4,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"24fed6a7-4523-5a83-af7e-740fddc368c9","codigo":"DE_280001_A_380000","nombre":"₡280.001 - ₡380.000","montoMinimo":280001,"montoMaximo":380000,"ordenPresentacion":5,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"1ea4fb6a-79bf-51a3-a526-5af216a076bc","codigo":"DE_380001_A_460000","nombre":"₡380.001 - ₡460.000","montoMinimo":380001,"montoMaximo":460000,"ordenPresentacion":6,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"51bc58ff-2c1e-52be-a02c-a72591a96fc6","codigo":"DE_460001_A_550000","nombre":"₡460.001 - ₡550.000","montoMinimo":460001,"montoMaximo":550000,"ordenPresentacion":7,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"2b3fed17-98a8-59c0-a46f-6b63b56f6f2c","codigo":"MAS_DE_550000","nombre":"Más de ₡550.000","montoMinimo":550000.01,"montoMaximo":null,"ordenPresentacion":8,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

