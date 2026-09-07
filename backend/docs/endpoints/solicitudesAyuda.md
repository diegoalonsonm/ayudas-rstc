# Solicitudes de ayuda

Ver [cómo usar Postman](README.md). La parroquia receptora debe estar en el alcance del actor. El alta usa `registrar_solicitud_con_ayudas`.

Estados: `BORRADOR` → `PRESENTADA` → `EN_REVISION` → `APROBADA` → `ACTIVA` → `FINALIZADA`. Desde varios estados se puede pasar a `CANCELADA`. `RECHAZADA`, `FINALIZADA` y `CANCELADA` son terminales.

## POST /solicitudes-ayuda

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

## GET /solicitudes-ayuda

Listado filtrado por parroquias accesibles.

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## GET /solicitudes-ayuda/:id

Expediente completo. Audita `CONSULTAR_EXPEDIENTE`.

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## PATCH /solicitudes-ayuda/:id

Campos de entrevista (no el estado).

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

## POST /solicitudes-ayuda/:id/estado

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

## POST /solicitudes-ayuda/:id/eliminacion

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

## POST /solicitudes-ayuda/:id/restauracion

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

## Integrantes

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

`PATCH {{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/integrantes/{{integranteId}}` con el mismo tipo de body parcial.

## Evaluación de vivienda

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

## Ayudas solicitadas

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

`DELETE {{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/ayudas-solicitadas/{{ayudaId}}` con body `{ "motivo": "Selección incorrecta" }`.
