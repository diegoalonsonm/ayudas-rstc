# Casos: Planes de ayuda

## planes-get

| Campo | Valor |
| --- | --- |
| id | `planes-get` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda/{{solicitudId}}/planes-ayuda` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `solicitudId` |
| wave | 5 |

## planes-post

| Campo | Valor |
| --- | --- |
| id | `planes-post` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/planes-ayuda` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `planId` |
| wave | 5 |

```json
{
  "decision": "APROBADA",
  "fechaInicio": "2026-09-01",
  "fechaFin": "2026-12-01",
  "motivoDecision": "Comité parroquial"
}
```

## planes-get-detalles

| Campo | Valor |
| --- | --- |
| id | `planes-get-detalles` |
| execution | `run` |
| method | `GET` |
| path | `/planes-ayuda/{{planId}}/detalles` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `planId` |
| wave | 5 |

## planes-post-detalles

| Campo | Valor |
| --- | --- |
| id | `planes-post-detalles` |
| execution | `run` |
| method | `POST` |
| path | `/planes-ayuda/{{planId}}/detalles` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `detallePlanId` |
| dependsOn | `planId`, `tipoAyudaId` |
| wave | 5 |

```json
{
  "tipoAyudaId": "{{tipoAyudaId}}",
  "frecuencia": "MENSUAL",
  "montoEstimado": 25000
}
```

## planes-get-entregas

| Campo | Valor |
| --- | --- |
| id | `planes-get-entregas` |
| execution | `run` |
| method | `GET` |
| path | `/detalles-plan-ayuda/{{detallePlanId}}/entregas` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `detallePlanId` |
| wave | 5 |

## planes-post-entregas

| Campo | Valor |
| --- | --- |
| id | `planes-post-entregas` |
| execution | `run` |
| method | `POST` |
| path | `/detalles-plan-ayuda/{{detallePlanId}}/entregas` |
| auth | Bearer |
| expectedStatus | `201` o `200` |
| captures | `entregaId` |
| wave | 5 |

```json
{
  "fechaEntrega": "2026-09-15",
  "monto": 25000,
  "descripcion": "Paquete de alimentos"
}
```
