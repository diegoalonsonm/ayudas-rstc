# solicitudes-get-ayudas-solicitadas

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.778Z
- durationMs: 36

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/ayudas-solicitadas
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 434
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"1b2-/BmRwgqC/Hf+pmHDJP1AZ5Mzxds"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"4b7a3943-3497-4516-b466-84a130ebaf41","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","tipoAyudaId":"c0048440-8693-5959-a613-bd7d4c0b61ee","detalle":null,"creadoEn":"2026-09-10T17:30:37.365178+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.365178+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

