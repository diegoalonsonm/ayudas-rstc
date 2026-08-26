-- =============================================================================
-- 05. Triggers y reglas de negocio exigidas en base de datos
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

-- Tablas operativas y de catálogo: borrado lógico, touch, anti-DELETE, auditoría.
DO $$
DECLARE
  v_tabla text;
  v_tablas text[] := ARRAY[
    'diocesis', 'vicarias', 'parroquias', 'roles', 'usuarios', 'asignaciones_usuario',
    'tipos_documento', 'cantones', 'distritos', 'barrios', 'personas', 'direcciones',
    'sexos', 'grados_academicos', 'parentescos', 'rangos_ingreso',
    'tipos_vivienda', 'tipos_tenencia', 'condiciones_vivienda', 'tipos_ayuda',
    'solicitudes_ayuda', 'integrantes_convivencia', 'evaluaciones_vivienda',
    'ayudas_solicitadas', 'planes_ayuda', 'detalles_plan_ayuda', 'entregas_ayuda',
    'documentos_consentimiento'
  ];
BEGIN
  FOREACH v_tabla IN ARRAY v_tablas LOOP
    CALL ayudas_rstc.registrar_tabla_operativa(v_tabla);
  END LOOP;
END;
$$;

-- Tablas inmutables: ni UPDATE ni DELETE.
CREATE TRIGGER trg_historial_estados_solicitud_inmutable_upd
  BEFORE UPDATE ON ayudas_rstc.historial_estados_solicitud
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.impedir_modificacion_inmutable();

CREATE TRIGGER trg_historial_estados_solicitud_inmutable_del
  BEFORE DELETE ON ayudas_rstc.historial_estados_solicitud
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.impedir_modificacion_inmutable();

CREATE TRIGGER trg_eventos_auditoria_inmutable_upd
  BEFORE UPDATE ON ayudas_rstc.eventos_auditoria
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.impedir_modificacion_inmutable();

CREATE TRIGGER trg_eventos_auditoria_inmutable_del
  BEFORE DELETE ON ayudas_rstc.eventos_auditoria
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.impedir_modificacion_inmutable();

CREATE TRIGGER trg_solicitudes_sector_oficial
  BEFORE INSERT OR UPDATE OF sector_oficial ON ayudas_rstc.solicitudes_ayuda
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.normalizar_sector_oficial();

