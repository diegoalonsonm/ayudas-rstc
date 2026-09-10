# solicitudes-get

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.291Z
- durationMs: 23

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/solicitudes-ayuda
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 668
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"29c-1yqIXNaSAaMwSpzRovLNDhdpAX0"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"98468a57-02c3-4f43-8120-13ed93f72a48","numeroSolicitud":"RSTC-2026-000001","personaSolicitanteId":"b0d46173-e137-4089-9757-7527223677e9","parroquiaReceptoraId":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","sectorOficial":"Barrio Centro","usuarioEntrevistadorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","fechaEntrevista":null,"fechaVisita":null,"estado":"BORRADOR","observaciones":null,"presentadaEn":null,"creadoEn":"2026-09-10T17:30:37.365178+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.365178+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

