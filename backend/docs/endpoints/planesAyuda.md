# Planes, detalles y entregas

Ver [cómo usar Postman](README.md).

## GET /solicitudes-ayuda/:id/planes-ayuda

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/solicitudes-ayuda/{{solicitudId}}/planes-ayuda` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /solicitudes-ayuda/:id/planes-ayuda

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

## GET /planes-ayuda/:planId/detalles

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/planes-ayuda/{{planId}}/detalles` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /planes-ayuda/:planId/detalles

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

## GET /detalles-plan-ayuda/:detalleId/entregas

| Campo | Valor |
| --- | --- |
| Método | `GET` |
| URL | `{{baseUrl}}/detalles-plan-ayuda/{{detallePlanId}}/entregas` |
| Auth | Bearer Token `{{tokenAcceso}}` |
| Body | ninguno |

## POST /detalles-plan-ayuda/:detalleId/entregas

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
