# organizacion-delete-vicarias-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:58.199Z
- durationMs: 59

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/vicarias/5caf5bc7-cefc-4329-a1a8-ea728ca6ecc6
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Reorganización (prueba endpoint-test)"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 558
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:58 GMT
etag: W/"22e-yS7rnMq3qdKIteCfHs256y4JL/Q"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5caf5bc7-cefc-4329-a1a8-ea728ca6ecc6","diocesisId":"5ab240bd-b47b-4510-a0dd-cb9506a518ee","nombre":"Vicaría TEST 1789062473974 actualizado","codigo":"D05-V01","creadoEn":"2026-09-10T17:47:55.47072+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:58.274494+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:47:58.158+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Reorganización (prueba endpoint-test)"}
```

