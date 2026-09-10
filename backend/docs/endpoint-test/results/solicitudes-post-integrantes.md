# solicitudes-post-integrantes

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:37.633Z
- durationMs: 53

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/integrantes
Authorization: Bearer [REDACTED]
Content-Type: application/json

{
  "nombreCompleto": "Juan Solano",
  "ocupacion": "Jornalero"
}
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 619
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:37 GMT
etag: W/"26b-vZM0HY47oM0r/nBIrWigUA75xFk"
keep-alive: timeout=5
x-powered-by: Express

{"id":"ade072a7-5720-4d7e-8c11-fefc19b9352a","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","personaId":null,"nombreCompleto":"Juan Solano","sexoId":null,"ocupacion":"Jornalero","tipoDocumentoId":null,"numeroDocumentoCifrado":null,"numeroDocumentoHash":null,"gradoAcademicoId":null,"rangoIngresoId":null,"cuentaConSeguro":null,"parentescoId":null,"creadoEn":"2026-09-10T17:30:37.735217+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:37.735217+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

