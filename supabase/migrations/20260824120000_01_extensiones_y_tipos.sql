-- =============================================================================
-- 01. Extensiones y tipos enumerados
-- Aplica en desarrollo (supabase db reset) y en producción (supabase db push).
-- No editar una vez aplicada. Los cambios posteriores van en una migración nueva.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS ayudas_rstc;

COMMENT ON SCHEMA ayudas_rstc IS
  'Esquema de aplicación. public no se usa para el dominio.';

GRANT USAGE ON SCHEMA ayudas_rstc TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA ayudas_rstc TO postgres, service_role;

ALTER DATABASE postgres SET search_path TO ayudas_rstc, public, extensions;

-- Tipos cerrados del dominio. Los catálogos con nombre/código propio son tablas.

CREATE TYPE ayudas_rstc.estado_solicitud AS ENUM (
  'BORRADOR',
  'PRESENTADA',
  'EN_REVISION',
  'APROBADA',
  'ACTIVA',
  'RECHAZADA',
  'FINALIZADA',
  'CANCELADA'
);

CREATE TYPE ayudas_rstc.decision_plan_ayuda AS ENUM (
  'APROBADA',
  'RECHAZADA'
);

CREATE TYPE ayudas_rstc.tipo_actor_auditoria AS ENUM (
  'USUARIO',
  'SISTEMA',
  'TAREA_AUTOMATICA'
);

CREATE TYPE ayudas_rstc.resultado_auditoria AS ENUM (
  'EXITOSO',
  'FALLIDO'
);

CREATE TYPE ayudas_rstc.origen_auditoria AS ENUM (
  'APLICACION',
  'API',
  'TAREA_PROGRAMADA',
  'CONSOLA_ADMINISTRATIVA'
);

CREATE TYPE ayudas_rstc.frecuencia_entrega AS ENUM (
  'UNICA',
  'SEMANAL',
  'QUINCENAL',
  'MENSUAL',
  'BIMESTRAL',
  'TRIMESTRAL',
  'SEGUN_NECESIDAD'
);

COMMENT ON TYPE ayudas_rstc.estado_solicitud IS
  'Estados del ciclo de vida de una solicitud de ayuda.';
COMMENT ON TYPE ayudas_rstc.decision_plan_ayuda IS
  'Decisión formal sobre el plan de ayuda asociado a una solicitud.';