-- Numeración de solicitudes: RSTC-YYYY-000001
CREATE OR REPLACE FUNCTION ayudas_rstc.asignar_numero_solicitud()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.numero_solicitud IS NULL OR btrim(NEW.numero_solicitud) = '' THEN
    NEW.numero_solicitud := format(
      'RSTC-%s-%s',
      to_char(timezone('utc', now()), 'YYYY'),
      lpad(nextval('ayudas_rstc.solicitudes_ayuda_numero_seq')::text, 6, '0')
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_solicitudes_numero
  BEFORE INSERT ON ayudas_rstc.solicitudes_ayuda
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.asignar_numero_solicitud();

-- Historial de estados: se escribe en la misma transacción que el cambio.
CREATE OR REPLACE FUNCTION ayudas_rstc.registrar_historial_estado_solicitud()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
DECLARE
  v_usuario_id uuid;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.estado IS NOT DISTINCT FROM OLD.estado THEN
    RETURN NEW;
  END IF;

  BEGIN
    SELECT id INTO v_usuario_id
    FROM ayudas_rstc.usuarios
    WHERE identidad_autenticacion_id = auth.uid()
      AND eliminado_en IS NULL
    LIMIT 1;
  EXCEPTION
    WHEN undefined_function THEN
      v_usuario_id := COALESCE(NEW.actualizado_por_usuario_id, NEW.creado_por_usuario_id);
  END;

  INSERT INTO ayudas_rstc.historial_estados_solicitud (
    solicitud_ayuda_id,
    estado_anterior,
    estado_nuevo,
    motivo,
    usuario_responsable_id,
    ocurrido_en
  ) VALUES (
    NEW.id,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.estado END,
    NEW.estado,
    CASE
      WHEN TG_OP = 'UPDATE' AND NEW.estado IS DISTINCT FROM OLD.estado
        THEN COALESCE(NEW.motivo_eliminacion, NEW.observaciones)
      ELSE NULL
    END,
    COALESCE(v_usuario_id, NEW.actualizado_por_usuario_id, NEW.creado_por_usuario_id),
    timezone('utc', now())
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_solicitudes_historial_insert
  AFTER INSERT ON ayudas_rstc.solicitudes_ayuda
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.registrar_historial_estado_solicitud();

CREATE TRIGGER trg_solicitudes_historial_update
  AFTER UPDATE OF estado ON ayudas_rstc.solicitudes_ayuda
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.registrar_historial_estado_solicitud();

-- Alcance exacto según el rol.
CREATE OR REPLACE FUNCTION ayudas_rstc.validar_alcance_asignacion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_codigo text;
BEGIN
  SELECT codigo INTO v_codigo
  FROM ayudas_rstc.roles
  WHERE id = NEW.rol_id;

  IF v_codigo IS NULL THEN
    RAISE EXCEPTION 'El rol de la asignación no existe'
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF v_codigo IN ('PERSONAL_PASTORAL', 'COORDINADOR_PARROQUIAL') THEN
    IF NEW.parroquia_id IS NULL OR NEW.vicaria_id IS NOT NULL OR NEW.diocesis_id IS NOT NULL THEN
      RAISE EXCEPTION
        'El rol % requiere parroquia_id y no admite vicaria_id ni diocesis_id',
        v_codigo
        USING ERRCODE = 'check_violation';
    END IF;
  ELSIF v_codigo = 'COORDINADOR_VICARIAL' THEN
    IF NEW.vicaria_id IS NULL OR NEW.parroquia_id IS NOT NULL OR NEW.diocesis_id IS NOT NULL THEN
      RAISE EXCEPTION
        'El rol COORDINADOR_VICARIAL requiere vicaria_id y no admite parroquia_id ni diocesis_id'
        USING ERRCODE = 'check_violation';
    END IF;
  ELSIF v_codigo = 'COORDINADOR_DIOCESANO' THEN
    IF NEW.diocesis_id IS NULL OR NEW.vicaria_id IS NOT NULL OR NEW.parroquia_id IS NOT NULL THEN
      RAISE EXCEPTION
        'El rol COORDINADOR_DIOCESANO requiere diocesis_id y no admite vicaria_id ni parroquia_id'
        USING ERRCODE = 'check_violation';
    END IF;
  ELSIF v_codigo = 'ADMINISTRADOR' THEN
    IF NEW.diocesis_id IS NOT NULL OR NEW.vicaria_id IS NOT NULL OR NEW.parroquia_id IS NOT NULL THEN
      RAISE EXCEPTION
        'El rol ADMINISTRADOR no admite alcance territorial'
        USING ERRCODE = 'check_violation';
    END IF;
  ELSE
    RAISE EXCEPTION 'Rol no contemplado en las reglas de alcance: %', v_codigo
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_asignaciones_alcance
  BEFORE INSERT OR UPDATE ON ayudas_rstc.asignaciones_usuario
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.validar_alcance_asignacion();

-- Estados vigentes para la regla de no superposición de necesidades.
CREATE OR REPLACE FUNCTION ayudas_rstc.es_estado_solicitud_vigente(p_estado ayudas_rstc.estado_solicitud)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p_estado IN ('PRESENTADA', 'EN_REVISION', 'APROBADA', 'ACTIVA');
$$;

-- Bloqueo transaccional por persona (evita dos parroquias concurrentes).
CREATE OR REPLACE FUNCTION ayudas_rstc.bloquear_persona_solicitante(p_persona_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_persona_id IS NULL THEN
    RAISE EXCEPTION 'persona_solicitante_id es obligatorio para validar tipos de ayuda'
      USING ERRCODE = 'not_null_violation';
  END IF;
  PERFORM pg_advisory_xact_lock(87, hashtext(p_persona_id::text));
END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.validar_no_superposicion_tipos_ayuda(
  p_persona_id uuid,
  p_solicitud_id uuid,
  p_tipos_ayuda uuid[]
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_tipo uuid;
  v_otra uuid;
BEGIN
  IF p_tipos_ayuda IS NULL OR cardinality(p_tipos_ayuda) = 0 THEN
    RETURN;
  END IF;

  PERFORM ayudas_rstc.bloquear_persona_solicitante(p_persona_id);

  SELECT a.tipo_ayuda_id, s.id
  INTO v_tipo, v_otra
  FROM ayudas_rstc.ayudas_solicitadas a
  INNER JOIN ayudas_rstc.solicitudes_ayuda s ON s.id = a.solicitud_ayuda_id
  WHERE s.persona_solicitante_id = p_persona_id
    AND s.eliminado_en IS NULL
    AND a.eliminado_en IS NULL
    AND ayudas_rstc.es_estado_solicitud_vigente(s.estado)
    AND (p_solicitud_id IS NULL OR s.id <> p_solicitud_id)
    AND a.tipo_ayuda_id = ANY (p_tipos_ayuda)
  LIMIT 1;

  IF v_tipo IS NOT NULL THEN
    RAISE EXCEPTION
      'La persona ya tiene un proceso vigente (%) para el mismo tipo de ayuda',
      v_otra
      USING ERRCODE = 'unique_violation',
            HINT = 'Solo puede abrir otra solicitud si el tipo de necesidad es distinto.';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.tipos_ayuda_de_solicitud(p_solicitud_id uuid)
RETURNS uuid[]
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(array_agg(tipo_ayuda_id), ARRAY[]::uuid[])
  FROM ayudas_rstc.ayudas_solicitadas
  WHERE solicitud_ayuda_id = p_solicitud_id
    AND eliminado_en IS NULL;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.trg_validar_superposicion_ayuda_solicitada()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_solicitud ayudas_rstc.solicitudes_ayuda%ROWTYPE;
  v_tipo uuid;
BEGIN
  IF NEW.eliminado_en IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT * INTO v_solicitud
  FROM ayudas_rstc.solicitudes_ayuda
  WHERE id = NEW.solicitud_ayuda_id;

  IF NOT ayudas_rstc.es_estado_solicitud_vigente(v_solicitud.estado) THEN
    RETURN NEW;
  END IF;

  v_tipo := NEW.tipo_ayuda_id;
  PERFORM ayudas_rstc.validar_no_superposicion_tipos_ayuda(
    v_solicitud.persona_solicitante_id,
    v_solicitud.id,
    ARRAY[v_tipo]
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ayudas_solicitadas_superposicion
  BEFORE INSERT OR UPDATE OF tipo_ayuda_id, solicitud_ayuda_id, eliminado_en
  ON ayudas_rstc.ayudas_solicitadas
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.trg_validar_superposicion_ayuda_solicitada();

CREATE OR REPLACE FUNCTION ayudas_rstc.trg_validar_superposicion_cambio_estado()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.eliminado_en IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF ayudas_rstc.es_estado_solicitud_vigente(NEW.estado)
     AND (
       TG_OP = 'INSERT'
       OR OLD.estado IS DISTINCT FROM NEW.estado
       OR OLD.persona_solicitante_id IS DISTINCT FROM NEW.persona_solicitante_id
     )
  THEN
    PERFORM ayudas_rstc.validar_no_superposicion_tipos_ayuda(
      NEW.persona_solicitante_id,
      NEW.id,
      ayudas_rstc.tipos_ayuda_de_solicitud(NEW.id)
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_solicitudes_superposicion
  BEFORE INSERT OR UPDATE OF estado, persona_solicitante_id, eliminado_en
  ON ayudas_rstc.solicitudes_ayuda
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.trg_validar_superposicion_cambio_estado();

-- API transaccional recomendada para crear solicitud + tipos de ayuda.
CREATE OR REPLACE FUNCTION ayudas_rstc.registrar_solicitud_con_ayudas(
  p_persona_solicitante_id uuid,
  p_parroquia_receptora_id uuid,
  p_sector_oficial text,
  p_usuario_entrevistador_id uuid,
  p_fecha_entrevista date,
  p_fecha_visita date,
  p_observaciones text,
  p_tipos_ayuda uuid[],
  p_detalles text[] DEFAULT NULL,
  p_estado ayudas_rstc.estado_solicitud DEFAULT 'BORRADOR',
  p_creado_por_usuario_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
DECLARE
  v_id uuid;
  v_i integer;
BEGIN
  PERFORM ayudas_rstc.bloquear_persona_solicitante(p_persona_solicitante_id);

  IF ayudas_rstc.es_estado_solicitud_vigente(p_estado) THEN
    PERFORM ayudas_rstc.validar_no_superposicion_tipos_ayuda(
      p_persona_solicitante_id,
      NULL,
      p_tipos_ayuda
    );
  END IF;

  INSERT INTO ayudas_rstc.solicitudes_ayuda (
    persona_solicitante_id,
    parroquia_receptora_id,
    sector_oficial,
    usuario_entrevistador_id,
    fecha_entrevista,
    fecha_visita,
    estado,
    observaciones,
    presentada_en,
    creado_por_usuario_id
  ) VALUES (
    p_persona_solicitante_id,
    p_parroquia_receptora_id,
    p_sector_oficial,
    p_usuario_entrevistador_id,
    p_fecha_entrevista,
    p_fecha_visita,
    p_estado,
    p_observaciones,
    CASE WHEN p_estado = 'PRESENTADA' THEN timezone('utc', now()) ELSE NULL END,
    p_creado_por_usuario_id
  )
  RETURNING id INTO v_id;

  IF p_tipos_ayuda IS NOT NULL THEN
    FOR v_i IN 1 .. cardinality(p_tipos_ayuda) LOOP
      INSERT INTO ayudas_rstc.ayudas_solicitadas (
        solicitud_ayuda_id,
        tipo_ayuda_id,
        detalle,
        creado_por_usuario_id
      ) VALUES (
        v_id,
        p_tipos_ayuda[v_i],
        CASE WHEN p_detalles IS NOT NULL AND v_i <= cardinality(p_detalles)
             THEN p_detalles[v_i] ELSE NULL END,
        p_creado_por_usuario_id
      );
    END LOOP;
  END IF;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION ayudas_rstc.registrar_solicitud_con_ayudas IS
  'Inserta la solicitud y sus tipos de ayuda en una sola transacción, con bloqueo por persona.';

-- Detección interparroquial: solo lo necesario para saber si hay proceso vigente.
CREATE OR REPLACE FUNCTION ayudas_rstc.consultar_procesos_vigentes_persona(
  p_numero_documento_hash text
)
RETURNS TABLE (
  persona_id uuid,
  solicitud_id uuid,
  numero_solicitud text,
  estado ayudas_rstc.estado_solicitud,
  tipo_ayuda_codigo text,
  tipo_ayuda_nombre text,
  parroquia_nombre text,
  vicaria_nombre text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
  SELECT
    p.id,
    s.id,
    s.numero_solicitud,
    s.estado,
    t.codigo,
    t.nombre,
    par.nombre,
    v.nombre
  FROM ayudas_rstc.personas p
  INNER JOIN ayudas_rstc.solicitudes_ayuda s
    ON s.persona_solicitante_id = p.id AND s.eliminado_en IS NULL
  INNER JOIN ayudas_rstc.ayudas_solicitadas a
    ON a.solicitud_ayuda_id = s.id AND a.eliminado_en IS NULL
  INNER JOIN ayudas_rstc.tipos_ayuda t
    ON t.id = a.tipo_ayuda_id AND t.eliminado_en IS NULL
  INNER JOIN ayudas_rstc.parroquias par
    ON par.id = s.parroquia_receptora_id
  INNER JOIN ayudas_rstc.vicarias v
    ON v.id = par.vicaria_id
  WHERE p.eliminado_en IS NULL
    AND p.numero_documento_hash = p_numero_documento_hash
    AND ayudas_rstc.es_estado_solicitud_vigente(s.estado);
$$;

COMMENT ON FUNCTION ayudas_rstc.consultar_procesos_vigentes_persona(text) IS
  'Búsqueda interparroquial limitada: no devuelve expediente, cédula ni teléfono.';

-- Creación de usuario y asignación en una sola transacción.
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
    CASE WHEN v_actor.id IS NULL THEN 'SISTEMA' ELSE 'USUARIO' END,
    'CREAR_USUARIO',
    'usuarios',
    v_nuevo_id,
    p_motivo,
    'EXITOSO',
    'APLICACION'
  );

  RETURN v_nuevo_id;
END;
$$;
