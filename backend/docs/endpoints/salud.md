# Salud

Ver [cómo probar la API](README.md).

## GET /salud

Pública. Comprueba que la API está viva.

Respuesta: `{ "estado": "ok" }`.

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/salud` |
| Auth | No auth |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/salud"
```
