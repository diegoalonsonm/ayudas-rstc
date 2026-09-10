# documentos-post

- verdict: **succeeded**
- timestamp: 2026-09-10T17:47:57.781Z
- durationMs: 101

## Assertions

- pass: HTTP 201 matches expected 200|201

## Request

```http
POST http://localhost:3000/api/v1/solicitudes-ayuda/3fd57ce9-a675-42c1-a602-bb146b54280b/documentos-consentimiento?fechaFirma=2026-09-07
Authorization: Bearer [REDACTED]

multipart form-data field=archivo file=consentimiento-prueba.pdf
```

## Response

```http
HTTP 201
connection: keep-alive
content-length: 811
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:47:57 GMT
etag: W/"32b-MPMIZFP6QFPyMMG0rp864m7Syps"
keep-alive: timeout=5
x-powered-by: Express

{"id":"adc795b5-f27c-4dc6-aa8c-5470027ddec4","solicitudAyudaId":"3fd57ce9-a675-42c1-a602-bb146b54280b","nombreBucket":"documentos-consentimiento","claveObjeto":"3fd57ce9-a675-42c1-a602-bb146b54280b/1855df33-9fa3-4f34-9350-f39a0142188d","nombreArchivoOriginal":"consentimiento-prueba.pdf","tipoMime":"application/pdf","tamanoBytes":306,"sumaVerificacion":"a6abcaeffc16623591f5707491bbfc475af67a682d9f69b2abc143a4cd271764","fechaFirma":"2026-09-07","usuarioCargaId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","cargadoEn":"2026-09-10T17:47:57.848777+00:00","creadoEn":"2026-09-10T17:47:57.848777+00:00","creadoPorUsuarioId":"6bf12564-ed1f-4a20-809d-bf6b23e029ad","actualizadoEn":"2026-09-10T17:47:57.848777+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}
```

