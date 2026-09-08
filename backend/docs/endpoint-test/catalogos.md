# Casos: Catálogos

`:catalogo` documentado: `tipos-documento`, `sexos`, `grados-academicos`, `parentescos`, `rangos-ingreso`, `tipos-vivienda`, `tipos-tenencia`, `condiciones-vivienda`, `tipos-ayuda`, `roles`, `cantones`, `distritos`, `barrios`.

## catalogos-get-tipos-documento

| Campo | Valor |
| --- | --- |
| id | `catalogos-get-tipos-documento` |
| execution | `run` |
| method | `GET` |
| path | `/catalogos/tipos-documento` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | respuesta es lista o envuelta en lista |
| captures | `tipoDocumentoId` (primer `id`) |
| wave | 2 |

## catalogos-get-tipos-ayuda

| Campo | Valor |
| --- | --- |
| id | `catalogos-get-tipos-ayuda` |
| execution | `run` |
| method | `GET` |
| path | `/catalogos/tipos-ayuda` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | lista presente |
| captures | `tipoAyudaId` (primer `id`) |
| wave | 2 |

## catalogos-get-roles

| Campo | Valor |
| --- | --- |
| id | `catalogos-get-roles` |
| execution | `run` |
| method | `GET` |
| path | `/catalogos/roles` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | lista presente |
| captures | `rolId` (primer `id`) |
| wave | 2 |

## catalogos-get-roles-id

| Campo | Valor |
| --- | --- |
| id | `catalogos-get-roles-id` |
| execution | `run` |
| method | `GET` |
| path | `/catalogos/roles/{{rolId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | objeto con `id` igual a `rolId` |
| dependsOn | `catalogos-get-roles` |
| wave | 2 |

## catalogos-post-cantones

| Campo | Valor |
| --- | --- |
| id | `catalogos-post-cantones` |
| execution | `skipped` |
| reason | Fuera del happy path; no mutar catálogos existentes |
| method | `POST` |
| path | `/catalogos/cantones` |

## catalogos-patch-cantones-id

| Campo | Valor |
| --- | --- |
| id | `catalogos-patch-cantones-id` |
| execution | `skipped` |
| reason | Fuera del happy path |
| method | `PATCH` |
| path | `/catalogos/cantones/{{cantonId}}` |

## catalogos-delete-cantones-id

| Campo | Valor |
| --- | --- |
| id | `catalogos-delete-cantones-id` |
| execution | `skipped` |
| reason | No DELETE de catálogos existentes |
| method | `DELETE` |
| path | `/catalogos/cantones/{{cantonId}}` |
