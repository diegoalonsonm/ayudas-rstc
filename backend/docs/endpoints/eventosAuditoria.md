# Eventos de auditoría

Ver [cómo probar la API](README.md). Solo `ADMINISTRADOR` y `COORDINADOR_DIOCESANO`. Solo lectura.

No existe operación de borrado ni actualización.

## GET /eventos-auditoria

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/eventos-auditoria` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/eventos-auditoria" \
  -H "Authorization: Bearer $TOKEN"
```
