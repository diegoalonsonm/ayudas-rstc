# catalogos-get-parentescos

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:54.662Z
- durationMs: 53

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/parentescos
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2684
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:54 GMT
etag: W/"a7c-0FgEThDtvydMGE+900zaqISSSzg"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"343aec23-c7a5-52e3-a8b4-6473d2135baf","codigo":"SOLICITANTE","nombre":"Solicitante","ordenPresentacion":1,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"8f6a2c8d-5c84-5f49-ae11-318d991b4627","codigo":"CONYUGE","nombre":"Cónyuge","ordenPresentacion":2,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"cec8061f-ef4d-52b3-a91a-13a513589ae7","codigo":"HIJO","nombre":"Hijo / Hija","ordenPresentacion":3,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"841485d8-d73f-5408-a9a4-e649f918caae","codigo":"PADRE_MADRE","nombre":"Padre / Madre","ordenPresentacion":4,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"f2339f39-0b6b-5f6b-ad54-7445254ab358","codigo":"HERMANO","nombre":"Hermano / Hermana","ordenPresentacion":5,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"02415d71-b408-5b52-af42-50107b7e481a","codigo":"NIETO","nombre":"Nieto / Nieta","ordenPresentacion":6,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"479438f0-74c1-5f0a-a18a-5f7402cdfdc9","codigo":"ABUELO","nombre":"Abuelo / Abuela","ordenPresentacion":7,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"4df1e581-811f-5865-a9e1-10b29fad17a4","codigo":"OTRO","nombre":"Otro","ordenPresentacion":8,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

