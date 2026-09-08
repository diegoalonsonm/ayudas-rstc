# Auth

Ver [cómo probar la API](README.md) (cliente REST y terminal).

## POST /auth/sesiones

Pública. Intercambia correo y contraseña por tokens de Supabase Auth.

Respuesta: `tokenAcceso`, `tokenRenovacion`, `expiraEn`, `usuario`, `asignacion`.

### Cliente REST

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

Guarde los tokens en las variables de la colección.

### Terminal

```bash
curl -s -X POST "$BASE_URL/auth/sesiones" \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@local.test","contrasena":"Cambiar1234"}'
```

## POST /auth/sesiones/renovacion

Pública. Respuesta: nuevos `tokenAcceso`, `tokenRenovacion`, `expiraEn`.

### Cliente REST

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

### Terminal

```bash
curl -s -X POST "$BASE_URL/auth/sesiones/renovacion" \
  -H "Content-Type: application/json" \
  -d "{\"tokenRenovacion\":\"$TOKEN_RENOVACION\"}"
```

Defina `TOKEN_RENOVACION` con el `tokenRenovacion` del login.

## DELETE /auth/sesiones

Cierra la sesión del JWT actual.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `DELETE` |
| URL | `{{baseUrl}}/auth/sesiones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s -X DELETE "$BASE_URL/auth/sesiones" \
  -H "Authorization: Bearer $TOKEN"
```

## GET /auth/sesion

Devuelve el actor actual (rol y alcance).

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/auth/sesion` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/auth/sesion" \
  -H "Authorization: Bearer $TOKEN"
```
