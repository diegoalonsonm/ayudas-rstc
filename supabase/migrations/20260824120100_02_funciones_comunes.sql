-- =============================================================================
-- 02. Funciones comunes (auditoría de columnas, identificadores, utilidades)
-- =============================================================================

-- Identificadores estables de catálogo entre ambientes (dev/staging/prod).
CREATE OR REPLACE FUNCTION ayudas_rstc.uuid_catalogo(p_clave text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT (
    substr(md5('ayudas-rstc.catalogo.' || p_clave), 1, 8) || '-' ||
    substr(md5('ayudas-rstc.catalogo.' || p_clave), 9, 4) || '-' ||
    '5' || substr(md5('ayudas-rstc.catalogo.' || p_clave), 14, 3) || '-' ||
    'a' || substr(md5('ayudas-rstc.catalogo.' || p_clave), 18, 3) || '-' ||
    substr(md5('ayudas-rstc.catalogo.' || p_clave), 21, 12)
  )::uuid;
$$;

COMMENT ON FUNCTION ayudas_rstc.uuid_catalogo(text) IS
  'UUID determinista para filas de catálogo, reproducible en todos los ambientes.';

CREATE OR REPLACE FUNCTION ayudas_rstc.ahora()
RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
  SELECT clock_timestamp() AT TIME ZONE 'utc';
$$;

-- Mantiene actualizado_en en toda escritura.
CREATE OR REPLACE FUNCTION ayudas_rstc.tocar_actualizado_en()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.actualizado_en := timezone('utc', now());
  RETURN NEW;
END;
$$;

-- eliminado_en es la fuente oficial de borrado lógico; motivo obligatorio.
CREATE OR REPLACE FUNCTION ayudas_rstc.validar_borrado_logico()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.eliminado_en IS NULL THEN
    IF NEW.eliminado_por_usuario_id IS NOT NULL OR NEW.motivo_eliminacion IS NOT NULL THEN
      RAISE EXCEPTION
        'eliminado_por_usuario_id y motivo_eliminacion solo aplican cuando eliminado_en tiene valor'
        USING ERRCODE = 'check_violation';
    END IF;
  ELSE
    IF NEW.motivo_eliminacion IS NULL OR btrim(NEW.motivo_eliminacion) = '' THEN
      RAISE EXCEPTION 'motivo_eliminacion es obligatorio al realizar un borrado lógico'
        USING ERRCODE = 'not_null_violation';
    END IF;
    NEW.motivo_eliminacion := btrim(NEW.motivo_eliminacion);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.impedir_eliminacion_fisica()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION
    'No se permite la eliminación física de %. Use borrado lógico (eliminado_en).',
    TG_TABLE_NAME
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.impedir_modificacion_inmutable()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION
    'La tabla % es inmutable: solo admite inserción.',
    TG_TABLE_NAME
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.enmascarar_datos_sensibles(p_datos jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_claves text[] := ARRAY[
    'numero_documento_cifrado',
    'numero_documento_hash',
    'telefono',
    'senas',
    'correo',
    'identidad_autenticacion_id',
    'identificador_sesion',
    'clave_objeto',
    'suma_verificacion',
    'direccion_ip',
    'agente_usuario'
  ];
  v_clave text;
  v_resultado jsonb;
BEGIN
  IF p_datos IS NULL THEN
    RETURN NULL;
  END IF;

  v_resultado := p_datos;
  FOREACH v_clave IN ARRAY v_claves LOOP
    IF v_resultado ? v_clave THEN
      v_resultado := jsonb_set(v_resultado, ARRAY[v_clave], '"[redactado]"', false);
    END IF;
  END LOOP;

  RETURN v_resultado;
END;
$$;

COMMENT ON FUNCTION ayudas_rstc.enmascarar_datos_sensibles(jsonb) IS
  'Excluye cédulas, teléfonos, claves de objeto y secretos de los JSON de auditoría.';

CREATE OR REPLACE FUNCTION ayudas_rstc.auditar_cambio_fila()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
DECLARE
  v_accion text;
  v_anteriores jsonb;
  v_nuevos jsonb;
  v_campos text[];
  v_usuario_id uuid;
BEGIN
  IF current_setting('app.omitir_auditoria', true) = 'true' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  BEGIN
    SELECT id
    INTO v_usuario_id
    FROM ayudas_rstc.usuarios
    WHERE identidad_autenticacion_id = auth.uid()
      AND eliminado_en IS NULL
    LIMIT 1;
  EXCEPTION
    WHEN undefined_function THEN
      v_usuario_id := NULL;
  END;

  IF TG_OP = 'INSERT' THEN
    v_accion := 'CREAR';
    v_nuevos := ayudas_rstc.enmascarar_datos_sensibles(to_jsonb(NEW));
    v_anteriores := NULL;
    SELECT coalesce(array_agg(key), ARRAY[]::text[])
    INTO v_campos
    FROM jsonb_object_keys(to_jsonb(NEW)) AS key;
  ELSIF TG_OP = 'UPDATE' THEN
    v_anteriores := ayudas_rstc.enmascarar_datos_sensibles(to_jsonb(OLD));
    v_nuevos := ayudas_rstc.enmascarar_datos_sensibles(to_jsonb(NEW));

    SELECT coalesce(array_agg(n.key), ARRAY[]::text[])
    INTO v_campos
    FROM jsonb_each(to_jsonb(NEW)) AS n(key, value)
    JOIN jsonb_each(to_jsonb(OLD)) AS o(key, value) ON o.key = n.key
    WHERE n.value IS DISTINCT FROM o.value;

    IF OLD.eliminado_en IS NULL AND NEW.eliminado_en IS NOT NULL THEN
      v_accion := 'ELIMINAR_LOGICAMENTE';
    ELSIF OLD.eliminado_en IS NOT NULL AND NEW.eliminado_en IS NULL THEN
      v_accion := 'RESTAURAR';
    ELSE
      v_accion := 'ACTUALIZAR';
    END IF;
  ELSE
    RETURN NULL;
  END IF;

  INSERT INTO ayudas_rstc.eventos_auditoria (
    ocurrido_en,
    usuario_id,
    tipo_actor,
    accion,
    tipo_entidad,
    entidad_id,
    datos_anteriores,
    datos_nuevos,
    campos_modificados,
    motivo,
    resultado,
    origen
  ) VALUES (
    timezone('utc', now()),
    v_usuario_id,
    CASE WHEN v_usuario_id IS NULL THEN 'SISTEMA'::ayudas_rstc.tipo_actor_auditoria
         ELSE 'USUARIO'::ayudas_rstc.tipo_actor_auditoria END,
    v_accion,
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    v_anteriores,
    v_nuevos,
    v_campos,
    CASE WHEN TG_OP = 'UPDATE' THEN NEW.motivo_eliminacion ELSE NULL END,
    'EXITOSO',
    'APLICACION'
  );

  RETURN NEW;
END;
$$;

-- Recorta espacios en sector_oficial antes de persistir.
CREATE OR REPLACE FUNCTION ayudas_rstc.normalizar_sector_oficial()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.sector_oficial IS NOT NULL THEN
    NEW.sector_oficial := NULLIF(btrim(NEW.sector_oficial), '');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE PROCEDURE ayudas_rstc.registrar_tabla_operativa(p_tabla text)
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER %I
       BEFORE INSERT OR UPDATE ON ayudas_rstc.%I
       FOR EACH ROW
       EXECUTE FUNCTION ayudas_rstc.validar_borrado_logico()',
    'trg_' || p_tabla || '_validar_borrado', p_tabla
  );

  EXECUTE format(
    'CREATE TRIGGER %I
       BEFORE UPDATE ON ayudas_rstc.%I
       FOR EACH ROW
       EXECUTE FUNCTION ayudas_rstc.tocar_actualizado_en()',
    'trg_' || p_tabla || '_actualizado_en', p_tabla
  );

  EXECUTE format(
    'CREATE TRIGGER %I
       BEFORE DELETE ON ayudas_rstc.%I
       FOR EACH ROW
       EXECUTE FUNCTION ayudas_rstc.impedir_eliminacion_fisica()',
    'trg_' || p_tabla || '_impedir_delete', p_tabla
  );

  EXECUTE format(
    'CREATE TRIGGER %I
       AFTER INSERT OR UPDATE ON ayudas_rstc.%I
       FOR EACH ROW
       EXECUTE FUNCTION ayudas_rstc.auditar_cambio_fila()',
    'trg_' || p_tabla || '_auditoria', p_tabla
  );
END;
$$;
