# Casos: Solicitudes de ayuda

## solicitudes-post

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `solicitudId` |
| dependsOn | `personaId`, `parroquiaId`; `tipoAyudaId` opcional |
| wave | 4 |

```json
{
  "personaSolicitanteId": "{{personaId}}",
  "parroquiaReceptoraId": "{{parroquiaId}}",
  "sectorOficial": "Barrio Centro",
  "tiposAyuda": ["{{tipoAyudaId}}"],
  "estado": "BORRADOR"
}
```

## solicitudes-get

| Campo | Valor |
| --- | --- |
| id | `solicitudes-get` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda` |
| auth | Bearer |
| expectedStatus | `200` |
| wave | 4 |

## solicitudes-get-id

| Campo | Valor |
| --- | --- |
| id | `solicitudes-get-id` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda/{{solicitudId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `solicitudes-post` |
| wave | 4 |

## solicitudes-patch-id

| Campo | Valor |
| --- | --- |
| id | `solicitudes-patch-id` |
| execution | `run` |
| method | `PATCH` |
| path | `/solicitudes-ayuda/{{solicitudId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| wave | 4 |

```json
{
  "fechaEntrevista": "2026-09-07",
  "observaciones": "Visita domiciliaria pendiente"
}
```

## solicitudes-post-estado-presentada

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post-estado-presentada` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/estado` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | estado nuevo `PRESENTADA` si el cuerpo lo expone |
| wave | 4 |

```json
{
  "estadoNuevo": "PRESENTADA",
  "motivo": "Entrevista completa"
}
```

## solicitudes-post-eliminacion

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post-eliminacion` |
| execution | `skipped` |
| reason | Fuera del happy path |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/eliminacion` |

## solicitudes-post-restauracion

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post-restauracion` |
| execution | `skipped` |
| reason | Fuera del happy path |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/restauracion` |

## solicitudes-get-integrantes

| Campo | Valor |
| --- | --- |
| id | `solicitudes-get-integrantes` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda/{{solicitudId}}/integrantes` |
| auth | Bearer |
| expectedStatus | `200` |
| wave | 4 |

## solicitudes-post-integrantes

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post-integrantes` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/integrantes` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `integranteId` |
| wave | 4 |

```json
{
  "nombreCompleto": "Juan Solano",
  "ocupacion": "Jornalero"
}
```

## solicitudes-patch-integrantes-id

| Campo | Valor |
| --- | --- |
| id | `solicitudes-patch-integrantes-id` |
| execution | `run` |
| method | `PATCH` |
| path | `/solicitudes-ayuda/{{solicitudId}}/integrantes/{{integranteId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `solicitudes-post-integrantes` |
| wave | 4 |

```json
{
  "ocupacion": "Jornalero (actualizado)"
}
```

## solicitudes-get-evaluacion-vivienda

| Campo | Valor |
| --- | --- |
| id | `solicitudes-get-evaluacion-vivienda` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda/{{solicitudId}}/evaluacion-vivienda` |
| auth | Bearer |
| expectedStatus | `200` |
| wave | 4 |

## solicitudes-post-evaluacion-vivienda

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post-evaluacion-vivienda` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/evaluacion-vivienda` |
| auth | Bearer |
| expectedStatus | `200` o `201` |
| wave | 4 |

```json
{
  "observaciones": "Techo de zinc"
}
```

## solicitudes-get-ayudas-solicitadas

| Campo | Valor |
| --- | --- |
| id | `solicitudes-get-ayudas-solicitadas` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda/{{solicitudId}}/ayudas-solicitadas` |
| auth | Bearer |
| expectedStatus | `200` |
| wave | 4 |

## solicitudes-post-ayudas-solicitadas

| Campo | Valor |
| --- | --- |
| id | `solicitudes-post-ayudas-solicitadas` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/ayudas-solicitadas` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `ayudaId` |
| dependsOn | `tipoAyudaId` |
| wave | 4 |

```json
{
  "tipoAyudaId": "{{tipoAyudaId}}",
  "detalle": null
}
```

## solicitudes-delete-ayudas-solicitadas-id

| Campo | Valor |
| --- | --- |
| id | `solicitudes-delete-ayudas-solicitadas-id` |
| execution | `run` |
| condition | solo si `solicitudes-post-ayudas-solicitadas` creó `ayudaId` en esta corrida |
| method | `DELETE` |
| path | `/solicitudes-ayuda/{{solicitudId}}/ayudas-solicitadas/{{ayudaId}}` |
| auth | Bearer |
| expectedStatus | `200` o `204` |
| wave | 4 |

```json
{
  "motivo": "Selección incorrecta (fila de prueba)"
}
```
