# solicitudes-get-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.431Z
- durationMs: 139

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2261
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"8d5-JU/lg92aneGxuLvrzetAHD87KO4"
keep-alive: timeout=5
x-powered-by: Express

{"solicitud":{"id":"98468a57-02c3-4f43-8120-13ed93f72a48","numeroSolicitud":"RSTC-2026-000001","personaSolicitanteId":"b0d46173-e137-4089-9757-7527223677e9","parroquiaReceptoraId":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","sectorOficial":"Barrio Centro","usuarioEntrevistadorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","fechaEntrevista":null,"fechaVisita":null,"estado":"BORRADOR","observaciones":null,"presentadaEn":null,"creadoEn":"2026-09-10T17:30:37.365178+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.365178+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},"persona":{"id":"b0d46173-e137-4089-9757-7527223677e9","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"qjfoMbTJ8EaggAfC6yLBz3oA88JvhG0BfysVYw/05kt3v1YgcWvC","numeroDocumentoHash":"50c2c3e9a097b21d3584e72ec687ee978dbc29fbc6f37d5c5eb341b899dbe054","primerNombre":"María","segundoNombre":"Elena","primerApellido":"Solano","segundoApellido":null,"telefono":"pBHjZzl57kXkUHX6VQcg79QzwiVT3vHtXNC1+uvjJplikYWB","creadoEn":"2026-09-10T17:30:37.029521+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.149251+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},"direccionActual":null,"integrantes":[],"evaluacionVivienda":null,"ayudasSolicitadas":[{"id":"4b7a3943-3497-4516-b466-84a130ebaf41","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","tipoAyudaId":"c0048440-8693-5959-a613-bd7d4c0b61ee","detalle":null,"creadoEn":"2026-09-10T17:30:37.365178+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.365178+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}],"planes":[],"documentos":[],"historialEstados":[{"id":"7999ff60-cf3f-4806-a300-8f02b61ea8fd","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","estadoAnterior":null,"estadoNuevo":"BORRADOR","motivo":null,"usuarioResponsableId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","ocurridoEn":"2026-09-10T17:30:37.365178+00:00"}]}
```

