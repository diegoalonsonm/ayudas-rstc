# Pendientes del backend detectados al construir el frontend

Este documento recoge las limitaciones del backend que aparecieron al implementar las vistas por
rol. **En este branch no se modificó el backend**: el frontend aplica la matriz completa de
`MODELO_DATOS.md` en su propia capa y aquí queda el registro de lo que falta reforzar del lado del
servidor.

La distinción importante es entre **alcance territorial**, que sí está bien resuelto (servicio de
alcance en la capa de aplicación más políticas de seguridad a nivel de fila en Postgres), y
**autorización por rol**, que solo existe en tres endpoints. Un usuario con rol `PERSONAL_PASTORAL`
no puede tocar expedientes de otra parroquia, pero sí podría aprobar los de la suya si llama a la
API directamente.

---

## 1. Guards de rol ausentes en operaciones sensibles

Solo tres lugares del backend usan el decorador `@RequerirRoles`:

| Endpoint | Roles exigidos |
| --- | --- |
| Escrituras en `/catalogos/*` | `ADMINISTRADOR` |
| Escrituras en `/diocesis`, `/vicarias`, `/parroquias` | `ADMINISTRADOR` |
| `GET /eventos-auditoria` | `ADMINISTRADOR`, `COORDINADOR_DIOCESANO` |

El resto de las operaciones valida únicamente que la solicitud esté dentro del alcance territorial
del actor, sin mirar su rol. Estas son las que el frontend restringe pero el backend no:

| Operación | Endpoint | Restricción que aplica el frontend | Qué valida hoy el backend |
| --- | --- | --- | --- |
| Cambiar estado de solicitud | `POST /solicitudes-ayuda/:id/estado` | `EN_REVISION`, `APROBADA`, `RECHAZADA`, `FINALIZADA`, `CANCELADA` y el retorno a `BORRADOR` exigen coordinador parroquial o superior | Solo la máquina de estados y el alcance territorial |
| Registrar decisión de plan | `POST /solicitudes-ayuda/:id/planes-ayuda` | Coordinador parroquial o superior, y solo con la solicitud en `EN_REVISION` | Solo el alcance territorial; no revisa el estado de la solicitud |
| Definir detalle del plan | `POST /planes-ayuda/:planId/detalles` | Coordinador parroquial o superior | Solo el alcance territorial |
| Eliminar solicitud | `POST /solicitudes-ayuda/:id/eliminacion` | Coordinador parroquial o superior | Solo el alcance territorial |
| Restaurar solicitud | `POST /solicitudes-ayuda/:id/restauracion` | Coordinador diocesano o administrador | Solo el alcance territorial |
| Quitar tipo de ayuda | `DELETE /solicitudes-ayuda/:id/ayudas-solicitadas/:ayudaId` | Coordinador parroquial o superior | Solo el alcance territorial |
| Editar usuario | `PATCH /usuarios/:id` | Administrador, o el propio usuario sobre su registro | Sin verificación de rol |
| Cambiar asignación | `POST /usuarios/:id/asignaciones` | Administrador, y nunca sobre sí mismo | Valida la forma del alcance y que no sea cambio propio, pero no exige rol administrador |

Recomendación: añadir `@RequerirRoles` a esos controladores, y mover al dominio la regla de que la
decisión del plan exige estado `EN_REVISION`, junto a `ServicioEstadosSolicitud`.

## 2. La política de fila de `usuarios` impide el listado a tres roles

`sel_usuarios` permite leer la tabla al propio usuario, al administrador y a quien pueda ver
auditoría, es decir al coordinador diocesano. En consecuencia `GET /usuarios` devuelve **solo el
registro propio** para `PERSONAL_PASTORAL`, `COORDINADOR_PARROQUIAL` y `COORDINADOR_VICARIAL`,
aunque el modelo de datos les permite crear cuentas subordinadas.

