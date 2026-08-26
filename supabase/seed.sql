-- =============================================================================
-- Semilla LOCAL únicamente (supabase start / supabase db reset).
-- No se aplica en producción con `supabase db push`.
-- Organización de ejemplo para desarrollo. Ajuste nombres si el entorno lo requiere.
-- =============================================================================

BEGIN;

SELECT set_config('app.omitir_auditoria', 'true', true);

INSERT INTO ayudas_rstc.diocesis (id, nombre, codigo)
VALUES (
  ayudas_rstc.uuid_catalogo('seed.diocesis.dev'),
  'Diócesis de desarrollo',
  'DIOCESIS_DEV'
);

INSERT INTO ayudas_rstc.vicarias (id, diocesis_id, nombre, codigo)
VALUES (
  ayudas_rstc.uuid_catalogo('seed.vicaria.dev_norte'),
  ayudas_rstc.uuid_catalogo('seed.diocesis.dev'),
  'Vicaría Norte (desarrollo)',
  'VICARIA_DEV_NORTE'
);

INSERT INTO ayudas_rstc.parroquias (id, vicaria_id, nombre, codigo)
VALUES
  (
    ayudas_rstc.uuid_catalogo('seed.parroquia.dev_centro'),
    ayudas_rstc.uuid_catalogo('seed.vicaria.dev_norte'),
    'Parroquia Centro (desarrollo)',
    'PARROQUIA_DEV_CENTRO'
  ),
  (
    ayudas_rstc.uuid_catalogo('seed.parroquia.dev_norte'),
    ayudas_rstc.uuid_catalogo('seed.vicaria.dev_norte'),
    'Parroquia Norte (desarrollo)',
    'PARROQUIA_DEV_NORTE'
  );

COMMIT;
