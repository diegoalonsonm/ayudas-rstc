# catalogos-post-cantones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.057Z
- durationMs: 36

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/catalogos/cantones
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "codigo": "T35274",
  "nombre": "Canton TEST 1789061435274"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 361
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"169-sH4vuqc45Oeqk7g642ExrWHL3cw"
keep-alive: timeout=5
x-powered-by: Express

{"id":"867a4cbe-651f-45d3-b48d-f7adabf5e465","codigo":"T35274","nombre":"Canton TEST 1789061435274","creadoEn":"2026-09-10T17:30:36.159972+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.159972+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

