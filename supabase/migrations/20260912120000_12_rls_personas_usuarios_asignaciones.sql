-- =============================================================================
-- 12. RLS: lectura de personas recién creadas, usuarios en alcance territorial
-- y escritura de asignaciones por el coordinador diocesano.
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

CREATE OR REPLACE FUNCTION ayudas_rstc.usuario_actual_es_coordinador_diocesano()
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
      AND r.codigo = 'COORDINADOR_DIOCESANO'
      AND a.vigente_desde <= timezone('utc', now())
      AND (a.vigente_hasta IS NULL OR a.vigente_hasta > timezone('utc', now()))
  );
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.alcance_territorial_accesible(
  p_diocesis_id uuid,
  p_vicaria_id uuid,
  p_parroquia_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  SELECT
    CASE
      WHEN p_parroquia_id IS NOT NULL THEN
        p_parroquia_id IN (SELECT parroquia_id FROM ayudas_rstc.parroquias_accesibles())
      WHEN p_vicaria_id IS NOT NULL THEN
        EXISTS (
          SELECT 1
          FROM ayudas_rstc.parroquias p
          WHERE p.vicaria_id = p_vicaria_id
            AND p.eliminado_en IS NULL
            AND p.id IN (SELECT parroquia_id FROM ayudas_rstc.parroquias_accesibles())
        )
      WHEN p_diocesis_id IS NOT NULL THEN
        EXISTS (
          SELECT 1
          FROM ayudas_rstc.parroquias p
          JOIN ayudas_rstc.vicarias v ON v.id = p.vicaria_id
          WHERE v.diocesis_id = p_diocesis_id
            AND p.eliminado_en IS NULL
            AND v.eliminado_en IS NULL
            AND p.id IN (SELECT parroquia_id FROM ayudas_rstc.parroquias_accesibles())
        )
      ELSE false
    END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.usuario_en_alcance(p_usuario_id uuid)
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
    WHERE a.usuario_id = p_usuario_id
      AND a.eliminado_en IS NULL
      AND r.eliminado_en IS NULL
      AND r.codigo <> 'ADMINISTRADOR'
      AND a.vigente_desde <= timezone('utc', now())
      AND (a.vigente_hasta IS NULL OR a.vigente_hasta > timezone('utc', now()))
      AND ayudas_rstc.alcance_territorial_accesible(a.diocesis_id, a.vicaria_id, a.parroquia_id)
  );
$$;

DROP POLICY IF EXISTS sel_personas ON ayudas_rstc.personas;
CREATE POLICY sel_personas ON ayudas_rstc.personas
  FOR SELECT TO authenticated
  USING (
    ayudas_rstc.usuario_actual_es_administrador()
    OR creado_por_usuario_id = ayudas_rstc.usuario_actual_id()
    OR EXISTS (
      SELECT 1
      FROM ayudas_rstc.solicitudes_ayuda s
      WHERE s.persona_solicitante_id = personas.id
        AND s.parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
    )
  );

DROP POLICY IF EXISTS upd_personas ON ayudas_rstc.personas;
CREATE POLICY upd_personas ON ayudas_rstc.personas
  FOR UPDATE TO authenticated
  USING (
    ayudas_rstc.usuario_actual_es_administrador()
    OR creado_por_usuario_id = ayudas_rstc.usuario_actual_id()
    OR EXISTS (
      SELECT 1
      FROM ayudas_rstc.solicitudes_ayuda s
      WHERE s.persona_solicitante_id = personas.id
        AND s.parroquia_receptora_id IN (SELECT p.parroquia_id FROM ayudas_rstc.parroquias_accesibles() p)
    )
  )
  WITH CHECK (true);

DROP POLICY IF EXISTS sel_usuarios ON ayudas_rstc.usuarios;
CREATE POLICY sel_usuarios ON ayudas_rstc.usuarios
  FOR SELECT TO authenticated
  USING (
    id = ayudas_rstc.usuario_actual_id()
    OR ayudas_rstc.usuario_actual_es_administrador()
    OR ayudas_rstc.usuario_en_alcance(id)
  );

DROP POLICY IF EXISTS sel_asignaciones ON ayudas_rstc.asignaciones_usuario;
CREATE POLICY sel_asignaciones ON ayudas_rstc.asignaciones_usuario
  FOR SELECT TO authenticated
  USING (
    usuario_id = ayudas_rstc.usuario_actual_id()
    OR ayudas_rstc.usuario_actual_es_administrador()
    OR ayudas_rstc.usuario_en_alcance(usuario_id)
  );

DROP POLICY IF EXISTS wr_asignaciones ON ayudas_rstc.asignaciones_usuario;
CREATE POLICY wr_asignaciones ON ayudas_rstc.asignaciones_usuario
  FOR ALL TO authenticated
  USING (
    ayudas_rstc.usuario_actual_es_administrador()
    OR (
      ayudas_rstc.usuario_actual_es_coordinador_diocesano()
      AND ayudas_rstc.usuario_en_alcance(usuario_id)
    )
  )
  WITH CHECK (
    ayudas_rstc.usuario_actual_es_administrador()
    OR (
      ayudas_rstc.usuario_actual_es_coordinador_diocesano()
      AND ayudas_rstc.alcance_territorial_accesible(diocesis_id, vicaria_id, parroquia_id)
      AND EXISTS (
        SELECT 1
        FROM ayudas_rstc.roles r
        WHERE r.id = rol_id
          AND r.eliminado_en IS NULL
          AND r.codigo <> 'ADMINISTRADOR'
      )
    )
  );

GRANT EXECUTE ON FUNCTION ayudas_rstc.usuario_actual_es_coordinador_diocesano() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION ayudas_rstc.alcance_territorial_accesible(uuid, uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION ayudas_rstc.usuario_en_alcance(uuid) TO authenticated, service_role;
