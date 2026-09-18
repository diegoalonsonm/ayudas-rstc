# solicitudes-get-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.779Z
- durationMs: 73

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2261
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"8d5-PkSyv0DtG9Nb0qyzWEBPazGnqNo"
keep-alive: timeout=5
x-powered-by: Express

{"solicitud":{"id":"3fd57ce9-a675-42c1-a602-bb146b54280b","numeroSolicitud":"RSTC-2026-000002","personaSolicitanteId":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","parroquiaReceptoraId":"f9c3ced6-626f-46f8-b8a6-e86536f2a9d1","sectorOficial":"Barrio Centro","usuarioEntrevistadorId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","fechaEntrevista":null,"fechaVisita":null,"estado":"BORRADOR","observaciones":null,"presentadaEn":null,"creadoEn":"2026-09-10T17:47:56.733198+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.733198+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},"persona":{"id":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"Wgmtl/93uAfl3l7AcANTLXP7x3TmfmwGuX990R1ZWoCIk88xMuNf","numeroDocumentoHash":"81abc30c2ab703fb50a99f33662b993258232fcb5c24d59fe039057892b14163","primerNombre":"María","segundoNombre":"Elena","primerApellido":"Solano","segundoApellido":null,"telefono":"Hr0EiJidJZN8QOyuoWCUyDN/OGywTVLjxEgloI/OFfHvrXHp","creadoEn":"2026-09-10T17:47:56.328564+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.468587+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},"direccionActual":null,"integrantes":[],"evaluacionVivienda":null,"ayudasSolicitadas":[{"id":"6d810788-1ddf-4605-a5f1-9b901c71161d","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","tipoAyudaId":"c0048440-8693-5959-a613-bd7d4c0b61ee","detalle":null,"creadoEn":"2026-09-10T17:47:56.733198+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.733198+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}],"planes":[],"documentos":[],"historialEstados":[{"id":"436b17e0-c49f-4874-8c18-83128e91c385","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","estadoAnterior":null,"estadoNuevo":"BORRADOR","motivo":null,"usuarioResponsableId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","ocurridoEn":"2026-09-10T17:47:56.733198+00:00"}]}
```

