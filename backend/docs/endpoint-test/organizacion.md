# Casos: Organización eclesial

POST de diócesis/vicaría/parroquia solo si las listas GET están vacías (árbol aislado `TEST-*`). PATCH/DELETE siempre skipped.

## organizacion-get-diocesis

| Campo | Valor |
| --- | --- |
| id | `organizacion-get-diocesis` |
| execution | `run` |
| method | `GET` |
| path | `/diocesis` |
| auth | Bearer |
| expectedStatus | `200` |
| captures | `diocesisId` si hay filas |
| wave | 2 |

## organizacion-get-diocesis-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-get-diocesis-id` |
| execution | `run` |
| method | `GET` |
| path | `/diocesis/{{diocesisId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `diocesisId` |
| wave | 2 |

## organizacion-post-diocesis

| Campo | Valor |
| --- | --- |
| id | `organizacion-post-diocesis` |
| execution | `run` (condicional) |
| condition | ejecutar solo si `GET /diocesis` no devolvió filas |
| method | `POST` |
| path | `/diocesis` |
| expectedStatus | `201` o `200` |
| captures | `diocesisId` |
| wave | 2 |

```json
{
  "nombre": "Diócesis TEST Endpoint",
  "codigo": "TEST-DIO"
}
```

## organizacion-patch-diocesis-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-patch-diocesis-id` |
| execution | `skipped` |
| reason | No PATCH de organización existente |
| method | `PATCH` |
| path | `/diocesis/{{diocesisId}}` |

## organizacion-delete-diocesis-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-delete-diocesis-id` |
| execution | `skipped` |
| reason | No DELETE de organización existente |
| method | `DELETE` |
| path | `/diocesis/{{diocesisId}}` |

## organizacion-get-vicarias

| Campo | Valor |
| --- | --- |
| id | `organizacion-get-vicarias` |
| execution | `run` |
| method | `GET` |
| path | `/vicarias` |
| auth | Bearer |
| expectedStatus | `200` |
| captures | `vicariaId` si hay filas |
| wave | 2 |

## organizacion-get-vicarias-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-get-vicarias-id` |
| execution | `run` |
| method | `GET` |
| path | `/vicarias/{{vicariaId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `vicariaId` |
| wave | 2 |

## organizacion-post-vicarias

| Campo | Valor |
| --- | --- |
| id | `organizacion-post-vicarias` |
| execution | `run` (condicional) |
| condition | ejecutar solo si no hay vicaría y sí hay `diocesisId` |
| method | `POST` |
| path | `/vicarias` |
| expectedStatus | `201` o `200` |
| captures | `vicariaId` |
| wave | 2 |

```json
{
  "nombre": "Vicaría TEST Endpoint",
  "codigo": "TEST-VIC",
  "diocesisId": "{{diocesisId}}"
}
```

## organizacion-patch-vicarias-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-patch-vicarias-id` |
| execution | `skipped` |
| reason | No PATCH de organización existente |
| method | `PATCH` |
| path | `/vicarias/{{vicariaId}}` |

## organizacion-delete-vicarias-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-delete-vicarias-id` |
| execution | `skipped` |
| reason | No DELETE de organización existente |
| method | `DELETE` |
| path | `/vicarias/{{vicariaId}}` |

## organizacion-get-parroquias

| Campo | Valor |
| --- | --- |
| id | `organizacion-get-parroquias` |
| execution | `run` |
| method | `GET` |
| path | `/parroquias` |
| auth | Bearer |
| expectedStatus | `200` |
| captures | `parroquiaId` si hay filas |
| wave | 2 |

## organizacion-get-parroquias-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-get-parroquias-id` |
| execution | `run` |
| method | `GET` |
| path | `/parroquias/{{parroquiaId}}` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `parroquiaId` |
| wave | 2 |

## organizacion-post-parroquias

| Campo | Valor |
| --- | --- |
| id | `organizacion-post-parroquias` |
| execution | `run` (condicional) |
| condition | ejecutar solo si no hay parroquia y sí hay `vicariaId` |
| method | `POST` |
| path | `/parroquias` |
| expectedStatus | `201` o `200` |
| captures | `parroquiaId` |
| wave | 2 |

```json
{
  "nombre": "Parroquia TEST Endpoint",
  "codigo": "TEST-PAR",
  "vicariaId": "{{vicariaId}}"
}
```

## organizacion-patch-parroquias-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-patch-parroquias-id` |
| execution | `skipped` |
| reason | No PATCH de organización existente |
| method | `PATCH` |
| path | `/parroquias/{{parroquiaId}}` |

## organizacion-delete-parroquias-id

| Campo | Valor |
| --- | --- |
| id | `organizacion-delete-parroquias-id` |
| execution | `skipped` |
| reason | No DELETE de organización existente |
| method | `DELETE` |
| path | `/parroquias/{{parroquiaId}}` |
