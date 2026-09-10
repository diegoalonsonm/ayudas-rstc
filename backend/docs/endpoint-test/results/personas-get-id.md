# personas-get-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.347Z
- durationMs: 51

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/personas/b08e9a8c-c91e-4533-ab8a-fa55c89a0d63
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 688
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"2b0-Ma6pFJflyh690J8bOTjJBOqiMeM"
keep-alive: timeout=5
x-powered-by: Express

{"id":"b08e9a8c-c91e-4533-ab8a-fa55c89a0d63","tipoDocumentoId":"f15a1fa7-eb8f-5398-a824-78100c6b3758","numeroDocumentoCifrado":"Wgmtl/93uAfl3l7AcANTLXP7x3TmfmwGuX990R1ZWoCIk88xMuNf","numeroDocumentoHash":"81abc30c2ab703fb50a99f33662b993258232fcb5c24d59fe039057892b14163","primerNombre":"María","segundoNombre":null,"primerApellido":"Solano","segundoApellido":null,"telefono":"xVcjY8rHdjI7RFmWNpClZKSJlIoD3t6M317umpXD/VOfMsfS","creadoEn":"2026-09-10T17:47:56.328564+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.328564+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

