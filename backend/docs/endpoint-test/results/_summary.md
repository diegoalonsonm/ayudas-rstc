# Resultados de endpoints

- baseUrl: `http://localhost:3000/api/v1`
- timestamp: 2026-09-07T19:12:22.253Z
- Postman collection: ayudas-rstc (`29171076-9bae6770-5087-4b67-83e7-9654aab192c9`)

## Conteos

- succeeded: 0
- failed partially: 0
- failed entirely: 51
- skipped: 14

La API en localhost:3000 respondió HTTP 500 (codigo INTERNO) en GET /salud y POST /auth/sesiones. El resto de casos autenticados no se envió.

## Detalle

| id | verdict | notes |
| --- | --- | --- |
| catalogos-post-cantones | skipped | Fuera del happy path; no mutar catálogos existentes |
| catalogos-patch-cantones-id | skipped | Fuera del happy path |
| catalogos-delete-cantones-id | skipped | No DELETE de catálogos existentes |
| organizacion-patch-diocesis-id | skipped | No PATCH de organización existente |
| organizacion-delete-diocesis-id | skipped | No DELETE de organización existente |
| organizacion-patch-vicarias-id | skipped | No PATCH de organización existente |
| organizacion-delete-vicarias-id | skipped | No DELETE de organización existente |
| organizacion-patch-parroquias-id | skipped | No PATCH de organización existente |
| organizacion-delete-parroquias-id | skipped | No DELETE de organización existente |
| usuarios-post | skipped | Fuera del happy path (alta de identidad Auth) |
| usuarios-patch-id | skipped | No baja/desactivación de usuarios |
| usuarios-post-asignaciones | skipped | No reasignación de roles en happy path |
| solicitudes-post-eliminacion | skipped | Fuera del happy path |
| solicitudes-post-restauracion | skipped | Fuera del happy path |
| salud-get | failed entirely |  |
| auth-post-sesiones | failed entirely |  |
| auth-get-sesion | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| auth-post-sesiones-renovacion | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| catalogos-get-tipos-documento | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| catalogos-get-tipos-ayuda | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| catalogos-get-roles | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| catalogos-get-roles-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-get-diocesis | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-post-diocesis | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-get-diocesis-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-get-vicarias | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-post-vicarias | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-get-vicarias-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-get-parroquias | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-post-parroquias | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| organizacion-get-parroquias-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| usuarios-get | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| usuarios-get-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-post | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-get | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-get-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-patch-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-post-busquedas | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-post-direcciones | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-get-direcciones | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| personas-patch-direcciones-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-post | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-get | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-get-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-patch-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-post-estado-presentada | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-get-integrantes | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-post-integrantes | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-patch-integrantes-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-get-evaluacion-vivienda | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-post-evaluacion-vivienda | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-get-ayudas-solicitadas | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-post-ayudas-solicitadas | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| solicitudes-delete-ayudas-solicitadas-id | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| planes-get | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| planes-post | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| planes-get-detalles | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| planes-post-detalles | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| planes-get-entregas | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| planes-post-entregas | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| documentos-get | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| documentos-post | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| documentos-get-url | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| auditoria-get | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |
| auth-delete-sesiones | failed entirely | No ejecutado: POST /auth/sesiones falló (API devolvió error; sin tokenAcceso) |

