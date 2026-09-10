# planes-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.981Z
- durationMs: 85

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/planes-ayuda
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
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"242-rDn6PmI0x/IHamXVRkU9zUJeDac"
keep-alive: timeout=5
x-powered-by: Express

{"id":"410f64a7-e7d7-41b5-afca-ca564f3eb6fe","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","decision":"APROBADA","fechaInicio":"2026-09-01","fechaFin":"2026-12-01","motivoDecision":"Comité parroquial","usuarioDecisorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","decididoEn":"2026-09-10T17:30:37.941+00:00","creadoEn":"2026-09-10T17:30:38.064127+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.064127+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

