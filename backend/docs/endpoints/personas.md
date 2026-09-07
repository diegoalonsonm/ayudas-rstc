# Personas

Ver [cómo usar Postman](README.md). Documento y teléfono se cifran en la API. La búsqueda interparroquial usa el hash y no devuelve expediente.

## POST /personas

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/personas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "tipoDocumentoId": "{{tipoDocumentoId}}",
  "numeroDocumento": "1-2345-6789",
  "primerNombre": "María",
  "primerApellido": "Solano",
  "telefono": "88881111"
}
```

## GET /personas

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/personas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## GET /personas/:id

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/personas/{{personaId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## PATCH /personas/:id

| Campo | Valor |
| --- | --- |
| Método | `PATCH` |
| URL | `{{baseUrl}}/personas/{{personaId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "segundoNombre": "Elena",
  "telefono": "88882222"
}
```

## POST /personas/busquedas

Audita `BUSCAR_PERSONA`. Respuesta limitada a procesos vigentes.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/personas/busquedas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "numeroDocumento": "1-2345-6789"
}
```

## GET /personas/:id/direcciones

Solo una dirección `esActual` activa por persona.

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/personas/{{personaId}}/direcciones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /personas/:id/direcciones

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/personas/{{personaId}}/direcciones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "senas": "100 m sur de la iglesia",
  "esActual": true,
  "vigenteDesde": "2026-09-07"
}
```

## PATCH /personas/:id/direcciones/:direccionId

| Campo | Valor |
| --- | --- |
| Método | `PATCH` |
| URL | `{{baseUrl}}/personas/{{personaId}}/direcciones/{{direccionId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "esActual": false,
  "vigenteHasta": "2026-09-07"
}
```
