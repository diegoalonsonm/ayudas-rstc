# Usuarios

Ver [cómo usar Postman](README.md). Todas las rutas autenticadas. La creación valida jerarquía de roles y alcance (también en RPC `crear_usuario_con_asignacion`).

Alcance por rol al crear o reasignar: pastoral/parroquial → `parroquiaId`; vicarial → `vicariaId`; diocesano → `diocesisId`; administrador → sin alcance territorial.

## GET /usuarios

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/usuarios` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## GET /usuarios/:id

Incluye la asignación vigente.

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/usuarios/{{usuarioId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /usuarios

Crea identidad en Auth y fila + asignación.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/usuarios` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombreCompleto": "Ana Pastoral",
  "correo": "ana@local.test",
  "contrasena": "Cambiar1234",
  "rolCodigo": "PERSONAL_PASTORAL",
  "parroquiaId": "{{parroquiaId}}",
  "motivo": "Alta inicial"
}
```

## PATCH /usuarios/:id

| Campo | Valor |
| --- | --- |
| Método | `PATCH` |
| URL | `{{baseUrl}}/usuarios/{{usuarioId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "activo": false,
  "motivo": "Baja temporal"
}
```

## POST /usuarios/:id/asignaciones

Cierra la asignación vigente y abre otra. Nadie puede autoasignarse.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/usuarios/{{usuarioId}}/asignaciones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "rolCodigo": "COORDINADOR_PARROQUIAL",
  "parroquiaId": "{{parroquiaId}}",
  "motivo": "Promoción"
}
```
