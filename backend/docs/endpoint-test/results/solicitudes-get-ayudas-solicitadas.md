# solicitudes-get-ayudas-solicitadas

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.203Z
- durationMs: 38

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/ayudas-solicitadas
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 434
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"1b2-ek6u6NYenVICaHoe+IqijkxJjqE"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"6d810788-1ddf-4605-a5f1-9b901c71161d","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","tipoAyudaId":"c0048440-8693-5959-a613-bd7d4c0b61ee","detalle":null,"creadoEn":"2026-09-10T17:47:56.733198+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.733198+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

