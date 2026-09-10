# Cómo probar la API

Base local: `http://localhost:3000/api/v1`

Cada endpoint documenta las dos formas de invocarlo:

1. **Cliente REST** (Postman, Bruno, Thunder Client, Insomnia): URL, Authorization y body listos para pegar.
2. **Terminal** (`curl`): el mismo request desde la consola.

## Cliente REST (Postman, Bruno, Thunder Client)

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

Tras `POST /auth/sesiones`, copie `tokenAcceso` y `tokenRenovacion` a las variables. En Postman puede usar este script en **Tests**:

```javascript
const cuerpo = pm.response.json();
if (cuerpo.tokenAcceso) {
  pm.collectionVariables.set("tokenAcceso", cuerpo.tokenAcceso);
}
if (cuerpo.tokenRenovacion) {
  pm.collectionVariables.set("tokenRenovacion", cuerpo.tokenRenovacion);
}
```

En Bruno / Thunder Client el equivalente es guardar esas claves de la respuesta en variables de colección o entorno.

Salvo la carga de documentos (form-data), el body es **raw → JSON**. El cliente suele poner `Content-Type: application/json` al elegir JSON.

## Terminal (`curl`)

En bash, zsh o PowerShell (con `$env:TOKEN` en lugar de `$TOKEN`):

```bash
export BASE_URL=http://localhost:3000/api/v1
```

Inicie sesión y conserve el token:

```bash
curl -s -X POST "$BASE_URL/auth/sesiones" \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@local.test","contrasena":"Cambiar1234"}'
```

Copie `tokenAcceso` de la respuesta:

```bash
export TOKEN="<pegue aquí tokenAcceso>"
```

Los ejemplos autenticados usan `-H "Authorization: Bearer $TOKEN"`.

En PowerShell:

```powershell
$BASE_URL = "http://localhost:3000/api/v1"
$TOKEN = "<pegue aquí tokenAcceso>"

curl.exe -s "$BASE_URL/salud"
curl.exe -s "$BASE_URL/auth/sesion" -H "Authorization: Bearer $TOKEN"
```

Use `curl.exe` para no invocar el alias `Invoke-WebRequest` de PowerShell.

## Rutas públicas

No llevan Bearer: `GET /salud`, `POST /auth/sesiones`, `POST /auth/sesiones/renovacion`.
