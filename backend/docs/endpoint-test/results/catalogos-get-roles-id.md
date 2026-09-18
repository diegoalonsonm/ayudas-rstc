# catalogos-get-roles-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.053Z
- durationMs: 29

## Assertions

- pass: HTTP 200 matches expected 200
- pass: objeto de rol

## Request

```http
GET http://localhost:3000/api/v1/catalogos/roles/fa3ecfec-e752-53b3-aebd-0c88cc1b40bb
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 328
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"148-SRHySPqsCVpPTfxncArDW0vb7aI"
keep-alive: timeout=5
x-powered-by: Express

{"id":"fa3ecfec-e752-53b3-aebd-0c88cc1b40bb","codigo":"PERSONAL_PASTORAL","nombre":"Personal pastoral","creadoEn":"2026-08-26T23:06:21.05665+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-08-26T23:06:21.05665+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

