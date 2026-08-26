-- =============================================================================
-- 04. Llaves foráneas e índices (unicidad parcial solo sobre no eliminados)
-- ON DELETE RESTRICT evita borrar físicamente registros usados históricamente.
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

-- Organización
ALTER TABLE ayudas_rstc.vicarias
  ADD CONSTRAINT vicarias_diocesis_id_fkey
  FOREIGN KEY (diocesis_id) REFERENCES ayudas_rstc.diocesis (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.parroquias
  ADD CONSTRAINT parroquias_vicaria_id_fkey
  FOREIGN KEY (vicaria_id) REFERENCES ayudas_rstc.vicarias (id) ON DELETE RESTRICT;

-- Usuarios y alcance
ALTER TABLE ayudas_rstc.asignaciones_usuario
  ADD CONSTRAINT asignaciones_usuario_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.asignaciones_usuario
  ADD CONSTRAINT asignaciones_usuario_rol_id_fkey
  FOREIGN KEY (rol_id) REFERENCES ayudas_rstc.roles (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.asignaciones_usuario
  ADD CONSTRAINT asignaciones_usuario_diocesis_id_fkey
  FOREIGN KEY (diocesis_id) REFERENCES ayudas_rstc.diocesis (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.asignaciones_usuario
  ADD CONSTRAINT asignaciones_usuario_vicaria_id_fkey
  FOREIGN KEY (vicaria_id) REFERENCES ayudas_rstc.vicarias (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.asignaciones_usuario
  ADD CONSTRAINT asignaciones_usuario_parroquia_id_fkey
  FOREIGN KEY (parroquia_id) REFERENCES ayudas_rstc.parroquias (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.usuarios
  ADD CONSTRAINT usuarios_creado_por_usuario_id_fkey
  FOREIGN KEY (creado_por_usuario_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.usuarios
  ADD CONSTRAINT usuarios_actualizado_por_usuario_id_fkey
  FOREIGN KEY (actualizado_por_usuario_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.usuarios
  ADD CONSTRAINT usuarios_eliminado_por_usuario_id_fkey
  FOREIGN KEY (eliminado_por_usuario_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
    ALTER TABLE ayudas_rstc.usuarios
      ADD CONSTRAINT usuarios_identidad_autenticacion_id_fkey
      FOREIGN KEY (identidad_autenticacion_id) REFERENCES auth.users (id) ON DELETE RESTRICT;
  END IF;
END;
$$;

-- Personas y geografía
ALTER TABLE ayudas_rstc.personas
  ADD CONSTRAINT personas_tipo_documento_id_fkey
  FOREIGN KEY (tipo_documento_id) REFERENCES ayudas_rstc.tipos_documento (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.distritos
  ADD CONSTRAINT distritos_canton_id_fkey
  FOREIGN KEY (canton_id) REFERENCES ayudas_rstc.cantones (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.barrios
  ADD CONSTRAINT barrios_distrito_id_fkey
  FOREIGN KEY (distrito_id) REFERENCES ayudas_rstc.distritos (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.direcciones
  ADD CONSTRAINT direcciones_persona_id_fkey
  FOREIGN KEY (persona_id) REFERENCES ayudas_rstc.personas (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.direcciones
  ADD CONSTRAINT direcciones_canton_id_fkey
  FOREIGN KEY (canton_id) REFERENCES ayudas_rstc.cantones (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.direcciones
  ADD CONSTRAINT direcciones_distrito_id_fkey
  FOREIGN KEY (distrito_id) REFERENCES ayudas_rstc.distritos (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.direcciones
  ADD CONSTRAINT direcciones_barrio_id_fkey
  FOREIGN KEY (barrio_id) REFERENCES ayudas_rstc.barrios (id) ON DELETE RESTRICT;

-- Solicitudes
ALTER TABLE ayudas_rstc.solicitudes_ayuda
  ADD CONSTRAINT solicitudes_ayuda_persona_solicitante_id_fkey
  FOREIGN KEY (persona_solicitante_id) REFERENCES ayudas_rstc.personas (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.solicitudes_ayuda
  ADD CONSTRAINT solicitudes_ayuda_parroquia_receptora_id_fkey
  FOREIGN KEY (parroquia_receptora_id) REFERENCES ayudas_rstc.parroquias (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.solicitudes_ayuda
  ADD CONSTRAINT solicitudes_ayuda_usuario_entrevistador_id_fkey
  FOREIGN KEY (usuario_entrevistador_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.historial_estados_solicitud
  ADD CONSTRAINT historial_estados_solicitud_solicitud_ayuda_id_fkey
  FOREIGN KEY (solicitud_ayuda_id) REFERENCES ayudas_rstc.solicitudes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.historial_estados_solicitud
  ADD CONSTRAINT historial_estados_solicitud_usuario_responsable_id_fkey
  FOREIGN KEY (usuario_responsable_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_solicitud_ayuda_id_fkey
  FOREIGN KEY (solicitud_ayuda_id) REFERENCES ayudas_rstc.solicitudes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_persona_id_fkey
  FOREIGN KEY (persona_id) REFERENCES ayudas_rstc.personas (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_sexo_id_fkey
  FOREIGN KEY (sexo_id) REFERENCES ayudas_rstc.sexos (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_tipo_documento_id_fkey
  FOREIGN KEY (tipo_documento_id) REFERENCES ayudas_rstc.tipos_documento (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_grado_academico_id_fkey
  FOREIGN KEY (grado_academico_id) REFERENCES ayudas_rstc.grados_academicos (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_rango_ingreso_id_fkey
  FOREIGN KEY (rango_ingreso_id) REFERENCES ayudas_rstc.rangos_ingreso (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.integrantes_convivencia
  ADD CONSTRAINT integrantes_convivencia_parentesco_id_fkey
  FOREIGN KEY (parentesco_id) REFERENCES ayudas_rstc.parentescos (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.evaluaciones_vivienda
  ADD CONSTRAINT evaluaciones_vivienda_solicitud_ayuda_id_fkey
  FOREIGN KEY (solicitud_ayuda_id) REFERENCES ayudas_rstc.solicitudes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.evaluaciones_vivienda
  ADD CONSTRAINT evaluaciones_vivienda_tipo_vivienda_id_fkey
  FOREIGN KEY (tipo_vivienda_id) REFERENCES ayudas_rstc.tipos_vivienda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.evaluaciones_vivienda
  ADD CONSTRAINT evaluaciones_vivienda_tipo_tenencia_id_fkey
  FOREIGN KEY (tipo_tenencia_id) REFERENCES ayudas_rstc.tipos_tenencia (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.evaluaciones_vivienda
  ADD CONSTRAINT evaluaciones_vivienda_condicion_vivienda_id_fkey
  FOREIGN KEY (condicion_vivienda_id) REFERENCES ayudas_rstc.condiciones_vivienda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.ayudas_solicitadas
  ADD CONSTRAINT ayudas_solicitadas_solicitud_ayuda_id_fkey
  FOREIGN KEY (solicitud_ayuda_id) REFERENCES ayudas_rstc.solicitudes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.ayudas_solicitadas
  ADD CONSTRAINT ayudas_solicitadas_tipo_ayuda_id_fkey
  FOREIGN KEY (tipo_ayuda_id) REFERENCES ayudas_rstc.tipos_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.planes_ayuda
  ADD CONSTRAINT planes_ayuda_solicitud_ayuda_id_fkey
  FOREIGN KEY (solicitud_ayuda_id) REFERENCES ayudas_rstc.solicitudes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.planes_ayuda
  ADD CONSTRAINT planes_ayuda_usuario_decisor_id_fkey
  FOREIGN KEY (usuario_decisor_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.detalles_plan_ayuda
  ADD CONSTRAINT detalles_plan_ayuda_plan_ayuda_id_fkey
  FOREIGN KEY (plan_ayuda_id) REFERENCES ayudas_rstc.planes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.detalles_plan_ayuda
  ADD CONSTRAINT detalles_plan_ayuda_tipo_ayuda_id_fkey
  FOREIGN KEY (tipo_ayuda_id) REFERENCES ayudas_rstc.tipos_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.entregas_ayuda
  ADD CONSTRAINT entregas_ayuda_detalle_plan_ayuda_id_fkey
  FOREIGN KEY (detalle_plan_ayuda_id) REFERENCES ayudas_rstc.detalles_plan_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.entregas_ayuda
  ADD CONSTRAINT entregas_ayuda_usuario_responsable_id_fkey
  FOREIGN KEY (usuario_responsable_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.documentos_consentimiento
  ADD CONSTRAINT documentos_consentimiento_solicitud_ayuda_id_fkey
  FOREIGN KEY (solicitud_ayuda_id) REFERENCES ayudas_rstc.solicitudes_ayuda (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.documentos_consentimiento
  ADD CONSTRAINT documentos_consentimiento_usuario_carga_id_fkey
  FOREIGN KEY (usuario_carga_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.eventos_auditoria
  ADD CONSTRAINT eventos_auditoria_usuario_id_fkey
  FOREIGN KEY (usuario_id) REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.eventos_auditoria
  ADD CONSTRAINT eventos_auditoria_diocesis_id_fkey
  FOREIGN KEY (diocesis_id) REFERENCES ayudas_rstc.diocesis (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.eventos_auditoria
  ADD CONSTRAINT eventos_auditoria_vicaria_id_fkey
  FOREIGN KEY (vicaria_id) REFERENCES ayudas_rstc.vicarias (id) ON DELETE RESTRICT;

ALTER TABLE ayudas_rstc.eventos_auditoria
  ADD CONSTRAINT eventos_auditoria_parroquia_id_fkey
  FOREIGN KEY (parroquia_id) REFERENCES ayudas_rstc.parroquias (id) ON DELETE RESTRICT;

-- Auditoría de columnas creado/actualizado/eliminado_por en el resto de tablas.
DO $$
DECLARE
  v_tabla text;
  v_tablas text[] := ARRAY[
    'diocesis', 'vicarias', 'parroquias', 'roles', 'asignaciones_usuario',
    'tipos_documento', 'cantones', 'distritos', 'barrios', 'personas', 'direcciones',
    'sexos', 'grados_academicos', 'parentescos', 'rangos_ingreso',
    'tipos_vivienda', 'tipos_tenencia', 'condiciones_vivienda', 'tipos_ayuda',
    'solicitudes_ayuda', 'integrantes_convivencia', 'evaluaciones_vivienda',
    'ayudas_solicitadas', 'planes_ayuda', 'detalles_plan_ayuda', 'entregas_ayuda',
    'documentos_consentimiento'
  ];
BEGIN
  FOREACH v_tabla IN ARRAY v_tablas LOOP
    EXECUTE format(
      'ALTER TABLE ayudas_rstc.%I
         ADD CONSTRAINT %I FOREIGN KEY (creado_por_usuario_id)
         REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT',
      v_tabla, v_tabla || '_creado_por_usuario_id_fkey'
    );
    EXECUTE format(
      'ALTER TABLE ayudas_rstc.%I
         ADD CONSTRAINT %I FOREIGN KEY (actualizado_por_usuario_id)
         REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT',
      v_tabla, v_tabla || '_actualizado_por_usuario_id_fkey'
    );
    EXECUTE format(
      'ALTER TABLE ayudas_rstc.%I
         ADD CONSTRAINT %I FOREIGN KEY (eliminado_por_usuario_id)
         REFERENCES ayudas_rstc.usuarios (id) ON DELETE RESTRICT',
      v_tabla, v_tabla || '_eliminado_por_usuario_id_fkey'
    );
  END LOOP;
END;
$$;

-- Unicidad parcial: solo registros no eliminados.
CREATE UNIQUE INDEX uq_diocesis_codigo_activos
  ON ayudas_rstc.diocesis (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_vicarias_codigo_activos
  ON ayudas_rstc.vicarias (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_parroquias_codigo_activos
  ON ayudas_rstc.parroquias (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_roles_codigo_activos
  ON ayudas_rstc.roles (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_usuarios_correo_activos
  ON ayudas_rstc.usuarios (lower(correo)) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_usuarios_identidad
  ON ayudas_rstc.usuarios (identidad_autenticacion_id)
  WHERE identidad_autenticacion_id IS NOT NULL;

CREATE UNIQUE INDEX uq_tipos_documento_codigo_activos
  ON ayudas_rstc.tipos_documento (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_cantones_codigo_activos
  ON ayudas_rstc.cantones (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_distritos_codigo_activos
  ON ayudas_rstc.distritos (canton_id, codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_barrios_codigo_activos
  ON ayudas_rstc.barrios (distrito_id, codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_personas_documento_hash_activos
  ON ayudas_rstc.personas (numero_documento_hash)
  WHERE numero_documento_hash IS NOT NULL AND eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_direcciones_persona_actual
  ON ayudas_rstc.direcciones (persona_id)
  WHERE es_actual = true AND eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_sexos_codigo_activos
  ON ayudas_rstc.sexos (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_grados_academicos_codigo_activos
  ON ayudas_rstc.grados_academicos (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_parentescos_codigo_activos
  ON ayudas_rstc.parentescos (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_rangos_ingreso_codigo_activos
  ON ayudas_rstc.rangos_ingreso (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_tipos_vivienda_codigo_activos
  ON ayudas_rstc.tipos_vivienda (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_tipos_tenencia_codigo_activos
  ON ayudas_rstc.tipos_tenencia (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_condiciones_vivienda_codigo_activos
  ON ayudas_rstc.condiciones_vivienda (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_tipos_ayuda_codigo_activos
  ON ayudas_rstc.tipos_ayuda (codigo) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_solicitudes_numero_activos
  ON ayudas_rstc.solicitudes_ayuda (numero_solicitud) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_evaluaciones_vivienda_solicitud_activos
  ON ayudas_rstc.evaluaciones_vivienda (solicitud_ayuda_id) WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_ayudas_solicitadas_tipo_activos
  ON ayudas_rstc.ayudas_solicitadas (solicitud_ayuda_id, tipo_ayuda_id)
  WHERE eliminado_en IS NULL;

CREATE UNIQUE INDEX uq_planes_ayuda_solicitud_activos
  ON ayudas_rstc.planes_ayuda (solicitud_ayuda_id) WHERE eliminado_en IS NULL;

CREATE INDEX idx_solicitudes_persona_estado
  ON ayudas_rstc.solicitudes_ayuda (persona_solicitante_id, estado)
  WHERE eliminado_en IS NULL;

CREATE INDEX idx_solicitudes_parroquia
  ON ayudas_rstc.solicitudes_ayuda (parroquia_receptora_id)
  WHERE eliminado_en IS NULL;

CREATE INDEX idx_ayudas_solicitadas_tipo
  ON ayudas_rstc.ayudas_solicitadas (tipo_ayuda_id)
  WHERE eliminado_en IS NULL;

CREATE INDEX idx_asignaciones_usuario_vigentes
  ON ayudas_rstc.asignaciones_usuario (usuario_id)
  WHERE eliminado_en IS NULL AND vigente_hasta IS NULL;

CREATE INDEX idx_personas_nombres_trgm
  ON ayudas_rstc.personas USING gin ((primer_nombre || ' ' || primer_apellido) gin_trgm_ops);

CREATE INDEX idx_eventos_auditoria_ocurrido_en
  ON ayudas_rstc.eventos_auditoria (ocurrido_en DESC);

CREATE INDEX idx_eventos_auditoria_entidad
  ON ayudas_rstc.eventos_auditoria (tipo_entidad, entidad_id);

CREATE INDEX idx_eventos_auditoria_usuario
  ON ayudas_rstc.eventos_auditoria (usuario_id, ocurrido_en DESC);

CREATE INDEX idx_historial_solicitud
  ON ayudas_rstc.historial_estados_solicitud (solicitud_ayuda_id, ocurrido_en);
