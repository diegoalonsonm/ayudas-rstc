# Casos: Usuarios

## usuarios-get

| Campo | Valor |
| --- | --- |
| id | `usuarios-get` |
| execution | `run` |
| method | `GET` |
| path | `/usuarios` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | lista presente |
| captures | `usuarioId` (sesión o primer ítem) |
| wave | 2 |

## usuarios-get-id

| Campo | Valor |
| --- | --- |
| id | `usuarios-get-id` |
| execution | `run` |
| method | `GET` |
| path | `/usuarios/{{usuarioId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | incluye asignación vigente si aplica |
| dependsOn | `usuarios-get` o `auth-post-sesiones` |
| wave | 2 |

## usuarios-post

| Campo | Valor |
| --- | --- |
| id | `usuarios-post` |
| execution | `skipped` |
| reason | Fuera del happy path (alta de identidad Auth) |
| method | `POST` |
| path | `/usuarios` |

## usuarios-patch-id

| Campo | Valor |
| --- | --- |
| id | `usuarios-patch-id` |
| execution | `skipped` |
| reason | No baja/desactivación de usuarios |
| method | `PATCH` |
| path | `/usuarios/{{usuarioId}}` |

## usuarios-post-asignaciones

| Campo | Valor |
| --- | --- |
| id | `usuarios-post-asignaciones` |
| execution | `skipped` |
| reason | No reasignación de roles en happy path |
| method | `POST` |
| path | `/usuarios/{{usuarioId}}/asignaciones` |
