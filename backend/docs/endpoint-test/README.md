# Casos de prueba de endpoints

Casos derivados de [`../endpoints/`](../endpoints/). Ejecución feliz contra `http://localhost:3000/api/v1`.

## Formato de cada caso

| Campo | Significado |
| --- | --- |
| `id` | Identificador estable; coincide con el archivo en `results/` |
| `execution` | `run` o `skipped` (fuera del happy path) |
| `expectedStatus` | Familia o código HTTP esperado |
| `captures` | Campos de la respuesta a reutilizar |

## Resultados

Ver [`results/_summary.md`](results/_summary.md). Veredictos: `succeeded`, `failed partially`, `failed entirely`. Los casos `skipped` no se marcan como fallo.

Tokens JWT, `Authorization` y URLs firmadas se redactan en los resultados.

## Postman

- Colección: `ayudas-rstc` (`29171076-9bae6770-5087-4b67-83e7-9654aab192c9`)
- Environment: `ayudas-rstc-local` (`29171076-9c132a2b-94b5-443b-a53f-0ce0c9e5c329`)
- Workspace: My Workspace (`2e9c75b9-187f-4093-8105-bfb7a5025c1b`)

El MCP de Postman no ejecuta contra localhost. La corrida local usa `node run-endpoint-tests.mjs`.
