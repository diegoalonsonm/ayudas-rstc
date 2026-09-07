# Cómo probar la API (Postman, Insomnia, Bruno, Thunder Client)

Base local: `http://localhost:3000/api/v1`

## Variables de colección

Cree una colección (por ejemplo `ayudas-rstc`) con estas variables:

| Variable | Valor inicial |
| --- | --- |
| `baseUrl` | `http://localhost:3000/api/v1` |
| `tokenAcceso` | vacío; se llena tras iniciar sesión |
| `tokenRenovacion` | vacío; se llena tras iniciar sesión |

En cada request autenticada:

1. Pestaña **Authorization**
2. Type: **Bearer Token**
3. Token: `{{tokenAcceso}}`

No hace falta repetir el header `Authorization` a mano.

## Tras iniciar sesión

En `POST /auth/sesiones`, copie `tokenAcceso` y `tokenRenovacion` de la respuesta a las variables de la colección. En Postman puede usar un script en **Tests**:

```javascript
const cuerpo = pm.response.json();
if (cuerpo.tokenAcceso) {
  pm.collectionVariables.set("tokenAcceso", cuerpo.tokenAcceso);
}
if (cuerpo.tokenRenovacion) {
  pm.collectionVariables.set("tokenRenovacion", cuerpo.tokenRenovacion);
}
```

## Body JSON

Salvo la carga de documentos (form-data), el body es **raw → JSON** con header `Content-Type: application/json` (Postman lo pone solo si elige raw JSON).

## Rutas públicas

No llevan Bearer: `GET /salud`, `POST /auth/sesiones`, `POST /auth/sesiones/renovacion`.
