# solicitudes-post-restauracion

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:58.089Z
- durationMs: 40

## Assertions

- pass: HTTP 201 matches expected 200

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/restauracion
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Eliminada por error (prueba endpoint-test)"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 754
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:58 GMT
etag: W/"2f2-5eNO6ihZgkeYOiTqI3/0VqPYAvc"
keep-alive: timeout=5
x-powered-by: Express

{"id":"3fd57ce9-a675-42c1-a602-bb146b54280b","numeroSolicitud":"RSTC-2026-000002","personaSolicitanteId":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","parroquiaReceptoraId":"f9c3ced6-626f-46f8-b8a6-e86536f2a9d1","sectorOficial":"Barrio Centro","usuarioEntrevistadorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","fechaEntrevista":"2026-09-07","fechaVisita":null,"estado":"PRESENTADA","observaciones":"Entrevista completa","presentadaEn":"2026-09-10T17:47:56.901+00:00","creadoEn":"2026-09-10T17:47:56.733198+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:58.152726+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

