# catalogos-get-tipos-ayuda

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:54.915Z
- durationMs: 53

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/tipos-ayuda
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 3464
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:54 GMT
etag: W/"d88-ICpKHtb7OnLDCnDugNTZSbXXnZw"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"c0048440-8693-5959-a613-bd7d4c0b61ee","codigo":"ALIMENTOS","nombre":"Alimentos","requiereDetalle":false,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"7b1b3fd6-9958-52e6-a864-a76fd16e1ec3","codigo":"ALIMENTOS_PREPARADOS","nombre":"Alimentos preparados","requiereDetalle":false,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"739bf356-f413-5dc5-a762-bb5b34fe7ef7","codigo":"ARTICULOS_HIGIENE","nombre":"Artículos de higiene","requiereDetalle":false,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"b2d32901-bfc6-51e1-afa8-77b57b258a18","codigo":"ROPA","nombre":"Ropa","requiereDetalle":false,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"0aeade2d-6a34-53df-a655-f30944e05dc0","codigo":"EQUIPO_MEDICO","nombre":"Equipo médico","requiereDetalle":true,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"ff6b757a-da34-595d-a6de-872d2d703374","codigo":"PAGO_ALQUILER","nombre":"Pago de alquiler","requiereDetalle":true,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"0fb40651-9198-5fe1-a874-337d7d721e16","codigo":"PAGO_SERVICIOS","nombre":"Pago de servicios","requiereDetalle":true,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"53cec335-2a52-513c-a03f-542bf5a22a05","codigo":"PAGO_MEDICAMENTOS","nombre":"Pago de medicamentos","requiereDetalle":true,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"75201f01-a2ce-50bc-a7a9-739e31602540","codigo":"APARATOS_ORTOPEDICOS","nombre":"Aparatos ortopédicos","requiereDetalle":true,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"65728048-9aad-5b76-ac9d-4726501d687d","codigo":"OTROS","nombre":"Otros","requiereDetalle":true,"creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

