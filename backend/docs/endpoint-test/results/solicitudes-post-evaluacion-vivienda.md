# solicitudes-post-evaluacion-vivienda

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.165Z
- durationMs: 51

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/evaluacion-vivienda
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "observaciones": "Techo de zinc"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 501
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"1f5-tsSpKymqKFFjCP5Nf0oCeVGN/tQ"
keep-alive: timeout=5
x-powered-by: Express

{"id":"cdf22b47-80df-4ce5-b38f-8a0971804619","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","tipoViviendaId":null,"tipoTenenciaId":null,"condicionViviendaId":null,"observaciones":"Techo de zinc","creadoEn":"2026-09-10T17:47:57.238013+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.238013+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

