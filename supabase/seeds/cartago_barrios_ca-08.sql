-- Barrios CA-08 (13 registros). Numeración global automática.
SET search_path = ayudas_rstc, public;

WITH admin AS (
  SELECT '6bf12564-ed1f-4a20-809d-bf6b23e029ad'::uuid AS usuario_id
),
base AS (
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(codigo FROM 4) AS INTEGER)),
    0
  ) AS offset
  FROM ayudas_rstc.barrios
  WHERE eliminado_en IS NULL AND codigo ~ '^BA-[0-9]+$'
),
datos (distrito_id, nombre) AS (
  VALUES
  ('3273e0b3-cf53-42da-9fb3-ee735a2ba2b7'::uuid, 'El Tejar'),
  ('0335fa2d-45c1-4273-9f08-a9573daa210e'::uuid, 'Bajo Zopilote'),
  ('0335fa2d-45c1-4273-9f08-a9573daa210e'::uuid, 'Caragral'),
  ('0335fa2d-45c1-4273-9f08-a9573daa210e'::uuid, 'Común'),
  ('563cb937-4669-49f9-9ad4-ad27b523d7d2'::uuid, 'Guatuso'),
  ('563cb937-4669-49f9-9ad4-ad27b523d7d2'::uuid, 'Higuito'),
  ('563cb937-4669-49f9-9ad4-ad27b523d7d2'::uuid, 'Potrerillos'),
  ('3e66325c-815e-4625-9e56-2b053d5895a6'::uuid, 'Achiotillo'),
  ('3e66325c-815e-4625-9e56-2b053d5895a6'::uuid, 'Barrancas'),
  ('3e66325c-815e-4625-9e56-2b053d5895a6'::uuid, 'Bodocal'),
  ('3e66325c-815e-4625-9e56-2b053d5895a6'::uuid, 'Garita'),
  ('3e66325c-815e-4625-9e56-2b053d5895a6'::uuid, 'Purires'),
  ('3e66325c-815e-4625-9e56-2b053d5895a6'::uuid, 'Tablón')
),
numerados AS (
  SELECT
    d.distrito_id,
    d.nombre,
    'BA-' || lpad(
      (b.offset + row_number() OVER (
        ORDER BY c.codigo, di.codigo, lower(d.nombre)
      ))::text,
      3,
      '0'
    ) AS codigo
  FROM datos d
  JOIN ayudas_rstc.distritos di ON di.id = d.distrito_id
  JOIN ayudas_rstc.cantones c ON c.id = di.canton_id
  CROSS JOIN base b
)
INSERT INTO ayudas_rstc.barrios (distrito_id, codigo, nombre, creado_por_usuario_id)
SELECT n.distrito_id, n.codigo, n.nombre, a.usuario_id
FROM numerados n
CROSS JOIN admin a
WHERE NOT EXISTS (
  SELECT 1 FROM ayudas_rstc.barrios b
  WHERE b.codigo = n.codigo AND b.eliminado_en IS NULL
);
