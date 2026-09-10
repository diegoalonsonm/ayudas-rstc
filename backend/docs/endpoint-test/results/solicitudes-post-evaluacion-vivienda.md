# solicitudes-post-evaluacion-vivienda

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.740Z
- durationMs: 43

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/evaluacion-vivienda
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
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"1f5-CZvJt97GmkECcO+8xeXspdVO+4Q"
keep-alive: timeout=5
x-powered-by: Express

{"id":"6a305f14-7357-4e7b-97d6-667992ea9917","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","tipoViviendaId":null,"tipoTenenciaId":null,"condicionViviendaId":null,"observaciones":"Techo de zinc","creadoEn":"2026-09-10T17:30:37.843551+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.843551+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

