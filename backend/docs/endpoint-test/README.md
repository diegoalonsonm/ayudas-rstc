# Endpoint tests

This folder contains sequential integration tests for every endpoint documented in
`backend/docs/endpoints`. The runner uses Node's built-in `fetch`, creates the data
needed by dependent cases, and records each redacted request and response under
`results/`.

## Run

```powershell
$env:BASE_URL = "http://localhost:3000/api/v1"
$env:AUTH_CORREO = "admin2@local.test"
$env:AUTH_CONTRASENA = "<password>"
node ./backend/docs/endpoint-test/run-endpoint-tests.mjs
```

The runner authenticates through `POST /auth/sesiones`, captures the returned
tokens in memory, and closes that session in the final case.

## Outcome meanings

- `SUCCEEDED`: the API returned an expected 2xx response and response validation passed.
- `FAILED_PARTIALLY`: the API answered, but its status or response content was unexpected.
- `FAILED_ENTIRELY`: no usable response was obtained, usually because of a network error
  or an unavailable dependency from an earlier case.

## Safety and test data

- Passwords, authorization headers, tokens, signed URLs, and uploaded binary content
  are redacted from result files.
- Test records include the run timestamp in names, codes, document numbers, and email.
- Created catalog and organization records are logically deleted; the created user is
  deactivated. Person, request, plan, delivery, and document records remain as
  traceable integration-test evidence because the documented API has no delete endpoint
  for them.
- The session-close test runs last because it may revoke the active token.
# Casos de prueba de endpoints

Casos derivados de [`../endpoints/`](../endpoints/). Ejecución contra `http://localhost:3000/api/v1`.

Orden: salud → login → sesión/renovación → catálogos → organización (árbol `TEST-*`) → usuarios → personas → solicitudes → planes → documentos → auditoría → eliminación/restauración de solicitud → DELETE del árbol TEST → cierre de sesión.

Mutaciones usan códigos/correos únicos por corrida. PATCH/DELETE de organización y catálogos actúan sobre filas creadas en la misma corrida, no sobre datos semilla.

## Formato de cada caso

| Campo | Significado |
| --- | --- |
| `id` | Identificador estable; coincide con el archivo en `results/` |
| `execution` | `run` |
| `expectedStatus` | Familia o código HTTP esperado |
| `captures` | Campos de la respuesta a reutilizar |

## Resultados

Ver [`results/_summary.md`](results/_summary.md). Veredictos: `succeeded`, `failed partially`, `failed entirely`.

- **succeeded**: HTTP esperado y aserciones de cuerpo OK
- **failed partially**: HTTP esperado, alguna aserción de cuerpo falló
- **failed entirely**: HTTP fuera de lo esperado, error de red, o el request autenticado salió sin `tokenAcceso`

Tokens JWT, `Authorization` y URLs firmadas se redactan en los resultados.

## Cómo correr

```bash
node backend/docs/endpoint-test/run-endpoint-tests.mjs
```

Variables opcionales: `BASE_URL`, `AUTH_CORREO`, `AUTH_CONTRASENA`.
