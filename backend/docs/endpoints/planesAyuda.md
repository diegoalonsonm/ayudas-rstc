# Planes, detalles y entregas

Ver [cómo probar la API](README.md).

## GET /solicitudes-ayuda/:id/planes-ayuda

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/planes-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/planes-ayuda" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /solicitudes-ayuda/:id/planes-ayuda

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/planes-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "decision": "APROBADA",
  "fechaInicio": "2026-09-01",
  "fechaFin": "2026-12-01",
  "motivoDecision": "Comité parroquial"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/solicitudes-ayuda/$SOLICITUD_ID/planes-ayuda" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"decision":"APROBADA","fechaInicio":"2026-09-01","fechaFin":"2026-12-01","motivoDecision":"Comité parroquial"}'
```

## GET /planes-ayuda/:planId/detalles

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/planes-ayuda/{{planId}}/detalles` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/planes-ayuda/$PLAN_ID/detalles" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /planes-ayuda/:planId/detalles

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/planes-ayuda/{{planId}}/detalles` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "tipoAyudaId": "{{tipoAyudaId}}",
  "frecuencia": "MENSUAL",
  "montoEstimado": 25000
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/planes-ayuda/$PLAN_ID/detalles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tipoAyudaId\":\"$TIPO_AYUDA_ID\",\"frecuencia\":\"MENSUAL\",\"montoEstimado\":25000}"
```

## GET /detalles-plan-ayuda/:detalleId/entregas

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/detalles-plan-ayuda/{{detallePlanId}}/entregas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

### Terminal

```bash
curl -s "$BASE_URL/detalles-plan-ayuda/$DETALLE_PLAN_ID/entregas" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /detalles-plan-ayuda/:detalleId/entregas

### Cliente REST

| Campo | Valor |
| --- | --- |
| Método | `POST` |
| URL | `{{baseUrl}}/detalles-plan-ayuda/{{detallePlanId}}/entregas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | raw JSON |

```json
{
  "fechaEntrega": "2026-09-15",
  "monto": 25000,
  "descripcion": "Paquete de alimentos"
}
```

### Terminal

```bash
curl -s -X POST "$BASE_URL/detalles-plan-ayuda/$DETALLE_PLAN_ID/entregas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fechaEntrega":"2026-09-15","monto":25000,"descripcion":"Paquete de alimentos"}'
```
