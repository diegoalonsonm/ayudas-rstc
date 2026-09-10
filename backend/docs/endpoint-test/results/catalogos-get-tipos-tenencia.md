# catalogos-get-tipos-tenencia

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:35.877Z
- durationMs: 20

## Assertions

- pass: HTTP 200 matches expected 200
- pass: lista presente

## Request

```http
GET http://localhost:3000/api/v1/catalogos/tipos-tenencia
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1558
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:35 GMT
etag: W/"616-EHoDxhnB40uN+ZGWOaTt567fEGo"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"55e0e6cc-8941-5ef4-a625-27ef23786c77","codigo":"PROPIA","nombre":"Propia","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"5004cb52-1292-5156-a7a2-535c2a1aee62","codigo":"HIPOTECADA","nombre":"Hipotecada","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"e3c2d463-db65-5e29-a2fc-ff24156bbc22","codigo":"PRESTADA","nombre":"Prestada","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"32b79ff0-6767-5997-a0c1-a8e98edea5ca","codigo":"ALQUILADA","nombre":"Alquilada","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"fee55205-4c0d-5492-a729-482d6678af83","codigo":"NO_TIENE","nombre":"No tiene","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

