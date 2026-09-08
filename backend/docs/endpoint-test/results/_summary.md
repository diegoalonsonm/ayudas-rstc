# Resultados de endpoints

- baseUrl: `http://localhost:3000/api/v1`
- timestamp: 2026-09-08T14:24:54.286Z

## Conteos

- succeeded: 1
- failed partially: 0
- failed entirely: 74

POST /auth/sesiones no devolvió tokenAcceso (la API no pudo hablar con Auth/Supabase). Los casos autenticados se enviaron igual y quedaron documentados, en su mayoría HTTP 401.

## Detalle

| id | verdict | notes |
| --- | --- | --- |
| salud-get | succeeded |  |
| auth-post-sesiones | failed entirely |  |
| auth-get-sesion | failed entirely |  |
| auth-post-sesiones-renovacion | failed entirely | tokenRenovacion no capturado; se envía placeholder |
| catalogos-get-tipos-documento | failed entirely |  |
| catalogos-get-sexos | failed entirely |  |
| catalogos-get-grados-academicos | failed entirely |  |
| catalogos-get-parentescos | failed entirely |  |
| catalogos-get-rangos-ingreso | failed entirely |  |
| catalogos-get-tipos-vivienda | failed entirely |  |
| catalogos-get-tipos-tenencia | failed entirely |  |
| catalogos-get-condiciones-vivienda | failed entirely |  |
| catalogos-get-tipos-ayuda | failed entirely |  |
| catalogos-get-roles | failed entirely |  |
| catalogos-get-cantones | failed entirely |  |
| catalogos-get-distritos | failed entirely |  |
| catalogos-get-barrios | failed entirely |  |
| catalogos-get-roles-id | failed entirely | rolId no capturado; se usa UUID placeholder |
| catalogos-post-cantones | failed entirely |  |
| catalogos-patch-cantones-id | failed entirely | cantonId no capturado; se usa UUID placeholder |
| catalogos-delete-cantones-id | failed entirely |  |
| organizacion-get-diocesis | failed entirely |  |
| organizacion-post-diocesis | failed entirely |  |
| organizacion-get-diocesis-id | failed entirely |  |
| organizacion-patch-diocesis-id | failed entirely |  |
| organizacion-get-vicarias | failed entirely |  |
| organizacion-post-vicarias | failed entirely |  |
| organizacion-get-vicarias-id | failed entirely |  |
| organizacion-patch-vicarias-id | failed entirely |  |
| organizacion-get-parroquias | failed entirely |  |
| organizacion-post-parroquias | failed entirely |  |
| organizacion-get-parroquias-id | failed entirely |  |
| organizacion-patch-parroquias-id | failed entirely |  |
| usuarios-get | failed entirely |  |
| usuarios-get-id | failed entirely |  |
| usuarios-post | failed entirely |  |
| usuarios-patch-id | failed entirely | PATCH sobre usuario de sesión (no se pudo crear uno de prueba) |
| usuarios-post-asignaciones | failed entirely | Sin usuario creado; se intenta contra usuario de sesión (puede fallar por autoasignación) |
| personas-post | failed entirely |  |
| personas-get | failed entirely |  |
| personas-get-id | failed entirely |  |
| personas-patch-id | failed entirely |  |
| personas-post-busquedas | failed entirely |  |
| personas-post-direcciones | failed entirely |  |
| personas-get-direcciones | failed entirely |  |
| personas-patch-direcciones-id | failed entirely |  |
| solicitudes-post | failed entirely |  |
| solicitudes-get | failed entirely |  |
| solicitudes-get-id | failed entirely |  |
| solicitudes-patch-id | failed entirely |  |
| solicitudes-post-estado-presentada | failed entirely |  |
| solicitudes-get-integrantes | failed entirely |  |
| solicitudes-post-integrantes | failed entirely |  |
| solicitudes-patch-integrantes-id | failed entirely |  |
| solicitudes-get-evaluacion-vivienda | failed entirely |  |
| solicitudes-post-evaluacion-vivienda | failed entirely |  |
| solicitudes-get-ayudas-solicitadas | failed entirely |  |
| solicitudes-post-ayudas-solicitadas | failed entirely |  |
| solicitudes-delete-ayudas-solicitadas-id | failed entirely |  |
| planes-get | failed entirely |  |
| planes-post | failed entirely |  |
| planes-get-detalles | failed entirely |  |
| planes-post-detalles | failed entirely |  |
| planes-get-entregas | failed entirely |  |
| planes-post-entregas | failed entirely |  |
| documentos-get | failed entirely |  |
| documentos-post | failed entirely |  |
| documentos-get-url | failed entirely |  |
| auditoria-get | failed entirely |  |
| solicitudes-post-eliminacion | failed entirely |  |
| solicitudes-post-restauracion | failed entirely |  |
| organizacion-delete-parroquias-id | failed entirely | Sin parroquia TEST; UUID placeholder |
| organizacion-delete-vicarias-id | failed entirely |  |
| organizacion-delete-diocesis-id | failed entirely |  |
| auth-delete-sesiones | failed entirely |  |