Efecto en la interfaz: `/usuarios` muestra el formulario de alta y un listado con un solo registro,
acompañado de un aviso que explica el motivo. No hay forma de que un coordinador vicarial vea a los
coordinadores parroquiales que él mismo creó.

Recomendación: ampliar `sel_usuarios` para que cada actor pueda leer los usuarios cuya asignación
vigente caiga dentro de su alcance territorial, reutilizando `parroquias_accesibles()`.

## 3. El documento y el teléfono son de solo escritura

`numeroDocumento` y `telefono` se cifran con AES-256-GCM al escribirse, pero ninguna consulta los
descifra: `gestionarPersonas.ts` y `gestionarExpediente.ts` devuelven el valor cifrado en base64.
El frontend nunca puede mostrar una cédula ni un número de teléfono.

Efecto en la interfaz: las fichas y los listados muestran "Documento registrado" o "Sin documento",
y lo mismo con el teléfono. Para ubicar a una persona por documento hay que usar
`POST /personas/busquedas`, que compara contra el hash.

Recomendación: definir qué roles pueden ver el dato en claro y agregar un endpoint explícito que lo
descifre, registrando un evento de auditoría por cada consulta. Mientras eso no exista, la
interfaz no debería prometer el dato.

## 4. Ningún listado tiene paginación ni filtros del lado del servidor

`GET /solicitudes-ayuda`, `GET /personas`, `GET /usuarios` y `GET /catalogos/:catalogo` devuelven el
conjunto completo del alcance del actor, sin parámetros de página, orden ni filtro.
`GET /eventos-auditoria` está limitado a 200 registros fijos.

Efecto en la interfaz: los filtros, el orden y la paginación de todas las tablas se calculan en el
cliente sobre la respuesta completa. Funciona con el volumen actual, pero no escala: un coordinador
diocesano con miles de expedientes descargaría todo en cada carga, y en auditoría es imposible
investigar más allá de los últimos 200 eventos.

Recomendación: añadir `pagina`, `tamano` y filtros por estado, parroquia y rango de fechas a esos
endpoints, devolviendo el total en la respuesta.

## 5. No hay CORS configurado

`backend/src/main.ts` no llama a `app.enableCors()`, así que ningún navegador puede consumir la API
directamente desde otro origen.

Efecto en la interfaz: todo el tráfico pasa por un BFF dentro de Next.js. Los componentes de
servidor y las Server Actions llaman al backend con `URL_API_BACKEND`, una variable sin prefijo
`NEXT_PUBLIC_`, y las pocas llamadas que nacen en el navegador van por `/api/proxy/[...ruta]`. Es
una decisión deliberada y positiva, porque además mantiene los tokens en cookies `httpOnly` fuera
del alcance del JavaScript del cliente.

Recomendación: si en el futuro se quiere una aplicación móvil o un cliente de navegador directo,
habilitar CORS con una lista blanca de orígenes. Para esta interfaz web no es necesario.

## 6. Detalles menores

- **`POST /solicitudes-ayuda` exige al menos un tipo de ayuda.** `RegistrarSolicitudDto` valida
  `tiposAyuda` con `ArrayMinSize(1)`, así que no se puede crear una solicitud en blanco y
  completarla después. El asistente recopila los cinco pasos y crea la solicitud al final, con los
  subrecursos inmediatamente después; el expediente queda editable desde ahí.
- **`forbidNonWhitelisted: true`.** Cualquier campo extra en el cuerpo produce un 400. Los payloads
  se construyen campo por campo en `src/lib/api/esquemas.ts` en lugar de reenviar el formulario
  completo.
- **La URL firmada de los consentimientos vive 60 segundos.** Se pide en el momento del clic y se
  abre de inmediato, sin guardarla en el estado ni en la caché.
- **No hay endpoint para listar direcciones eliminadas ni para restaurar integrantes.** El borrado
  lógico existe en la base, pero solo las solicitudes tienen endpoint de restauración.
