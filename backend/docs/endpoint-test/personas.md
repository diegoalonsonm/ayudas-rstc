# Casos: Personas

## personas-post

| Campo | Valor |
| --- | --- |
| id | `personas-post` |
| execution | `run` |
| method | `POST` |
| path | `/personas` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| assertions | objeto con `id` |
| captures | `personaId` |
| dependsOn | `tipoDocumentoId` opcional |
| wave | 3 |

```json
{
  "tipoDocumentoId": "{{tipoDocumentoId}}",
  "numeroDocumento": "1-2345-6789",
  "primerNombre": "María",
  "primerApellido": "Solano",
  "telefono": "88881111"
}
```

## personas-get

| Campo | Valor |
| --- | --- |
| id | `personas-get` |
| execution | `run` |
| method | `GET` |
| path | `/personas` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | lista presente |
| wave | 3 |

## personas-get-id

| Campo | Valor |
| --- | --- |
| id | `personas-get-id` |
| execution | `run` |
| method | `GET` |
| path | `/personas/{{personaId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | `id` coincide |
| dependsOn | `personas-post` |
| wave | 3 |

## personas-patch-id

| Campo | Valor |
| --- | --- |
| id | `personas-patch-id` |
| execution | `run` |
| method | `PATCH` |
| path | `/personas/{{personaId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | `segundoNombre` actualizado o cuerpo con `id` |
| dependsOn | `personas-post` |
| wave | 3 |

```json
{
  "segundoNombre": "Elena",
  "telefono": "88882222"
}
```

## personas-post-busquedas

| Campo | Valor |
| --- | --- |
| id | `personas-post-busquedas` |
| execution | `run` |
| method | `POST` |
| path | `/personas/busquedas` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | respuesta de búsqueda (lista o vacío de procesos) |
| wave | 3 |

```json
{
  "numeroDocumento": "1-2345-6789"
}
```

## personas-post-direcciones

| Campo | Valor |
| --- | --- |
| id | `personas-post-direcciones` |
| execution | `run` |
| method | `POST` |
| path | `/personas/{{personaId}}/direcciones` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `direccionId` |
| dependsOn | `personas-post` |
| wave | 3 |

```json
{
  "senas": "100 m sur de la iglesia",
  "esActual": true,
  "vigenteDesde": "2026-09-07"
}
```

## personas-get-direcciones

| Campo | Valor |
| --- | --- |
| id | `personas-get-direcciones` |
| execution | `run` |
| method | `GET` |
| path | `/personas/{{personaId}}/direcciones` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `personas-post` |
| wave | 3 |

## personas-patch-direcciones-id

| Campo | Valor |
| --- | --- |
| id | `personas-patch-direcciones-id` |
| execution | `run` |
| method | `PATCH` |
| path | `/personas/{{personaId}}/direcciones/{{direccionId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `personas-post-direcciones` |
| wave | 3 |

```json
{
  "esActual": false,
  "vigenteHasta": "2026-09-07"
}
```
