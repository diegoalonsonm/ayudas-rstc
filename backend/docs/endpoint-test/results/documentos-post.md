# documentos-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:38.343Z
- durationMs: 180

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/98468a57-02c3-4f43-8120-13ed93f72a48/documentos-consentimiento?fechaFirma=2026-09-07
Authorization: Bearer [REDACTED]

multipart form-data field=archivo file=consentimiento-prueba.pdf
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 811
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:38 GMT
etag: W/"32b-D0BZtCJHDJE7fufB4AH3RxdMDDs"
keep-alive: timeout=5
x-powered-by: Express

{"id":"1273433c-1274-4654-8cd5-0c059fc4c65a","solicitudAyudaId":"98468a57-02c3-4f43-8120-13ed93f72a48","nombreBucket":"documentos-consentimiento","claveObjeto":"98468a57-02c3-4f43-8120-13ed93f72a48/acf27a90-70a0-4da8-9439-a01d86349b87","nombreArchivoOriginal":"consentimiento-prueba.pdf","tipoMime":"application/pdf","tamanoBytes":306,"sumaVerificacion":"a6abcaeffc16623591f5707491bbfc475af67a682d9f69b2abc143a4cd271764","fechaFirma":"2026-09-07","usuarioCargaId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","cargadoEn":"2026-09-10T17:30:38.437658+00:00","creadoEn":"2026-09-10T17:30:38.437658+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:30:38.437658+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

