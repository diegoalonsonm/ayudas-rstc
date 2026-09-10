# Documentos de consentimiento

Ver [cómo probar la API](README.md). Bucket privado `documentos-consentimiento`. Se guarda `claveObjeto`, nunca una URL permanente. MIME: PDF, JPEG, PNG.

## GET /solicitudes-ayuda/:id/documentos-consentimiento

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/documentos-consentimiento` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/documentos-consentimiento" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /solicitudes-ayuda/:id/documentos-consentimiento

Carga de archivo. En el cliente REST use **Body → form-data**, no raw JSON. No fije `Content-Type` a mano: el cliente envía `multipart/form-data` con el boundary.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/documentos-consentimiento` |
| Query | `fechaFirma` = `2026-09-07` (opcional) |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | form-data |

| Key | Type | Value |
| --- | --- | --- |
| `archivo` | File | seleccione un PDF, JPEG o PNG |

### Terminal

```bash
curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/documentos-consentimiento?fechaFirma=2026-09-07" \
  -H "Authorization: Bearer $TOKEN" \
  -F "archivo=@./consentimiento.pdf;type=application/pdf"
```

Sustituya `./consentimiento.pdf` por la ruta real del archivo.

## GET /documentos-consentimiento/:id/url

URL firmada (~60 s). `descargar=true` audita `DESCARGAR_DOCUMENTO`; si se omite, `VISUALIZAR_DOCUMENTO`.

Respuesta: `urlFirmada`, `expiraEnSegundos`. No es una URL permanente.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/documentos-consentimiento/{{documentoId}}/url` |
| Query | `descargar` = `true` (opcional) |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/documentos-consentimiento/$DOCUMENTO_ID/url?descargar=true" \
  -H "Authorization: Bearer $TOKEN"
```
