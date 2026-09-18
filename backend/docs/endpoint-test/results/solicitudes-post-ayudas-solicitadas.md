# solicitudes-post-ayudas-solicitadas

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.259Z
- durationMs: 55

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/ayudas-solicitadas
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "tipoAyudaId": "7b1b3fd6-9958-52e6-a864-a76fd16e1ec3",
  "detalle": null
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 432
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"1b0-LCenFEHuMNt3m4E23W6HA+d5BN8"
keep-alive: timeout=5
x-powered-by: Express

{"id":"016eff92-4a5a-4a7c-ae90-b622ffede4ee","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","tipoAyudaId":"7b1b3fd6-9958-52e6-a864-a76fd16e1ec3","detalle":null,"creadoEn":"2026-09-10T17:47:57.330893+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.330893+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

