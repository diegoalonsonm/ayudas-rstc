# Casos: Usuarios

## usuarios-get

| Campo | Valor |
| --- | --- |
| id | `usuarios-get` |
| execution | `run` |
| method | `GET` |
| path | `/usuarios` |
| expectedStatus | `200` |

## usuarios-get-id

| Campo | Valor |
| --- | --- |
| id | `usuarios-get-id` |
| execution | `run` |
| method | `GET` |
| path | `/usuarios/{{usuarioId}}` |
| expectedStatus | `200` |

## usuarios-post

| Campo | Valor |
| --- | --- |
| id | `usuarios-post` |
| execution | `run` |
| method | `POST` |
| path | `/usuarios` |
| expectedStatus | `200` o `201` |
| captures | `usuarioCreadoId` |

Correo único `endpoint.test.<stamp>@local.test`. Alcance: parroquia TEST o la primera de GET.

## usuarios-patch-id

PATCH `{ "activo": false, "motivo": "..." }` sobre el usuario creado. Si el alta falla, se intenta contra el usuario de sesión.

## usuarios-post-asignaciones

POST `{ "rolCodigo": "COORDINADOR_PARROQUIAL", "parroquiaId": "...", "motivo": "..." }`.
