# catalogos-get-tipos-documento

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:54.558Z
- durationMs: 65

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/tipos-documento
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1569
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:54 GMT
etag: W/"621-x6ZDeuvpj2OIed8QIc5tufYbVfA"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"f15a1fa7-eb8f-5398-a824-78100c6b3758","codigo":"CEDULA_NACIONAL","nombre":"Cédula nacional","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"35cfabee-30b3-5110-a052-f335ca13a20b","codigo":"DIMEX","nombre":"DIMEX","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"642c59cb-12da-52dd-a62f-ec0f2314216a","codigo":"PASAPORTE","nombre":"Pasaporte","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"ec8dff8d-cd41-5c2f-aeb7-6cf8eaf098b0","codigo":"OTRO","nombre":"Otro","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"64707938-3981-57a3-a266-5c5ef1df4465","codigo":"SIN_DOCUMENTO","nombre":"Sin documento","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

