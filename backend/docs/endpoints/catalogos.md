# Catálogos

Ver [cómo probar la API](README.md). Lectura: cualquier rol con asignación vigente. Escritura: solo `ADMINISTRADOR`.

`:catalogo` puede ser: `tipos-documento`, `sexos`, `grados-academicos`, `parentescos`, `rangos-ingreso`, `tipos-vivienda`, `tipos-tenencia`, `condiciones-vivienda`, `tipos-ayuda`, `roles`, `cantones`, `distritos`, `barrios`.

## GET /catalogos/:catalogo

Sustituya `tipos-ayuda` por el catálogo que necesite.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/catalogos/tipos-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/catalogos/tipos-ayuda" \
  -H "Authorization: Bearer $TOKEN"
```

## GET /catalogos/:catalogo/:id

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/catalogos/roles/{{rolId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/catalogos/roles/$ROL_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /catalogos/:catalogo

Rol: `ADMINISTRADOR`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/catalogos/cantones` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "codigo": "SJ",
  "nombre": "San José"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/catalogos/cantones" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"codigo":"SJ","nombre":"San José"}'
```

## PATCH /catalogos/:catalogo/:id

Rol: `ADMINISTRADOR`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `PATCH` |
| URL | `{{baseUrl}}/catalogos/cantones/{{cantonId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombre": "San José (actualizado)"
}
```

### Terminal

```bash
curl -s -X PATCH "$BASE_URL/catalogos/cantones/$CANTON_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"San José (actualizado)"}'
```

## DELETE /catalogos/:catalogo/:id

Borrado lógico. Rol: `ADMINISTRADOR`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `DELETE` |
| URL | `{{baseUrl}}/catalogos/cantones/{{cantonId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "motivo": "Fuera de cobertura"
}
```

### Terminal

```bash
curl -s -X DELETE "$BASE_URL/catalogos/cantones/$CANTON_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"motivo":"Fuera de cobertura"}'
```
