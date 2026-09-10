# personas-patch-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.400Z
- durationMs: 52

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/personas/b08e9a8c-c91e-4533-ab8a-fa55c89a0d63
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "segundoNombre": "Elena",
  "telefono": "88882222"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 725
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"2d5-Ru9DX+T82EXORY4PlRDnSpy3xXY"
keep-alive: timeout=5
x-powered-by: Express

{"id":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"Wgmtl/93uAfl3l7AcANTLXP7x3TmfmwGuX990R1ZWoCIk88xMuNf","numeroDocumentoHash":"81abc30c2ab703fb50a99f33662b993258232fcb5c24d59fe039057892b14163","primerNombre":"María","segundoNombre":"Elena","primerApellido":"Solano","segundoApellido":null,"telefono":"Hr0EiJidJZN8QOyuoWCUyDN/OGywTVLjxEgloI/OFfHvrXHp","creadoEn":"2026-09-10T17:47:56.328564+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.468587+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

