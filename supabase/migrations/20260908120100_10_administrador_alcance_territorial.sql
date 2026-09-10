-- =============================================================================
-- ADMINISTRADOR: alcance territorial opcional de un solo nivel.
-- El rol conserva acceso total; diocesis_id, vicaria_id o parroquia_id
-- solo ubican la asignación (no se combinan entre sí).
-- =============================================================================

SET search_path = ayudas_rstc, extensions;

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
    IF (
      (NEW.diocesis_id IS NOT NULL)::int
      + (NEW.vicaria_id IS NOT NULL)::int
      + (NEW.parroquia_id IS NOT NULL)::int
    ) > 1 THEN
      RAISE EXCEPTION
        'El rol ADMINISTRADOR admite a lo sumo un nivel de alcance territorial'
        USING ERRCODE = 'check_violation';
    END IF;
  ELSE
    RAISE EXCEPTION 'Rol no contemplado en las reglas de alcance: %', v_codigo
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;
