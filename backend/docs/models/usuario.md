# Usuario

Tabla: `ayudas_rstc.usuarios`

| Campo API | Columna | Notas |
| --- | --- | --- |
| id | id | UUID |
| identidadAutenticacionId | identidad_autenticacion_id | `auth.users.id` |
| nombreCompleto | nombre_completo | |
| correo | correo | minúsculas |
| activo | activo | |
| ultimoAccesoEn | ultimo_acceso_en | |
| creadoEn / actualizadoEn / eliminadoEn | campos comunes | Borrado lógico |

# AsignacionUsuario

Tabla: `asignaciones_usuario`. Exactamente el alcance que exige el rol. `rolCodigo` se hidrata desde `roles`.

# Rol

Catálogo `roles`: `PERSONAL_PASTORAL`, `COORDINADOR_PARROQUIAL`, `COORDINADOR_VICARIAL`, `COORDINADOR_DIOCESANO`, `ADMINISTRADOR`.
