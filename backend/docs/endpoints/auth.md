# Auth

Ver [cómo usar Postman](README.md) (`baseUrl`, `tokenAcceso`).

## POST /auth/sesiones

Pública. Intercambia correo y contraseña por tokens de Supabase Auth.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/auth/sesiones` |
| Auth | No auth |
| Body | raw JSON |

```json
{
  "correo": "admin@local.test",
  "contrasena": "Cambiar1234"
}
```

Respuesta: `tokenAcceso`, `tokenRenovacion`, `expiraEn`, `usuario`, `asignacion`. Guarde los tokens en las variables de la colección.

## POST /auth/sesiones/renovacion

Pública.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/auth/sesiones/renovacion` |
| Auth | No auth |
| Body | raw JSON |

```json
{
  "tokenRenovacion": "{{tokenRenovacion}}"
}
```

Respuesta: nuevos `tokenAcceso`, `tokenRenovacion`, `expiraEn`. Actualice las variables de la colección.

## DELETE /auth/sesiones

Cierra la sesión del JWT actual.

| Campo | Valor |
| --- | --- |
| Método | `DELETE` |
| URL | `{{baseUrl}}/auth/sesiones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## GET /auth/sesion

Devuelve el actor actual (rol y alcance).

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/auth/sesion` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |
