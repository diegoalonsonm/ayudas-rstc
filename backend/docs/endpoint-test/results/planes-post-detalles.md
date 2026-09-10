# planes-post-detalles

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.508Z
- durationMs: 58

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/planes-ayuda/e5883b8b-c0f5-4171-8b5a-a0ed0d77770c/detalles
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "frecuencia": "MENSUAL",
  "montoEstimado": 25000,
  "tipoAyudaId": "c0048440-8693-5959-a613-bd7d4c0b61ee"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 476
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"1dc-O45+e09gfpiYkEOmV9SknuHZa+E"
keep-alive: timeout=5
x-powered-by: Express

{"id":"32a1ca0e-87c3-488e-92f2-21f6b29e3fd5","planAyudaId":"e5883b8b-c0f5-4171-8b5a-a0ed0d77770c","tipoAyudaId":"c0048440-8693-5959-a613-bd7d4c0b61ee","descripcion":null,"frecuencia":"MENSUAL","montoEstimado":25000,"creadoEn":"2026-09-10T17:47:57.578748+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.578748+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

