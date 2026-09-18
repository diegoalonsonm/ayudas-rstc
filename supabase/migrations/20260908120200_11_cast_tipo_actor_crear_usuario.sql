-- =============================================================================
-- El CASE de tipo_actor se infiere como text; Postgres no lo convierte al enum.
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

CREATE OR REPLACE FUNCTION ayudas_rstc.crear_usuario_con_asignacion(
  p_nombre_completo text,
  p_correo text,
  p_rol_codigo text,
  p_identidad_autenticacion_id uuid,
  p_diocesis_id uuid DEFAULT NULL,
  p_vicaria_id uuid DEFAULT NULL,
  p_parroquia_id uuid DEFAULT NULL,
  p_motivo text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
DECLARE
  v_actor ayudas_rstc.usuarios%ROWTYPE;
  v_actor_rol text;
  v_nuevo_id uuid;
  v_rol_id uuid;
BEGIN
  SELECT u.*
  INTO v_actor
  FROM ayudas_rstc.usuarios u
  WHERE u.identidad_autenticacion_id = auth.uid()
    AND u.eliminado_en IS NULL
    AND u.activo
  LIMIT 1;

  IF v_actor.id IS NOT NULL AND v_actor.identidad_autenticacion_id = p_identidad_autenticacion_id THEN
    RAISE EXCEPTION 'Ningún usuario puede asignarse a sí mismo otro rol o alcance'
      USING ERRCODE = 'restrict_violation';
  END IF;

  SELECT r.codigo
  INTO v_actor_rol
  FROM ayudas_rstc.asignaciones_usuario a
  JOIN ayudas_rstc.roles r ON r.id = a.rol_id
  WHERE a.usuario_id = v_actor.id
    AND a.eliminado_en IS NULL
    AND r.eliminado_en IS NULL
    AND a.vigente_desde <= timezone('utc', now())
    AND (a.vigente_hasta IS NULL OR a.vigente_hasta > timezone('utc', now()))
  ORDER BY a.creado_en DESC
  LIMIT 1;

  IF v_actor_rol = 'PERSONAL_PASTORAL' AND p_rol_codigo <> 'PERSONAL_PASTORAL' THEN
    RAISE EXCEPTION 'PERSONAL_PASTORAL solo puede crear usuarios PERSONAL_PASTORAL'
      USING ERRCODE = 'restrict_violation';
  ELSIF v_actor_rol = 'COORDINADOR_PARROQUIAL' AND p_rol_codigo <> 'PERSONAL_PASTORAL' THEN
    RAISE EXCEPTION 'COORDINADOR_PARROQUIAL solo puede crear usuarios PERSONAL_PASTORAL'
      USING ERRCODE = 'restrict_violation';
  ELSIF v_actor_rol = 'COORDINADOR_VICARIAL' AND p_rol_codigo <> 'COORDINADOR_PARROQUIAL' THEN
    RAISE EXCEPTION 'COORDINADOR_VICARIAL solo puede crear usuarios COORDINADOR_PARROQUIAL'
      USING ERRCODE = 'restrict_violation';
  ELSIF v_actor_rol = 'COORDINADOR_DIOCESANO' AND p_rol_codigo <> 'COORDINADOR_VICARIAL' THEN
    RAISE EXCEPTION 'COORDINADOR_DIOCESANO solo puede crear usuarios COORDINADOR_VICARIAL'
      USING ERRCODE = 'restrict_violation';
  ELSIF v_actor_rol IS NULL AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'El usuario autenticado no tiene una asignación vigente'
      USING ERRCODE = 'restrict_violation';
  END IF;

  SELECT id INTO v_rol_id
  FROM ayudas_rstc.roles
  WHERE codigo = p_rol_codigo AND eliminado_en IS NULL;

  IF v_rol_id IS NULL THEN
    RAISE EXCEPTION 'Rol desconocido: %', p_rol_codigo
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  INSERT INTO ayudas_rstc.usuarios (
    identidad_autenticacion_id,
    nombre_completo,
    correo,
    creado_por_usuario_id
  ) VALUES (
    p_identidad_autenticacion_id,
    p_nombre_completo,
    lower(btrim(p_correo)),
    v_actor.id
  )
  RETURNING id INTO v_nuevo_id;

  INSERT INTO ayudas_rstc.asignaciones_usuario (
    usuario_id,
    rol_id,
    diocesis_id,
    vicaria_id,
    parroquia_id,
    creado_por_usuario_id
  ) VALUES (
    v_nuevo_id,
    v_rol_id,
    p_diocesis_id,
    p_vicaria_id,
    p_parroquia_id,
    v_actor.id
  );

  INSERT INTO ayudas_rstc.eventos_auditoria (
    usuario_id,
    rol_codigo,
    tipo_actor,
    accion,
    tipo_entidad,
    entidad_id,
    motivo,
    resultado,
    origen
  ) VALUES (
    v_actor.id,
    v_actor_rol,
    CASE WHEN v_actor.id IS NULL THEN 'SISTEMA'::ayudas_rstc.tipo_actor_auditoria
         ELSE 'USUARIO'::ayudas_rstc.tipo_actor_auditoria END,
    'CREAR_USUARIO',
    'usuarios',
    v_nuevo_id,
    p_motivo,
    'EXITOSO'::ayudas_rstc.resultado_auditoria,
    'APLICACION'::ayudas_rstc.origen_auditoria
  );

  RETURN v_nuevo_id;
END;
$$;
