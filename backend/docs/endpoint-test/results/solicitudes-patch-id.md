# solicitudes-patch-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.492Z
- durationMs: 60

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "fechaEntrevista": "2026-09-07",
  "observaciones": "Visita domiciliaria pendiente"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 735
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"2df-odnInKWBKBlri/jV/r4E9faC6M4"
keep-alive: timeout=5
x-powered-by: Express

{"id":"98468a57-02c3-4f43-8120-13ed93f72a48","numeroSolicitud":"RSTC-2026-000001","personaSolicitanteId":"b0d46173-e137-4089-9757-7527223677e9","parroquiaReceptoraId":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","sectorOficial":"Barrio Centro","usuarioEntrevistadorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","fechaEntrevista":"2026-09-07","fechaVisita":null,"estado":"BORRADOR","observaciones":"Visita domiciliaria pendiente","presentadaEn":null,"creadoEn":"2026-09-10T17:30:37.365178+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.589515+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

