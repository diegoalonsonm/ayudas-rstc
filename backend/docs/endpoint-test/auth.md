# Casos: Auth

## auth-post-sesiones

| Campo | Valor |
| --- | --- |
| id | `auth-post-sesiones` |
| execution | `run` |
| method | `POST` |
| path | `/auth/sesiones` |
| auth | none |
| expectedStatus | `200` o `201` |
| assertions | `tokenAcceso`, `tokenRenovacion`, `usuario` presentes |
| captures | `tokenAcceso`, `tokenRenovacion`, `usuario.id` |
| wave | 1 |

```json
{
  "correo": "admin@local.test",
  "contrasena": "Cambiar1234"
}
```

## auth-get-sesion

| Campo | Valor |
| --- | --- |
| id | `auth-get-sesion` |
| execution | `run` |
| method | `GET` |
| path | `/auth/sesion` |
| auth | Bearer `tokenAcceso` |
| body | none |
| expectedStatus | `200` |
| assertions | actor con rol o asignación |
| captures | `usuarioId` si viene en el cuerpo |
| dependsOn | `auth-post-sesiones` |
| wave | 1 |

## auth-post-sesiones-renovacion

| Campo | Valor |
| --- | --- |
| id | `auth-post-sesiones-renovacion` |
| execution | `run` |
| method | `POST` |
| path | `/auth/sesiones/renovacion` |
| auth | none |
| expectedStatus | `200` o `201` |
| assertions | nuevos `tokenAcceso` y `tokenRenovacion` |
| captures | `tokenAcceso`, `tokenRenovacion` |
| dependsOn | `auth-post-sesiones` |
| wave | 1 |

```json
{
  "tokenRenovacion": "{{tokenRenovacion}}"
}
```

## auth-delete-sesiones

| Campo | Valor |
| --- | --- |
| id | `auth-delete-sesiones` |
| execution | `run` |
| method | `DELETE` |
| path | `/auth/sesiones` |
| auth | Bearer `tokenAcceso` |
| body | none |
| expectedStatus | `200` o `204` |
| assertions | respuesta de cierre o cuerpo vacío |
| dependsOn | todas las oleadas anteriores |
| wave | 8 |
