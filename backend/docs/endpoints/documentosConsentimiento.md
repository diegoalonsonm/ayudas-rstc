# Documentos de consentimiento

Ver [cómo usar Postman](README.md). Bucket privado `documentos-consentimiento`. Se guarda `claveObjeto`, nunca una URL permanente. MIME: PDF, JPEG, PNG.

## GET /solicitudes-ayuda/:id/documentos-consentimiento

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/documentos-consentimiento` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /solicitudes-ayuda/:id/documentos-consentimiento

Carga de archivo. En Postman use **Body → form-data**, no raw JSON.

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

En Params agregue `fechaFirma` = `2026-09-07` si aplica.

No ponga header `Content-Type` a mano: Postman envía `multipart/form-data` con el boundary.

## GET /documentos-consentimiento/:id/url

URL firmada (~60 s). `descargar=true` audita `DESCARGAR_DOCUMENTO`; si se omite, `VISUALIZAR_DOCUMENTO`.

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/documentos-consentimiento/{{documentoId}}/url` |
| Query | `descargar` = `true` (opcional) |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

Respuesta: `urlFirmada`, `expiraEnSegundos`. Abra la URL en el navegador; no es permanente.
