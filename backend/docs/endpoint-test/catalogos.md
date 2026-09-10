# Casos: Catálogos

`:catalogo` documentado: `tipos-documento`, `sexos`, `grados-academicos`, `parentescos`, `rangos-ingreso`, `tipos-vivienda`, `tipos-tenencia`, `condiciones-vivienda`, `tipos-ayuda`, `roles`, `cantones`, `distritos`, `barrios`.

Cada `GET /catalogos/:catalogo` se ejecuta (`catalogos-get-<slug>`). Escritura usa un cantón `T*` creado en la corrida.

## catalogos-get-tipos-documento

| Campo | Valor |
| --- | --- |
| id | `catalogos-get-tipos-documento` |
| execution | `run` |
| method | `GET` |
| path | `/catalogos/tipos-documento` |
| expectedStatus | `200` |
| captures | `tipoDocumentoId` |

## catalogos-get-sexos … catalogos-get-barrios

Mismo patrón GET para el resto de slugs. Capturas extra: `tipoAyudaId` en `tipos-ayuda`, `rolId` en `roles`.

## catalogos-get-roles-id

| Campo | Valor |
| --- | --- |
| id | `catalogos-get-roles-id` |
| execution | `run` |
| method | `GET` |
| path | `/catalogos/roles/{{rolId}}` |
| expectedStatus | `200` |

## catalogos-post-cantones

| Campo | Valor |
| --- | --- |
| id | `catalogos-post-cantones` |
| execution | `run` |
| method | `POST` |
| path | `/catalogos/cantones` |
| expectedStatus | `200` o `201` |
| captures | `cantonId` |

```json
{
  "codigo": "Txxxxx",
  "nombre": "Canton TEST <stamp>"
}
```

## catalogos-patch-cantones-id

| Campo | Valor |
| --- | --- |
| id | `catalogos-patch-cantones-id` |
| execution | `run` |
| method | `PATCH` |
| path | `/catalogos/cantones/{{cantonId}}` |
| expectedStatus | `200` |

## catalogos-delete-cantones-id

| Campo | Valor |
| --- | --- |
| id | `catalogos-delete-cantones-id` |
| execution | `run` |
| method | `DELETE` |
| path | `/catalogos/cantones/{{cantonId}}` |
| expectedStatus | `200` o `204` |
| body | `{ "motivo": "Fila de prueba endpoint-test" }` |
