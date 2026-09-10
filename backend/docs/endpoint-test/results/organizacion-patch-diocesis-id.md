# organizacion-patch-diocesis-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:55.320Z
- durationMs: 49

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/diocesis/5ab240bd-b47b-4510-a0dd-cb9506a518ee
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombre": "Diócesis TEST 1789062473974 actualizado"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 406
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:55 GMT
etag: W/"196-zqTDJ9CYT7p6tEV3UPkV2sVQCXc"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5ab240bd-b47b-4510-a0dd-cb9506a518ee","nombre":"Diócesis TEST 1789062473974 actualizado","codigo":"D05","creadoEn":"2026-09-10T17:47:55.31023+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:55.397801+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

