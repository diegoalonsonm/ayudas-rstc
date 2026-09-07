# Organización eclesial

Ver [cómo usar Postman](README.md). Lectura autenticada. Escritura solo `ADMINISTRADOR`.

## GET /diocesis

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/diocesis` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

También: `GET {{baseUrl}}/diocesis/{{diocesisId}}`.

## POST /diocesis

Rol: `ADMINISTRADOR`.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/diocesis` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombre": "Diócesis de Cartago",
  "codigo": "CARTAGO"
}
```

## PATCH /diocesis/:id

Rol: `ADMINISTRADOR`.

| Campo | Valor |
| --- | --- |
| Método | `PATCH` |
| URL | `{{baseUrl}}/diocesis/{{diocesisId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombre": "Diócesis de Cartago (actualizado)"
}
```

## DELETE /diocesis/:id

Borrado lógico. Rol: `ADMINISTRADOR`.

| Campo | Valor |
| --- | --- |
| Método | `DELETE` |
| URL | `{{baseUrl}}/diocesis/{{diocesisId}}` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "motivo": "Reorganización"
}
```

## Vicarías

Mismos verbos sobre `{{baseUrl}}/vicarias`. Al crear hace falta `diocesisId`.

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/vicarias` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombre": "Vicaría Norte",
  "codigo": "VN",
  "diocesisId": "{{diocesisId}}"
}
```

## Parroquias

Mismos verbos sobre `{{baseUrl}}/parroquias`. Al crear hace falta `vicariaId`.

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/parroquias` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

```json
{
  "nombre": "Parroquia Centro",
  "codigo": "PC",
  "vicariaId": "{{vicariaId}}"
}
```

El JSON anterior es el body de `POST {{baseUrl}}/parroquias`.
