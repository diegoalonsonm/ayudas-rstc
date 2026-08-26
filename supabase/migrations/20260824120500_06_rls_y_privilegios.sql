-- =============================================================================
-- 06. Seguridad por fila (RLS) y privilegios de roles de Supabase
-- La autorización de negocio se refuerza aquí; el servidor de aplicación sigue
-- siendo responsable de validar el rol efectivo.
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

CREATE OR REPLACE FUNCTION ayudas_rstc.usuario_actual_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  SELECT id
  FROM ayudas_rstc.usuarios
  WHERE identidad_autenticacion_id = auth.uid()
    AND eliminado_en IS NULL
    AND activo = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.usuario_actual_es_administrador()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM ayudas_rstc.asignaciones_usuario a
    JOIN ayudas_rstc.roles r ON r.id = a.rol_id
    WHERE a.usuario_id = ayudas_rstc.usuario_actual_id()
      AND a.eliminado_en IS NULL
      AND r.eliminado_en IS NULL
      AND r.codigo = 'ADMINISTRADOR'
      AND a.vigente_desde <= timezone('utc', now())
      AND (a.vigente_hasta IS NULL OR a.vigente_hasta > timezone('utc', now()))
  );
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.usuario_actual_puede_ver_auditoria()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM ayudas_rstc.asignaciones_usuario a
    JOIN ayudas_rstc.roles r ON r.id = a.rol_id
    WHERE a.usuario_id = ayudas_rstc.usuario_actual_id()
      AND a.eliminado_en IS NULL
      AND r.eliminado_en IS NULL
      AND r.codigo IN ('ADMINISTRADOR', 'COORDINADOR_DIOCESANO')
      AND a.vigente_desde <= timezone('utc', now())
      AND (a.vigente_hasta IS NULL OR a.vigente_hasta > timezone('utc', now()))
  );
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.parroquias_accesibles()
RETURNS TABLE (parroquia_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  WITH asignaciones AS (
    SELECT r.codigo AS rol, a.diocesis_id, a.vicaria_id, a.parroquia_id
    FROM ayudas_rstc.usuarios u
    JOIN ayudas_rstc.asignaciones_usuario a ON a.usuario_id = u.id
    JOIN ayudas_rstc.roles r ON r.id = a.rol_id
    WHERE u.identidad_autenticacion_id = auth.uid()
      AND u.eliminado_en IS NULL
      AND u.activo
      AND a.eliminado_en IS NULL
      AND r.eliminado_en IS NULL
      AND a.vigente_desde <= timezone('utc', now())
      AND (a.vigente_hasta IS NULL OR a.vigente_hasta > timezone('utc', now()))
  )
  SELECT p.id
  FROM ayudas_rstc.parroquias p
  JOIN ayudas_rstc.vicarias v ON v.id = p.vicaria_id
  WHERE p.eliminado_en IS NULL
    AND (
      EXISTS (SELECT 1 FROM asignaciones x WHERE x.rol = 'ADMINISTRADOR')
      OR EXISTS (
        SELECT 1 FROM asignaciones x
        WHERE x.rol = 'COORDINADOR_DIOCESANO' AND x.diocesis_id = v.diocesis_id
      )
      OR EXISTS (
        SELECT 1 FROM asignaciones x
        WHERE x.rol = 'COORDINADOR_VICARIAL' AND x.vicaria_id = p.vicaria_id
      )
      OR EXISTS (
        SELECT 1 FROM asignaciones x
        WHERE x.rol IN ('PERSONAL_PASTORAL', 'COORDINADOR_PARROQUIAL')
          AND x.parroquia_id = p.id
      )
    );
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.solicitud_en_alcance(p_solicitud_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM ayudas_rstc.solicitudes_ayuda s
    WHERE s.id = p_solicitud_id
      AND s.parroquia_receptora_id IN (SELECT parroquia_id FROM ayudas_rstc.parroquias_accesibles())
  );
$$;

ALTER TABLE ayudas_rstc.diocesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.vicarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.parroquias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.asignaciones_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.tipos_documento ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.cantones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.distritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.barrios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.direcciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.sexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.grados_academicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.parentescos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.rangos_ingreso ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.tipos_vivienda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.tipos_tenencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.condiciones_vivienda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.tipos_ayuda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.solicitudes_ayuda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.historial_estados_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.integrantes_convivencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.evaluaciones_vivienda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.ayudas_solicitadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.planes_ayuda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.detalles_plan_ayuda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.entregas_ayuda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.documentos_consentimiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_rstc.eventos_auditoria ENABLE ROW LEVEL SECURITY;

-- Catálogos de lectura amplia para usuarios autenticados.
DO $$
DECLARE
  v_tabla text;
  v_catalogos text[] := ARRAY[
    'tipos_documento', 'sexos', 'grados_academicos', 'parentescos', 'rangos_ingreso',
    'tipos_vivienda', 'tipos_tenencia', 'condiciones_vivienda', 'tipos_ayuda',
    'cantones', 'distritos', 'barrios', 'roles'
  ];
BEGIN
  FOREACH v_tabla IN ARRAY v_catalogos LOOP
    EXECUTE format(
      'CREATE POLICY %I ON ayudas_rstc.%I
         FOR SELECT TO authenticated
         USING (eliminado_en IS NULL)',
      'sel_' || v_tabla || '_activos', v_tabla
    );
    EXECUTE format(
      'CREATE POLICY %I ON ayudas_rstc.%I
         FOR ALL TO authenticated
         USING (ayudas_rstc.usuario_actual_es_administrador())
         WITH CHECK (ayudas_rstc.usuario_actual_es_administrador())',
      'admin_' || v_tabla, v_tabla
    );
  END LOOP;
END;
$$;

CREATE POLICY sel_diocesis ON ayudas_rstc.diocesis
  FOR SELECT TO authenticated
  USING (eliminado_en IS NULL);

CREATE POLICY sel_vicarias ON ayudas_rstc.vicarias
  FOR SELECT TO authenticated
  USING (eliminado_en IS NULL);

CREATE POLICY sel_parroquias ON ayudas_rstc.parroquias
  FOR SELECT TO authenticated
  USING (eliminado_en IS NULL);

CREATE POLICY admin_org_diocesis ON ayudas_rstc.diocesis
  FOR ALL TO authenticated
  USING (ayudas_rstc.usuario_actual_es_administrador())
  WITH CHECK (ayudas_rstc.usuario_actual_es_administrador());

CREATE POLICY admin_org_vicarias ON ayudas_rstc.vicarias
  FOR ALL TO authenticated
  USING (ayudas_rstc.usuario_actual_es_administrador())
  WITH CHECK (ayudas_rstc.usuario_actual_es_administrador());

CREATE POLICY admin_org_parroquias ON ayudas_rstc.parroquias
  FOR ALL TO authenticated
  USING (ayudas_rstc.usuario_actual_es_administrador())
  WITH CHECK (ayudas_rstc.usuario_actual_es_administrador());

CREATE POLICY sel_usuarios ON ayudas_rstc.usuarios
  FOR SELECT TO authenticated
  USING (
    id = ayudas_rstc.usuario_actual_id()
    OR ayudas_rstc.usuario_actual_es_administrador()
    OR ayudas_rstc.usuario_actual_puede_ver_auditoria()
  );

CREATE POLICY upd_usuarios_propio ON ayudas_rstc.usuarios
  FOR UPDATE TO authenticated
  USING (id = ayudas_rstc.usuario_actual_id() OR ayudas_rstc.usuario_actual_es_administrador())
  WITH CHECK (id = ayudas_rstc.usuario_actual_id() OR ayudas_rstc.usuario_actual_es_administrador());

CREATE POLICY ins_usuarios ON ayudas_rstc.usuarios
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY sel_asignaciones ON ayudas_rstc.asignaciones_usuario
  FOR SELECT TO authenticated
  USING (
    usuario_id = ayudas_rstc.usuario_actual_id()
    OR ayudas_rstc.usuario_actual_es_administrador()
    OR ayudas_rstc.usuario_actual_puede_ver_auditoria()
  );

CREATE POLICY wr_asignaciones ON ayudas_rstc.asignaciones_usuario
  FOR ALL TO authenticated
  USING (ayudas_rstc.usuario_actual_es_administrador())
  WITH CHECK (ayudas_rstc.usuario_actual_es_administrador());

CREATE POLICY sel_solicitudes ON ayudas_rstc.solicitudes_ayuda
  FOR SELECT TO authenticated
  USING (
    parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
  );

CREATE POLICY wr_solicitudes ON ayudas_rstc.solicitudes_ayuda
  FOR INSERT TO authenticated
  WITH CHECK (
    parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
  );

CREATE POLICY upd_solicitudes ON ayudas_rstc.solicitudes_ayuda
  FOR UPDATE TO authenticated
  USING (
    parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
  )
  WITH CHECK (
    parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
  );

CREATE POLICY sel_personas ON ayudas_rstc.personas
  FOR SELECT TO authenticated
  USING (
    ayudas_rstc.usuario_actual_es_administrador()
    OR EXISTS (
      SELECT 1
      FROM ayudas_rstc.solicitudes_ayuda s
      WHERE s.persona_solicitante_id = personas.id
        AND s.parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
    )
  );

CREATE POLICY wr_personas ON ayudas_rstc.personas
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY upd_personas ON ayudas_rstc.personas
  FOR UPDATE TO authenticated
  USING (
    ayudas_rstc.usuario_actual_es_administrador()
    OR EXISTS (
      SELECT 1
      FROM ayudas_rstc.solicitudes_ayuda s
      WHERE s.persona_solicitante_id = personas.id
        AND s.parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
    )
  )
  WITH CHECK (true);

CREATE POLICY sel_direcciones ON ayudas_rstc.direcciones
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ayudas_rstc.personas pe
      WHERE pe.id = direcciones.persona_id
    )
  );

