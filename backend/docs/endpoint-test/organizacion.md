# Casos: Organización eclesial

GET de listas existentes, luego POST/GET/PATCH/DELETE sobre un árbol aislado `TEST-*` de esta corrida.

Al crear diócesis/vicaría/parroquia no se envía `codigo`: lo asigna la BD (`D01`, `D01-V01`, `D01-V01-P001`).

## GET listas y por id

- `organizacion-get-diocesis` → `GET /diocesis`
- `organizacion-get-diocesis-id` → `GET /diocesis/{{id}}`
- `organizacion-get-vicarias` / `organizacion-get-vicarias-id`
- `organizacion-get-parroquias` / `organizacion-get-parroquias-id`

## POST / PATCH / DELETE

| id | method | path |
| --- | --- | --- |
| `organizacion-post-diocesis` | POST | `/diocesis` |
| `organizacion-patch-diocesis-id` | PATCH | `/diocesis/{{testDiocesisId}}` |
| `organizacion-post-vicarias` | POST | `/vicarias` |
| `organizacion-patch-vicarias-id` | PATCH | `/vicarias/{{testVicariaId}}` |
| `organizacion-post-parroquias` | POST | `/parroquias` |
| `organizacion-patch-parroquias-id` | PATCH | `/parroquias/{{testParroquiaId}}` |
| `organizacion-delete-parroquias-id` | DELETE | `/parroquias/{{testParroquiaId}}` |
| `organizacion-delete-vicarias-id` | DELETE | `/vicarias/{{testVicariaId}}` |
| `organizacion-delete-diocesis-id` | DELETE | `/diocesis/{{testDiocesisId}}` |

DELETE va al final de la corrida (después de solicitudes). Body: `{ "motivo": "Reorganización (prueba endpoint-test)" }`.
