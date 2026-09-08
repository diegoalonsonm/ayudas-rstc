-- =============================================================================
-- Códigos internos de organización (no UUID).
-- Si no se envía codigo al insertar, la BD asigna:
--   diócesis  D01
--   vicaría   D01-V01
--   parroquia D01-V01-P001
-- Un codigo explícito se respeta (p. ej. un código institucional futuro).
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

CREATE OR REPLACE FUNCTION ayudas_rstc.formatear_secuencia(p_n integer, p_ancho integer)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lpad(p_n::text, GREATEST(p_ancho, length(p_n::text)), '0');
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.siguiente_secuencia_codigo(
  p_codigos text[],
  p_prefijo text
)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_codigo text;
  v_sufijo text;
  v_max integer := 0;
  v_n integer;
BEGIN
  IF p_codigos IS NULL THEN
    RETURN 1;
  END IF;

  FOREACH v_codigo IN ARRAY p_codigos LOOP
    IF v_codigo IS NULL THEN
      CONTINUE;
    END IF;
    IF left(v_codigo, length(p_prefijo)) = p_prefijo THEN
      v_sufijo := substring(v_codigo FROM length(p_prefijo) + 1);
      IF v_sufijo ~ '^[0-9]+$' THEN
        v_n := v_sufijo::int;
        IF v_n > v_max THEN
          v_max := v_n;
        END IF;
      END IF;
    END IF;
  END LOOP;

  RETURN v_max + 1;
END;
$$;

CREATE OR REPLACE FUNCTION ayudas_rstc.asignar_codigo_organizacion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ayudas_rstc
AS $$
DECLARE
  v_prefijo text;
  v_n integer;
  v_codigos text[];
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.codigo IS NULL OR btrim(NEW.codigo) = '' THEN
      NEW.codigo := OLD.codigo;
    ELSE
      NEW.codigo := btrim(NEW.codigo);
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.codigo IS NOT NULL AND btrim(NEW.codigo) <> '' THEN
    NEW.codigo := btrim(NEW.codigo);
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'diocesis' THEN
    PERFORM pg_advisory_xact_lock(91, hashtext('codigo_diocesis'));
    SELECT coalesce(array_agg(codigo), ARRAY[]::text[])
    INTO v_codigos
    FROM ayudas_rstc.diocesis;
    v_n := ayudas_rstc.siguiente_secuencia_codigo(v_codigos, 'D');
    NEW.codigo := 'D' || ayudas_rstc.formatear_secuencia(v_n, 2);

  ELSIF TG_TABLE_NAME = 'vicarias' THEN
    PERFORM pg_advisory_xact_lock(91, hashtext('codigo_vicaria:' || NEW.diocesis_id::text));

    SELECT codigo INTO v_prefijo
    FROM ayudas_rstc.diocesis
    WHERE id = NEW.diocesis_id;

    IF v_prefijo IS NULL THEN
      RAISE EXCEPTION 'No se puede generar codigo de vicaría: la diócesis % no existe', NEW.diocesis_id
        USING ERRCODE = 'foreign_key_violation';
    END IF;

    SELECT coalesce(array_agg(codigo), ARRAY[]::text[])
    INTO v_codigos
    FROM ayudas_rstc.vicarias
    WHERE diocesis_id = NEW.diocesis_id;

    v_n := ayudas_rstc.siguiente_secuencia_codigo(v_codigos, v_prefijo || '-V');
    NEW.codigo := v_prefijo || '-V' || ayudas_rstc.formatear_secuencia(v_n, 2);

  ELSIF TG_TABLE_NAME = 'parroquias' THEN
    PERFORM pg_advisory_xact_lock(91, hashtext('codigo_parroquia:' || NEW.vicaria_id::text));

    SELECT codigo INTO v_prefijo
    FROM ayudas_rstc.vicarias
    WHERE id = NEW.vicaria_id;

    IF v_prefijo IS NULL THEN
      RAISE EXCEPTION 'No se puede generar codigo de parroquia: la vicaría % no existe', NEW.vicaria_id
        USING ERRCODE = 'foreign_key_violation';
    END IF;

    SELECT coalesce(array_agg(codigo), ARRAY[]::text[])
    INTO v_codigos
    FROM ayudas_rstc.parroquias
    WHERE vicaria_id = NEW.vicaria_id;

    v_n := ayudas_rstc.siguiente_secuencia_codigo(v_codigos, v_prefijo || '-P');
    NEW.codigo := v_prefijo || '-P' || ayudas_rstc.formatear_secuencia(v_n, 3);

  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION ayudas_rstc.asignar_codigo_organizacion() IS
  'Asigna codigo interno D01 / D01-V01 / D01-V01-P001 cuando no se envía uno explícito.';

DROP TRIGGER IF EXISTS trg_diocesis_asignar_codigo ON ayudas_rstc.diocesis;
CREATE TRIGGER trg_diocesis_asignar_codigo
  BEFORE INSERT OR UPDATE OF codigo ON ayudas_rstc.diocesis
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.asignar_codigo_organizacion();

DROP TRIGGER IF EXISTS trg_vicarias_asignar_codigo ON ayudas_rstc.vicarias;
CREATE TRIGGER trg_vicarias_asignar_codigo
  BEFORE INSERT OR UPDATE OF codigo ON ayudas_rstc.vicarias
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.asignar_codigo_organizacion();

DROP TRIGGER IF EXISTS trg_parroquias_asignar_codigo ON ayudas_rstc.parroquias;
CREATE TRIGGER trg_parroquias_asignar_codigo
  BEFORE INSERT OR UPDATE OF codigo ON ayudas_rstc.parroquias
  FOR EACH ROW
  EXECUTE FUNCTION ayudas_rstc.asignar_codigo_organizacion();

COMMENT ON COLUMN ayudas_rstc.diocesis.codigo IS
  'Código interno de control. Lo asigna la BD (D01, D02, …) si no se indica.';
COMMENT ON COLUMN ayudas_rstc.vicarias.codigo IS
  'Código interno de control. Lo asigna la BD ({diócesis}-V01) si no se indica.';
COMMENT ON COLUMN ayudas_rstc.parroquias.codigo IS
  'Código interno de control. Lo asigna la BD ({vicaría}-P001) si no se indica.';

GRANT EXECUTE ON FUNCTION ayudas_rstc.formatear_secuencia(integer, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION ayudas_rstc.siguiente_secuencia_codigo(text[], text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION ayudas_rstc.asignar_codigo_organizacion() TO authenticated, service_role;
