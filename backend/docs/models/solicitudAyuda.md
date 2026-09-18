# SolicitudAyuda

Tabla: `solicitudes_ayuda`. Fotografía de la entrevista. `numeroSolicitud` lo asigna la BD (`RSTC-YYYY-000001`).

Estados: `BORRADOR`, `PRESENTADA`, `EN_REVISION`, `APROBADA`, `ACTIVA`, `RECHAZADA`, `FINALIZADA`, `CANCELADA`.

Vigentes para no superponer tipos de ayuda: `PRESENTADA`, `EN_REVISION`, `APROBADA`, `ACTIVA`.

# IntegranteConvivencia

Pertenece a la solicitud. `personaId` opcional.

# EvaluacionVivienda

Una evaluación por solicitud. FKs a tipos/tenencia/condición.

# AyudaSolicitada

Única por solicitud + tipo mientras no esté eliminada.

# HistorialEstadosSolicitud

Inmutable, solo inserción (trigger de BD).
