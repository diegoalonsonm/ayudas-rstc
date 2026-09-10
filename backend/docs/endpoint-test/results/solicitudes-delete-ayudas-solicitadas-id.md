# solicitudes-delete-ayudas-solicitadas-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.860Z
- durationMs: 32

## Assertions

- pass: HTTP 200 matches expected 200|204

## Request

```http
DELETE http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/ayudas-solicitadas/cd55d163-b7d6-4b10-aa77-697ccb9c408f
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
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"233-bsT4E7BA56fgGhENiqI4kw3wH7g"
keep-alive: timeout=5
x-powered-by: Express

{"id":"cd55d163-b7d6-4b10-aa77-697ccb9c408f","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","tipoAyudaId":"7b1b3fd6-9958-52e6-a864-a76fd16e1ec3","detalle":null,"creadoEn":"2026-09-10T17:30:37.925508+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.962473+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":"2026-09-10T17:30:37.846+00:00","eliminadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","motivoEliminacion":"Selección incorrecta (fila de prueba)"}
```

