# personas-get

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.962Z
- durationMs: 33

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/personas
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 2142
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"85e-G068o++Ocxe1sLtVtxJDxgAKeqs"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"1a97718e-91d2-4ff2-8122-a22ae1cf4f35","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"N4E2f2z2LcXhBHPwSJ5cLhjr9EZAnzIV6Zvoq0ojYeqGVBa2De3C","numeroDocumentoHash":"75db6568c2af2661926765df171d1699b6b252829441d2f487d0692fc131cfae","primerNombre":"María","segundoNombre":"Elena","primerApellido":"Solano","segundoApellido":null,"telefono":"BumQHdskjl/har3NslIx30APXeNXd/gYEF1z0vHtZpHKmxfh","creadoEn":"2026-09-08T19:01:38.866131+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-08T19:01:38.998606+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"9abb41af-a8dc-40a3-b7e2-c38d82140d3d","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"qABwbs9bETVTbOg7RxggiuwKbev7yIBROWXdINuG+hGIRtc3BLcT","numeroDocumentoHash":"bf8ae73be9c140014ae4d795a4d84e33bfbcbea81a4f6f7a8f6323b19db6e3c3","primerNombre":"María","segundoNombre":"Elena","primerApellido":"Solano","segundoApellido":null,"telefono":"n0tCvuN3mjuRdA05oa/tuCfO0FpoH1F6jXjBh758TAkub9zd","creadoEn":"2026-09-08T19:09:46.989255+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-08T19:09:47.226246+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"b0d46173-e137-4089-9757-7527223677e9","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"qjfoMbTJ8EaggAfC6yLBz3oA88JvhG0BfysVYw/05kt3v1YgcWvC","numeroDocumentoHash":"50c2c3e9a097b21d3584e72ec687ee978dbc29fbc6f37d5c5eb341b899dbe054","primerNombre":"María","segundoNombre":null,"primerApellido":"Solano","segundoApellido":null,"telefono":"DVFWn0NdQqAMxtyCoYzyQaev/3jo3ebb+jnQrN+/oyjpt1au","creadoEn":"2026-09-10T17:30:37.029521+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.029521+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