CREATE POLICY wr_direcciones ON ayudas_rstc.direcciones
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Hijos de solicitud: el alcance se hereda de la solicitud.
DO $$
DECLARE
  v_tabla text;
  v_col text;
  v_hijos text[] := ARRAY[
    'historial_estados_solicitud',
    'integrantes_convivencia',
    'evaluaciones_vivienda',
    'ayudas_solicitadas',
    'documentos_consentimiento'
  ];
BEGIN
  FOREACH v_tabla IN ARRAY v_hijos LOOP
    EXECUTE format(
      'CREATE POLICY %I ON ayudas_rstc.%I
         FOR SELECT TO authenticated
         USING (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id))',
      'sel_' || v_tabla, v_tabla
    );
    EXECUTE format(
      'CREATE POLICY %I ON ayudas_rstc.%I
         FOR INSERT TO authenticated
         WITH CHECK (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id))',
      'ins_' || v_tabla, v_tabla
    );
    IF v_tabla <> 'historial_estados_solicitud' THEN
      EXECUTE format(
        'CREATE POLICY %I ON ayudas_rstc.%I
           FOR UPDATE TO authenticated
           USING (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id))
           WITH CHECK (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id))',
        'upd_' || v_tabla, v_tabla
      );
    END IF;
  END LOOP;
