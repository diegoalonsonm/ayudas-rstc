-- Códigos BA-* únicos a nivel provincial (no por distrito).
-- Índice de búsqueda por distrito tras retirar la unicidad compuesta.

DROP INDEX IF EXISTS ayudas_rstc.uq_barrios_codigo_activos;

CREATE UNIQUE INDEX uq_barrios_codigo_global
  ON ayudas_rstc.barrios (codigo)
  WHERE eliminado_en IS NULL;

CREATE INDEX IF NOT EXISTS idx_barrios_distrito_id_activos
  ON ayudas_rstc.barrios (distrito_id)
  WHERE eliminado_en IS NULL;

-- Artefacto de Wikipedia; el distrito ya tiene barrios reales catalogados.
UPDATE ayudas_rstc.barrios
SET
  eliminado_en = timezone('utc', now()),
  eliminado_por_usuario_id = '6bf12564-ed1f-4a20-809d-bf6b23e029ad'::uuid,
  motivo_eliminacion = 'Entrada inválida: nombre meta de Wikipedia, no barrio'
WHERE codigo = 'BA-195'
  AND nombre = 'Distrito San Juan'
  AND eliminado_en IS NULL;
