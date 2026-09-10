# catalogos-get-grados-academicos

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:54.608Z
- durationMs: 23

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/grados-academicos
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 3154
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:54 GMT
etag: W/"c52-9JiTWiHQALrF7LxV7ejKKeUyDt0"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"6071eff7-e6c4-5fde-a724-f04f746c5d7a","codigo":"SIN_ESTUDIOS","nombre":"Sin estudios","ordenPresentacion":1,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"1ab33e64-00f0-521f-aa6b-d6ab08093366","codigo":"PRIMARIA_INCOMPLETA","nombre":"Primaria incompleta","ordenPresentacion":2,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"199a8e8d-f7ad-58d9-a750-314d02e44288","codigo":"PRIMARIA_COMPLETA","nombre":"Primaria completa","ordenPresentacion":3,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"212c88ec-8b21-50af-a88b-f236c72bb699","codigo":"SECUNDARIA_INCOMPLETA","nombre":"Secundaria incompleta","ordenPresentacion":4,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"89a7b4d9-02a6-5793-ad32-ac1471c069d5","codigo":"SECUNDARIA_COMPLETA","nombre":"Secundaria completa","ordenPresentacion":5,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"82e31368-9a80-5d98-aaa1-8e70127f26db","codigo":"TECNICO","nombre":"Técnico","ordenPresentacion":6,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"08911fcf-5a52-5566-ad23-30a5952263e5","codigo":"UNIVERSITARIA_INCOMPLETA","nombre":"Universitaria incompleta","ordenPresentacion":7,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"d98566b7-f405-55cc-ad5b-7af29fb68e77","codigo":"UNIVERSITARIA_COMPLETA","nombre":"Universitaria completa","ordenPresentacion":8,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"54c7c23c-5321-56eb-a017-82b39712add1","codigo":"POSTGRADO","nombre":"Posgrado","ordenPresentacion":9,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

