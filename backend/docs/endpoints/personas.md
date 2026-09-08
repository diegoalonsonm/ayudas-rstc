# Personas

Ver [cómo probar la API](README.md). Documento y teléfono se cifran en la API. La búsqueda interparroquial usa el hash y no devuelve expediente.

## POST /personas

### Cliente REST

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

### Terminal

```bash
curl -s -X POST "$BASE_URL/personas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tipoDocumentoId\":\"$TIPO_DOCUMENTO_ID\",\"numeroDocumento\":\"1-2345-6789\",\"primerNombre\":\"María\",\"primerApellido\":\"Solano\",\"telefono\":\"88881111\"}"
```

## GET /personas

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/personas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/personas" \
  -H "Authorization: Bearer $TOKEN"
```

## GET /personas/:id

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/personas/{{personaId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/personas/$PERSONA_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## PATCH /personas/:id

### Cliente REST

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

### Terminal

```bash
curl -s -X PATCH "$BASE_URL/personas/$PERSONA_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"segundoNombre":"Elena","telefono":"88882222"}'
```

## POST /personas/busquedas

Audita `BUSCAR_PERSONA`. Respuesta limitada a procesos vigentes.

### Cliente REST

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

### Terminal

```bash
curl -s -X POST "$BASE_URL/personas/busquedas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"numeroDocumento":"1-2345-6789"}'
```

## GET /personas/:id/direcciones

Solo una dirección `esActual` activa por persona.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/personas/{{personaId}}/direcciones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/personas/$PERSONA_ID/direcciones" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /personas/:id/direcciones

### Cliente REST

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

### Terminal

```bash
curl -s -X POST "$BASE_URL/personas/$PERSONA_ID/direcciones" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"senas":"100 m sur de la iglesia","esActual":true,"vigenteDesde":"2026-09-07"}'
```

## PATCH /personas/:id/direcciones/:direccionId

### Cliente REST

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

### Terminal

```bash
curl -s -X PATCH "$BASE_URL/personas/$PERSONA_ID/direcciones/$DIRECCION_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"esActual":false,"vigenteHasta":"2026-09-07"}'
```
