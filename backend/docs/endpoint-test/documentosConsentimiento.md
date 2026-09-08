# Casos: Documentos de consentimiento

## documentos-get

| Campo | Valor |
| --- | --- |
| id | `documentos-get` |
| execution | `run` |
| method | `GET` |
| path | `/solicitudes-ayuda/{{solicitudId}}/documentos-consentimiento` |
| auth | Bearer |
| expectedStatus | `200` |
| dependsOn | `solicitudId` |
| wave | 6 |

## documentos-post

| Campo | Valor |
| --- | --- |
| id | `documentos-post` |
| execution | `run` |
| method | `POST` |
| path | `/solicitudes-ayuda/{{solicitudId}}/documentos-consentimiento?fechaFirma=2026-09-07` |
| auth | Bearer |
| body | form-data `archivo` = `fixtures/consentimiento-prueba.pdf` |
| expectedStatus | `201` o `200` |
| captures | `documentoId` |
| wave | 6 |

## documentos-get-url

| Campo | Valor |
| --- | --- |
| id | `documentos-get-url` |
| execution | `run` |
| method | `GET` |
| path | `/documentos-consentimiento/{{documentoId}}/url` |
| auth | Bearer |
| expectedStatus | `200` |
| assertions | `urlFirmada` y `expiraEnSegundos` (URL redactada en results) |
| dependsOn | `documentos-post` |
| wave | 6 |
