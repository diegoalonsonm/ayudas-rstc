# planes-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.424Z
- durationMs: 71

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/planes-ayuda
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "decision": "APROBADA",
  "fechaInicio": "2026-09-01",
  "fechaFin": "2026-12-01",
  "motivoDecision": "Comité parroquial"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 578
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"242-1D4F1NF3aK6RVb3sUAO2BptYII4"
keep-alive: timeout=5
x-powered-by: Express

{"id":"e5883b8b-c0f5-4171-8b5a-a0ed0d77770c","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","decision":"APROBADA","fechaInicio":"2026-09-01","fechaFin":"2026-12-01","motivoDecision":"Comité parroquial","usuarioDecisorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","decididoEn":"2026-09-10T17:47:57.377+00:00","creadoEn":"2026-09-10T17:47:57.489708+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.489708+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

