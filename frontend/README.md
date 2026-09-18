# Frontend de Ayudas RSTC

Interfaz web del sistema de ayudas de la Pastoral Social de la Diócesis de Cartago. Construida con
Next.js (App Router), TypeScript y Tailwind, muestra las vistas y los datos según el rol y el
alcance territorial de quien ingresa.

## Puesta en marcha

```bash
cp .env.example .env
npm install
npm run dev
```

La aplicación queda en `http://localhost:3100` y espera el backend de NestJS en
`http://localhost:3000/api/v1`.

| Variable | Descripción |
| --- | --- |
| `URL_API_BACKEND` | Base de la API de NestJS. Es una variable de servidor, sin prefijo `NEXT_PUBLIC_`, para que el backend no quede expuesto al navegador. |
| `PUERTO` | Puerto de la interfaz. Los scripts ya fijan 3100. |

## Por qué existe un BFF

El backend no tiene CORS habilitado, así que el navegador no puede llamarlo directamente. Todo el
tráfico pasa por Next.js:

- Los componentes de servidor leen datos con `src/lib/api/clienteServidor.ts`, que adjunta el
  `Authorization: Bearer` y renueva el token cuando está por vencer o cuando la API responde 401.
- Las mutaciones son Server Actions en `src/lib/acciones/`, que además revalidan las rutas
  afectadas.
- Las pocas llamadas que nacen en el navegador van por el proxy `src/app/api/proxy/[...ruta]`.

Como efecto secundario deseable, el token de acceso y el de renovación viven en cookies `httpOnly`
y nunca llegan al JavaScript del cliente.

## Cómo se aplican los permisos

`src/lib/autorizacion/permisos.ts` contiene la matriz de rol por acción de `MODELO_DATOS.md` y
`src/lib/autorizacion/alcance.ts` reproduce las reglas de `ServicioAlcance`. La comprobación ocurre
en tres capas:

1. **Navegación.** `navegacion.ts` decide qué entradas de la barra lateral existen para cada rol.
2. **Interfaz.** `<Puede>` oculta lo que el rol no debe ver y `<AccionProtegida>` deshabilita el
   botón mostrando en un tooltip el motivo concreto, en lugar de esconderlo sin explicación.
3. **Server Action.** Cada acción vuelve a validar el permiso antes de llamar al backend, así que
   la comprobación no depende del cliente.

Para los cambios de estado, la interfaz cruza la máquina de estados del dominio
(`estadosSolicitud.ts`) con la matriz de rol: una transición aparece solo si el estado la admite, y
queda habilitada solo si el rol puede ejecutarla.

El backend todavía no verifica el rol en varias de esas operaciones.
[`docs/pendientes-backend.md`](docs/pendientes-backend.md) detalla qué falta reforzar del lado del
servidor y cómo afecta cada limitación a la interfaz.

## Estructura

```
src/app/(publico)/ingreso        Formulario de acceso
src/app/(privado)                Shell autenticado con barra lateral por rol
src/app/api/sesion               Inicio y cierre de sesión con cookies httpOnly
src/app/api/proxy/[...ruta]      Reenvío al backend para llamadas del navegador
src/lib/dominio                  Espejo de tipos, enums, estados y etiquetas del backend
src/lib/api                      Cliente del BFF, esquemas zod y funciones por recurso
src/lib/acciones                 Server Actions con validación de permisos
src/lib/autorizacion             Matriz de permisos, alcance territorial y navegación
src/components                   Primitivas de interfaz y componentes por área
```

## Verificación

```bash
npm run typecheck
npm run lint
npm run build
```
