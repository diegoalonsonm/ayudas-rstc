-- =============================================================================
-- 03. Tablas del modelo (organización, usuarios, personas, solicitudes, auditoría)
-- Las llaves foráneas se agregan al final para respetar dependencias circulares.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Organización eclesial
-- -----------------------------------------------------------------------------

CREATE TABLE ayudas_rstc.diocesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  codigo text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.vicarias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diocesis_id uuid NOT NULL,
  nombre text NOT NULL,
  codigo text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.parroquias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vicaria_id uuid NOT NULL,
  nombre text NOT NULL,
  codigo text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

-- -----------------------------------------------------------------------------
-- Usuarios, roles y alcance
-- -----------------------------------------------------------------------------

CREATE TABLE ayudas_rstc.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identidad_autenticacion_id uuid,
  nombre_completo text NOT NULL,
  correo text NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  ultimo_acceso_en timestamptz,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.asignaciones_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  rol_id uuid NOT NULL,
  diocesis_id uuid,
  vicaria_id uuid,
  parroquia_id uuid,
  vigente_desde timestamptz NOT NULL DEFAULT timezone('utc', now()),
  vigente_hasta timestamptz,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_asignacion_vigencia
    CHECK (vigente_hasta IS NULL OR vigente_hasta >= vigente_desde)
);

-- -----------------------------------------------------------------------------
-- Geografía y personas
-- -----------------------------------------------------------------------------

CREATE TABLE ayudas_rstc.tipos_documento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.cantones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.distritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canton_id uuid NOT NULL,
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.barrios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  distrito_id uuid NOT NULL,
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_documento_id uuid,
  numero_documento_cifrado text,
  numero_documento_hash text,
  primer_nombre text NOT NULL,
  segundo_nombre text,
  primer_apellido text NOT NULL,
  segundo_apellido text,
  telefono text,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.direcciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id uuid NOT NULL,
  canton_id uuid,
  distrito_id uuid,
  barrio_id uuid,
  senas text,
  es_actual boolean NOT NULL DEFAULT true,
  vigente_desde date NOT NULL DEFAULT (timezone('utc', now()))::date,
  vigente_hasta date,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_direccion_actual
    CHECK ((es_actual = true AND vigente_hasta IS NULL) OR es_actual = false),
  CONSTRAINT chk_direccion_vigencia
    CHECK (vigente_hasta IS NULL OR vigente_hasta >= vigente_desde)
);

-- -----------------------------------------------------------------------------
-- Catálogos de convivencia y vivienda
-- -----------------------------------------------------------------------------

CREATE TABLE ayudas_rstc.sexos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  orden_presentacion integer NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.grados_academicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  orden_presentacion integer NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.parentescos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  orden_presentacion integer NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.rangos_ingreso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  monto_minimo numeric(14, 2),
  monto_maximo numeric(14, 2),
  orden_presentacion integer NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_rango_ingreso_montos
    CHECK (
      monto_minimo IS NULL
      OR monto_maximo IS NULL
      OR monto_minimo <= monto_maximo
    )
);

CREATE TABLE ayudas_rstc.tipos_vivienda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.tipos_tenencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.condiciones_vivienda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.tipos_ayuda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  nombre text NOT NULL,
  requiere_detalle boolean NOT NULL DEFAULT false,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

-- -----------------------------------------------------------------------------
-- Solicitudes y expediente
-- -----------------------------------------------------------------------------

CREATE SEQUENCE ayudas_rstc.solicitudes_ayuda_numero_seq AS bigint START WITH 1 INCREMENT BY 1;

CREATE TABLE ayudas_rstc.solicitudes_ayuda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_solicitud text NOT NULL,
  persona_solicitante_id uuid NOT NULL,
  parroquia_receptora_id uuid NOT NULL,
  sector_oficial text,
  usuario_entrevistador_id uuid,
  fecha_entrevista date,
  fecha_visita date,
  estado ayudas_rstc.estado_solicitud NOT NULL DEFAULT 'BORRADOR',
  observaciones text,
  presentada_en timestamptz,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.historial_estados_solicitud (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_ayuda_id uuid NOT NULL,
  estado_anterior ayudas_rstc.estado_solicitud,
  estado_nuevo ayudas_rstc.estado_solicitud NOT NULL,
  motivo text,
  usuario_responsable_id uuid,
  ocurrido_en timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE ayudas_rstc.integrantes_convivencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_ayuda_id uuid NOT NULL,
  persona_id uuid,
  nombre_completo text NOT NULL,
  sexo_id uuid,
  ocupacion text,
  tipo_documento_id uuid,
  numero_documento_cifrado text,
  numero_documento_hash text,
  grado_academico_id uuid,
  rango_ingreso_id uuid,
  cuenta_con_seguro boolean,
  parentesco_id uuid,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.evaluaciones_vivienda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_ayuda_id uuid NOT NULL,
  tipo_vivienda_id uuid,
  tipo_tenencia_id uuid,
  condicion_vivienda_id uuid,
  observaciones text,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.ayudas_solicitadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_ayuda_id uuid NOT NULL,
  tipo_ayuda_id uuid NOT NULL,
  detalle text,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text
);