END;
$$;

CREATE POLICY sel_planes ON ayudas_rstc.planes_ayuda
  FOR SELECT TO authenticated
  USING (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id));

CREATE POLICY wr_planes ON ayudas_rstc.planes_ayuda
  FOR INSERT TO authenticated
  WITH CHECK (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id));

CREATE POLICY upd_planes ON ayudas_rstc.planes_ayuda
  FOR UPDATE TO authenticated
  USING (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id))
  WITH CHECK (ayudas_rstc.solicitud_en_alcance(solicitud_ayuda_id));

CREATE POLICY sel_detalles_plan ON ayudas_rstc.detalles_plan_ayuda
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ayudas_rstc.planes_ayuda p
      WHERE p.id = detalles_plan_ayuda.plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  );

CREATE POLICY wr_detalles_plan ON ayudas_rstc.detalles_plan_ayuda
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ayudas_rstc.planes_ayuda p
      WHERE p.id = detalles_plan_ayuda.plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  );

CREATE POLICY upd_detalles_plan ON ayudas_rstc.detalles_plan_ayuda
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ayudas_rstc.planes_ayuda p
      WHERE p.id = detalles_plan_ayuda.plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ayudas_rstc.planes_ayuda p
      WHERE p.id = detalles_plan_ayuda.plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  );

CREATE POLICY sel_entregas ON ayudas_rstc.entregas_ayuda
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM ayudas_rstc.detalles_plan_ayuda d
      JOIN ayudas_rstc.planes_ayuda p ON p.id = d.plan_ayuda_id
      WHERE d.id = entregas_ayuda.detalle_plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  );

CREATE POLICY wr_entregas ON ayudas_rstc.entregas_ayuda
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM ayudas_rstc.detalles_plan_ayuda d
      JOIN ayudas_rstc.planes_ayuda p ON p.id = d.plan_ayuda_id
      WHERE d.id = entregas_ayuda.detalle_plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  );

CREATE POLICY upd_entregas ON ayudas_rstc.entregas_ayuda
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM ayudas_rstc.detalles_plan_ayuda d
      JOIN ayudas_rstc.planes_ayuda p ON p.id = d.plan_ayuda_id
      WHERE d.id = entregas_ayuda.detalle_plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM ayudas_rstc.detalles_plan_ayuda d
      JOIN ayudas_rstc.planes_ayuda p ON p.id = d.plan_ayuda_id
      WHERE d.id = entregas_ayuda.detalle_plan_ayuda_id
        AND ayudas_rstc.solicitud_en_alcance(p.solicitud_ayuda_id)
    )
  );

CREATE POLICY sel_auditoria ON ayudas_rstc.eventos_auditoria
  FOR SELECT TO authenticated
  USING (ayudas_rstc.usuario_actual_puede_ver_auditoria());

CREATE POLICY ins_auditoria ON ayudas_rstc.eventos_auditoria
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Privilegios: la aplicación no borra filas ni altera la bitácora.
REVOKE ALL ON ALL TABLES IN SCHEMA ayudas_rstc FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA ayudas_rstc FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA ayudas_rstc FROM anon;

GRANT USAGE ON SCHEMA ayudas_rstc TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ayudas_rstc TO authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ayudas_rstc TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ayudas_rstc TO authenticated, service_role;

REVOKE UPDATE, DELETE ON ayudas_rstc.eventos_auditoria FROM authenticated, anon, service_role;
REVOKE UPDATE, DELETE ON ayudas_rstc.historial_estados_solicitud FROM authenticated, anon, service_role;
GRANT SELECT, INSERT ON ayudas_rstc.eventos_auditoria TO authenticated, service_role;
GRANT SELECT, INSERT ON ayudas_rstc.historial_estados_solicitud TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ayudas_rstc
  GRANT SELECT, INSERT, UPDATE ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ayudas_rstc
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ayudas_rstc
  GRANT EXECUTE ON FUNCTIONS TO authenticated, service_role;
