# planes-post-detalles

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.050Z
- durationMs: 46

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/planes-ayuda/410f64a7-e7d7-41b5-afca-ca564f3eb6fe/detalles
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
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"1dc-FcqiyVwhBMcQzEhvUCUZhrpIWP8"
keep-alive: timeout=5
x-powered-by: Express

{"id":"7db060a5-dbe0-41bc-b26a-ddf49779c134","planAyudaId":"410f64a7-e7d7-41b5-afca-ca564f3eb6fe","tipoAyudaId":"c0048440-8693-5959-a613-bd7d4c0b61ee","descripcion":null,"frecuencia":"MENSUAL","montoEstimado":25000,"creadoEn":"2026-09-10T17:30:38.151778+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.151778+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