CREATE TABLE ayudas_rstc.planes_ayuda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_ayuda_id uuid NOT NULL,
  decision ayudas_rstc.decision_plan_ayuda NOT NULL,
  fecha_inicio date,
  fecha_fin date,
  motivo_decision text,
  usuario_decisor_id uuid,
  decidido_en timestamptz,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_plan_fechas
    CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE ayudas_rstc.detalles_plan_ayuda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_ayuda_id uuid NOT NULL,
  tipo_ayuda_id uuid NOT NULL,
  descripcion text,
  frecuencia ayudas_rstc.frecuencia_entrega,
  monto_estimado numeric(14, 2),
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_detalle_plan_monto
    CHECK (monto_estimado IS NULL OR monto_estimado >= 0)
);

CREATE TABLE ayudas_rstc.entregas_ayuda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detalle_plan_ayuda_id uuid NOT NULL,
  fecha_entrega date NOT NULL,
  descripcion text,
  monto numeric(14, 2),
  usuario_responsable_id uuid,
  observaciones text,
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_entrega_monto
    CHECK (monto IS NULL OR monto >= 0)
);

CREATE TABLE ayudas_rstc.documentos_consentimiento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_ayuda_id uuid NOT NULL,
  nombre_bucket text NOT NULL,
  clave_objeto text NOT NULL,
  nombre_archivo_original text NOT NULL,
  tipo_mime text,
  tamano_bytes bigint,
  suma_verificacion text,
  fecha_firma date,
  usuario_carga_id uuid,
  cargado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  creado_por_usuario_id uuid,
  actualizado_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  actualizado_por_usuario_id uuid,
  eliminado_en timestamptz,
  eliminado_por_usuario_id uuid,
  motivo_eliminacion text,
  CONSTRAINT chk_documento_tamano
    CHECK (tamano_bytes IS NULL OR tamano_bytes >= 0)
);

-- -----------------------------------------------------------------------------
-- Auditoría inmutable, particionada por año de ocurrido_en.
-- La llave primaria incluye la columna de partición (requisito de PostgreSQL).
-- -----------------------------------------------------------------------------

CREATE TABLE ayudas_rstc.eventos_auditoria (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ocurrido_en timestamptz NOT NULL DEFAULT timezone('utc', now()),
  usuario_id uuid,
  rol_codigo text,
  tipo_actor ayudas_rstc.tipo_actor_auditoria NOT NULL DEFAULT 'USUARIO',
  accion text NOT NULL,
  tipo_entidad text NOT NULL,
  entidad_id uuid,
  diocesis_id uuid,
  vicaria_id uuid,
  parroquia_id uuid,
  datos_anteriores jsonb,
  datos_nuevos jsonb,
  campos_modificados text[],
  motivo text,
  resultado ayudas_rstc.resultado_auditoria NOT NULL DEFAULT 'EXITOSO',
  codigo_error text,
  direccion_ip inet,
  agente_usuario text,
  identificador_sesion text,
  identificador_solicitud text,
  origen ayudas_rstc.origen_auditoria,
  PRIMARY KEY (id, ocurrido_en)
) PARTITION BY RANGE (ocurrido_en);

CREATE TABLE ayudas_rstc.eventos_auditoria_2025
  PARTITION OF ayudas_rstc.eventos_auditoria
  FOR VALUES FROM ('2025-01-01 00:00:00+00') TO ('2026-01-01 00:00:00+00');

CREATE TABLE ayudas_rstc.eventos_auditoria_2026
  PARTITION OF ayudas_rstc.eventos_auditoria
  FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE ayudas_rstc.eventos_auditoria_2027
  PARTITION OF ayudas_rstc.eventos_auditoria
  FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2028-01-01 00:00:00+00');

CREATE TABLE ayudas_rstc.eventos_auditoria_2028
  PARTITION OF ayudas_rstc.eventos_auditoria
  FOR VALUES FROM ('2028-01-01 00:00:00+00') TO ('2029-01-01 00:00:00+00');

CREATE TABLE ayudas_rstc.eventos_auditoria_2029
  PARTITION OF ayudas_rstc.eventos_auditoria
  FOR VALUES FROM ('2029-01-01 00:00:00+00') TO ('2030-01-01 00:00:00+00');

CREATE TABLE ayudas_rstc.eventos_auditoria_2030
  PARTITION OF ayudas_rstc.eventos_auditoria
  FOR VALUES FROM ('2030-01-01 00:00:00+00') TO ('2031-01-01 00:00:00+00');

-- Captura filas fuera del rango previsto (p. ej. reloj desfasado) sin fallar el insert.
CREATE TABLE ayudas_rstc.eventos_auditoria_default
  PARTITION OF ayudas_rstc.eventos_auditoria DEFAULT;

COMMENT ON TABLE ayudas_rstc.personas IS
  'Una persona existe una sola vez en la diócesis. El documento se guarda cifrado y se busca por hash.';
COMMENT ON TABLE ayudas_rstc.solicitudes_ayuda IS
  'Fotografía histórica de la entrevista. La vicaría se obtiene desde parroquia_receptora_id.';
COMMENT ON TABLE ayudas_rstc.eventos_auditoria IS
  'Bitácora inmutable. La aplicación no recibe permisos UPDATE ni DELETE.';
COMMENT ON TABLE ayudas_rstc.historial_estados_solicitud IS
  'Evidencia de cada transición de estado. Solo inserción.';
COMMENT ON COLUMN ayudas_rstc.personas.numero_documento_hash IS
  'Hash del documento normalizado para detectar duplicados sin leer el valor cifrado.';
COMMENT ON COLUMN ayudas_rstc.documentos_consentimiento.clave_objeto IS
  'Clave del objeto en el bucket privado. Nunca una URL pública permanente.';
COMMENT ON COLUMN ayudas_rstc.direcciones.senas IS
  'Señas de ubicación; dato sensible a proteger en bitácoras.';
