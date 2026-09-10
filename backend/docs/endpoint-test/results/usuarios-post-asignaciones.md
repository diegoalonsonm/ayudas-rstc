# usuarios-post-asignaciones

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.893Z
- durationMs: 115

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/usuarios/8c0d106d-fa71-41f4-8cb3-cfb919458ff1/asignaciones
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "rolCodigo": "COORDINADOR_PARROQUIAL",
  "parroquiaId": "029075e4-f2a0-4efc-86e4-7a1a4dbdd382",
  "motivo": "Promoción de prueba endpoint-test"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 562
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"232-AGNS1j/TdUFEoeKBeAkSAmpTYK4"
keep-alive: timeout=5
x-powered-by: Express

{"id":"14704d7f-914c-4e03-a58f-f4bb8844bb67","usuarioId":"8c0d106d-fa71-41f4-8cb3-cfb919458ff1","rolId":"c92754d1-90c0-5114-a861-c156355dc7c6","diocesisId":null,"vicariaId":null,"parroquiaId":"029075e4-f2a0-4efc-86e4-7a1a4dbdd382","vigenteDesde":"2026-09-10T17:30:36.980559+00:00","vigenteHasta":null,"creadoEn":"2026-09-10T17:30:36.980559+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:36.980559+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

