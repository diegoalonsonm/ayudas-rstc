# Solicitudes de ayuda

Ver [cómo probar la API](README.md). La parroquia receptora debe estar en el alcance del actor. El alta usa `registrar_solicitud_con_ayudas`.

Estados: `BORRADOR` → `PRESENTADA` → `EN_REVISION` → `APROBADA` → `ACTIVA` → `FINALIZADA`. Desde varios estados se puede pasar a `CANCELADA`. `RECHAZADA`, `FINALIZADA` y `CANCELADA` son terminales.

## POST /solicitudes-ayuda

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "personaSolicitanteId": "{{personaId}}",
  "parroquiaReceptoraId": "{{parroquiaId}}",
  "sectorOficial": "Barrio Centro",
  "tiposAyuda": ["{{tipoAyudaId}}"],
  "estado": "BORRADOR"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/solicitudes-ayuda" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"personaSolicitanteId\":\"$PERSONA_ID\",\"parroquiaReceptoraId\":\"$PARROQUIA_ID\",\"sectorOficial\":\"Barrio Centro\",\"tiposAyuda\":[\"$TIPO_AYUDA_ID\"],\"estado\":\"BORRADOR\"}"
```

## GET /solicitudes-ayuda

Listado filtrado por parroquias accesibles.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda" \
  -H "Authorization: Bearer $TOKEN"
```

## GET /solicitudes-ayuda/:id

Expediente completo. Audita `CONSULTAR_EXPEDIENTE`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## PATCH /solicitudes-ayuda/:id

Campos de entrevista (no el estado).

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `PATCH` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "fechaEntrevista": "2026-09-07",
  "observaciones": "Visita domiciliaria pendiente"
}
```

### Terminal

```bash
curl -s -X PATCH "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fechaEntrevista":"2026-09-07","observaciones":"Visita domiciliaria pendiente"}'
```

## POST /solicitudes-ayuda/:id/estado

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/estado` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "estadoNuevo": "PRESENTADA",
  "motivo": "Entrevista completa"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/estado" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estadoNuevo":"PRESENTADA","motivo":"Entrevista completa"}'
```

## POST /solicitudes-ayuda/:id/eliminacion

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/eliminacion` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "motivo": "Duplicada"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/eliminacion" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"motivo":"Duplicada"}'
```

## POST /solicitudes-ayuda/:id/restauracion

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/restauracion` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "motivo": "Eliminada por error"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/restauracion" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"motivo":"Eliminada por error"}'
```

## Integrantes

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/integrantes` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/integrantes` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombreCompleto": "Juan Solano",
  "ocupacion": "Jornalero"
}
```

`PATCH {{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/integrantes/{{integranteId}}` con body parcial.

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/integrantes" \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/integrantes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombreCompleto":"Juan Solano","ocupacion":"Jornalero"}'
```

## Evaluación de vivienda

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/evaluacion-vivienda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/evaluacion-vivienda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "observaciones": "Techo de zinc"
}
```

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/evaluacion-vivienda" \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/evaluacion-vivienda" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"observaciones":"Techo de zinc"}'
```

## Ayudas solicitadas

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/ayudas-solicitadas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/ayudas-solicitadas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "tipoAyudaId": "{{tipoAyudaId}}",
  "detalle": null
}
```

`DELETE` del ítem: body `{ "motivo": "Selección incorrecta" }`.

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/ayudas-solicitadas" \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/ayudas-solicitadas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tipoAyudaId\":\"$TIPO_AYUDA_ID\",\"detalle\":null}"

curl -s -X DELETE "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/ayudas-solicitadas/$AYUDA_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"motivo":"Selección incorrecta"}'
```
