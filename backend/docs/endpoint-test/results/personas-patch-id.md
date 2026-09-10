# personas-patch-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.049Z
- durationMs: 64

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/personas/b0d46173-e137-4089-9757-7527223677e9
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
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"2d5-dJSvWXbAQL45IAg/NXFXL4zHhkY"
keep-alive: timeout=5
x-powered-by: Express

{"id":"b0d46173-e137-4089-9757-7527223677e9","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"qjfoMbTJ8EaggAfC6yLBz3oA88JvhG0BfysVYw/05kt3v1YgcWvC","numeroDocumentoHash":"50c2c3e9a097b21d3584e72ec687ee978dbc29fbc6f37d5c5eb341b899dbe054","primerNombre":"María","segundoNombre":"Elena","primerApellido":"Solano","segundoApellido":null,"telefono":"pBHjZzl57kXkUHX6VQcg79QzwiVT3vHtXNC1+uvjJplikYWB","creadoEn":"2026-09-10T17:30:37.029521+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.149251+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

