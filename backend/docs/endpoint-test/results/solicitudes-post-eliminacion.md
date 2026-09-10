# solicitudes-post-eliminacion

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.570Z
- durationMs: 60

## Assertions

- pass: HTTP 201 matches expected 200

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/eliminacion
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Duplicada (prueba endpoint-test)"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 845
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"34d-L1p6I472ZM9BDOBwzHanZ3kMQhY"
keep-alive: timeout=5
x-powered-by: Express

{"id":"98468a57-02c3-4f43-8120-13ed93f72a48","numeroSolicitud":"RSTC-2026-000001","personaSolicitanteId":"b0d46173-e137-4089-9757-7527223677e9","parroquiaReceptoraId":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","sectorOficial":"Barrio Centro","usuarioEntrevistadorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","fechaEntrevista":"2026-09-07","fechaVisita":null,"estado":"PRESENTADA","observaciones":"Entrevista completa","presentadaEn":"2026-09-10T17:30:37.519+00:00","creadoEn":"2026-09-10T17:30:37.365178+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.663493+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:30:38.546+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Duplicada (prueba endpoint-test)"}
```

