-- Barrios CA-06 (14 registros). Numeración global automática.
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
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Bajos de Abarca'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Buena Vista'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Cantarranas'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Capellades'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Coliblanco'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'El Centro'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'El Tronco'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'La Enseñanza'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'La Plaza'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Lourdes'),
  ('6a0723d7-114b-48ff-a2d4-e7c5f7a22759'::uuid, 'Santa Teresa'),
  ('3f89a1c2-2dca-4cd7-b409-c73b971110a2'::uuid, 'Bajo Malanga'),
  ('0e66f4c1-134a-47de-9d01-89093d944f9d'::uuid, 'Lourdes'),
  ('0e66f4c1-134a-47de-9d01-89093d944f9d'::uuid, 'Patalillo')
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
