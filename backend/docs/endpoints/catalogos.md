# Catálogos

Ver [cómo usar Postman](README.md). Lectura: cualquier rol con asignación vigente. Escritura: solo `ADMINISTRADOR`.

`:catalogo` puede ser: `tipos-documento`, `sexos`, `grados-academicos`, `parentescos`, `rangos-ingreso`, `tipos-vivienda`, `tipos-tenencia`, `condiciones-vivienda`, `tipos-ayuda`, `roles`, `cantones`, `distritos`, `barrios`.

## GET /catalogos/:catalogo

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/catalogos/tipos-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

Sustituya `tipos-ayuda` por el catálogo que necesite.

## GET /catalogos/:catalogo/:id

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/catalogos/roles/{{rolId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /catalogos/:catalogo

Rol: `ADMINISTRADOR`.

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

## PATCH /catalogos/:catalogo/:id

Rol: `ADMINISTRADOR`.

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

## DELETE /catalogos/:catalogo/:id

Borrado lógico. Rol: `ADMINISTRADOR`.

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
