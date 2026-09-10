# planes-post-entregas

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.650Z
- durationMs: 94

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/detalles-plan-ayuda/32a1ca0e-87c3-488e-92f2-21f6b29e3fd5/entregas
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
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"210-XhpKR8YVzULe0I1s87pDMmMCHJQ"
keep-alive: timeout=5
x-powered-by: Express

{"id":"d9a73501-f8ac-42fd-a6a1-980924cd3397","detallePlanAyudaId":"32a1ca0e-87c3-488e-92f2-21f6b29e3fd5","fechaEntrega":"2026-09-15","descripcion":"Paquete de alimentos","monto":25000,"usuarioResponsableId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","observaciones":null,"creadoEn":"2026-09-10T17:47:57.711075+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.711075+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

