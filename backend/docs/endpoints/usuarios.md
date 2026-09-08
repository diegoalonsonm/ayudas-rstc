# Usuarios

Ver [cómo probar la API](README.md). Todas las rutas autenticadas. La creación valida jerarquía de roles y alcance (también en RPC `crear_usuario_con_asignacion`).

Alcance por rol al crear o reasignar: pastoral/parroquial → `parroquiaId`; vicarial → `vicariaId`; diocesano → `diocesisId`; administrador → sin alcance territorial.

## GET /usuarios

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/usuarios` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/usuarios" \
  -H "Authorization: Bearer $TOKEN"
```

## GET /usuarios/:id

Incluye la asignación vigente.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/usuarios/{{usuarioId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/usuarios/$USUARIO_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /usuarios

Crea identidad en Auth y fila + asignación.

### Cliente REST

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

### Terminal

```bash
curl -s -X POST "$BASE_URL/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nombreCompleto\":\"Ana Pastoral\",\"correo\":\"ana@local.test\",\"contrasena\":\"Cambiar1234\",\"rolCodigo\":\"PERSONAL_PASTORAL\",\"parroquiaId\":\"$PARROQUIA_ID\",\"motivo\":\"Alta inicial\"}"
```

## PATCH /usuarios/:id

### Cliente REST

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

### Terminal

```bash
curl -s -X PATCH "$BASE_URL/usuarios/$USUARIO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"activo":false,"motivo":"Baja temporal"}'
```

## POST /usuarios/:id/asignaciones

Cierra la asignación vigente y abre otra. Nadie puede autoasignarse.

### Cliente REST

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

### Terminal

```bash
curl -s -X POST "$BASE_URL/usuarios/$USUARIO_ID/asignaciones" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"rolCodigo\":\"COORDINADOR_PARROQUIAL\",\"parroquiaId\":\"$PARROQUIA_ID\",\"motivo\":\"Promoción\"}"
```
