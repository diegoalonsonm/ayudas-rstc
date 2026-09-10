# solicitudes-delete-ayudas-solicitadas-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.307Z
- durationMs: 47

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/ayudas-solicitadas/016eff92-4a5a-4a7c-ae90-b622ffede4ee
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "motivo": "Selección incorrecta (fila de prueba)"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 563
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"233-fru3/DgQRUKIhpIvyQ0uep/qFtM"
keep-alive: timeout=5
x-powered-by: Express

{"id":"016eff92-4a5a-4a7c-ae90-b622ffede4ee","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","tipoAyudaId":"7b1b3fd6-9958-52e6-a864-a76fd16e1ec3","detalle":null,"creadoEn":"2026-09-10T17:47:57.330893+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.382274+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:47:57.295+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Selección incorrecta (fila de prueba)"}
```

