# personas-get-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.983Z
- durationMs: 20

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/personas/b0d46173-e137-4089-9757-7527223677e9
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 688
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"2b0-aNW7hSksFk9q+aahbIgfKgfbSeg"
keep-alive: timeout=5
x-powered-by: Express

{"id":"b0d46173-e137-4089-9757-7527223677e9","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"qjfoMbTJ8EaggAfC6yLBz3oA88JvhG0BfysVYw/05kt3v1YgcWvC","numeroDocumentoHash":"50c2c3e9a097b21d3584e72ec687ee978dbc29fbc6f37d5c5eb341b899dbe054","primerNombre":"María","segundoNombre":null,"primerApellido":"Solano","segundoApellido":null,"telefono":"DVFWn0NdQqAMxtyCoYzyQaev/3jo3ebb+jnQrN+/oyjpt1au","creadoEn":"2026-09-10T17:30:37.029521+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.029521+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

