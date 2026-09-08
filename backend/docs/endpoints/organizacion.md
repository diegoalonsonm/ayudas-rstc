# Organización eclesial

Ver [cómo probar la API](README.md). Lectura autenticada. Escritura solo `ADMINISTRADOR`.

## GET /diocesis

También existe `GET /diocesis/:id`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/diocesis` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/diocesis" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /diocesis

Rol: `ADMINISTRADOR`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/diocesis` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombre": "Diócesis de Cartago"
}
```

`codigo` es opcional. Si se omite, la BD asigna `D01`, `D02`, … Si más adelante hay un código institucional, se puede enviar en el cuerpo.

### Terminal

```bash
curl -s -X POST "$BASE_URL/diocesis" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Diócesis de Cartago"}'
```

## PATCH /diocesis/:id

Rol: `ADMINISTRADOR`.

### Cliente REST

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

### Terminal

```bash
curl -s -X PATCH "$BASE_URL/diocesis/$DIOCESIS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Diócesis de Cartago (actualizado)"}'
```

## DELETE /diocesis/:id

Borrado lógico. Rol: `ADMINISTRADOR`.

### Cliente REST

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

### Terminal

```bash
curl -s -X DELETE "$BASE_URL/diocesis/$DIOCESIS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"motivo":"Reorganización"}'
```

## Vicarías

Mismos verbos sobre `/vicarias`. Al crear hace falta `diocesisId`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/vicarias` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "nombre": "Vicaría Norte",
  "diocesisId": "{{diocesisId}}"
}
```

`codigo` es opcional. Si se omite, la BD asigna `{codigo_diócesis}-V01`.

### Terminal

```bash
curl -s -X POST "$BASE_URL/vicarias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Vicaría Norte\",\"diocesisId\":\"$DIOCESIS_ID\"}"
```

## Parroquias

Mismos verbos sobre `/parroquias`. Al crear hace falta `vicariaId`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/parroquias` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

`POST {{baseUrl}}/parroquias`:

```json
{
  "nombre": "Parroquia Centro",
  "vicariaId": "{{vicariaId}}"
}
```

`codigo` es opcional. Si se omite, la BD asigna `{codigo_vicaría}-P001`.

### Terminal

```bash
curl -s "$BASE_URL/parroquias" \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST "$BASE_URL/parroquias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Parroquia Centro\",\"vicariaId\":\"$VICARIA_ID\"}"
```
