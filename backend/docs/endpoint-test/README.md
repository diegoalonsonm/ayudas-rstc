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
