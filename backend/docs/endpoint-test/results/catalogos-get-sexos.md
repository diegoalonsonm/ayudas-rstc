# catalogos-get-sexos

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.731Z
- durationMs: 29

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/sexos
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1341
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"53d-ihVpoatBDriVnkEjm6sH6RaaZKA"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"85c9f95e-4cfd-5cf2-a14b-ec0e5c13669a","codigo":"FEMENINO","nombre":"Femenino","ordenPresentacion":1,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"a62599af-c30b-549b-a725-60fd21260032","codigo":"MASCULINO","nombre":"Masculino","ordenPresentacion":2,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"1731a786-a252-5f6d-a780-04f87ba0c919","codigo":"OTRO","nombre":"Otro","ordenPresentacion":3,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"802d0f42-461b-516f-a516-bc32355179cd","codigo":"NO_ESPECIFICADO","nombre":"No especificado","ordenPresentacion":4,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

