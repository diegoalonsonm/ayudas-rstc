# usuarios-patch-id

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:56.013Z
- durationMs: 73
- notes: PATCH sobre usuario creado en esta corrida

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
PATCH http://localhost:3000/api/v1/usuarios/5f7a3586-070f-429c-8d2f-9b58180c3307
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "activo": false,
  "motivo": "Baja temporal de prueba endpoint-test"
}
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 539
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:56 GMT
etag: W/"21b-qVjiu5ssanCSsEi1SMgJl+IFktI"
keep-alive: timeout=5
x-powered-by: Express

{"id":"5f7a3586-070f-429c-8d2f-9b58180c3307","identidadAutenticacionId":"8ae594de-4761-4cc3-b381-f801bbf00688","nombreCompleto":"Usuario TEST 1789062473974","correo":"endpoint.test.1789062473974@local.test","activo":false,"ultimoAccesoEn":null,"creadoEn":"2026-09-10T17:47:55.997028+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:56.073616+00:00","actualizadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

