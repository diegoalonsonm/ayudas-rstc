# usuarios-post-asignaciones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.225Z
- durationMs: 211

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/usuarios/5f7a3586-070f-429c-8d2f-9b58180c3307/asignaciones
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "rolCodigo": "COORDINADOR_PARROQUIAL",
  "parroquiaId": "f9c3ced6-626f-46f8-b8a6-e86536f2a9d1",
  "motivo": "Promoción de prueba endpoint-test"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 562
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"232-pIf655J9qJZ84R1Sr6n4P7RPhfA"
keep-alive: timeout=5
x-powered-by: Express

{"id":"9f303b28-0c85-4102-ab10-fa4d2f879e78","usuarioId":"5f7a3586-070f-429c-8d2f-9b58180c3307","rolId":"c92754d1-90c0-5114-a861-c156355dc7c6","diocesisId":null,"vicariaId":null,"parroquiaId":"f9c3ced6-626f-46f8-b8a6-e86536f2a9d1","vigenteDesde":"2026-09-10T17:47:56.277905+00:00","vigenteHasta":null,"creadoEn":"2026-09-10T17:47:56.277905+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.277905+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

