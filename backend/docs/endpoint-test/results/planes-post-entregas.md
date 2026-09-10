# planes-post-entregas

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.139Z
- durationMs: 51

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/detalles-plan-ayuda/7db060a5-dbe0-41bc-b26a-ddf49779c134/entregas
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "fechaEntrega": "2026-09-15",
  "monto": 25000,
  "descripcion": "Paquete de alimentos"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 528
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"210-0BU+gG0g6rvLVCm03RgpmlmQW94"
keep-alive: timeout=5
x-powered-by: Express

{"id":"11639a44-be0b-4f27-9a4f-1e188d8c087e","detallePlanAyudaId":"7db060a5-dbe0-41bc-b26a-ddf49779c134","fechaEntrega":"2026-09-15","descripcion":"Paquete de alimentos","monto":25000,"usuarioResponsableId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","observaciones":null,"creadoEn":"2026-09-10T17:30:38.228204+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.228204+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

