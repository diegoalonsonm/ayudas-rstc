-- Barrios CA-04 (28 registros). Numeración global automática.
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
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Alpes'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Buenos Aires'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Caña Real'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Flor de Liz'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Los Recuerdos'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Maravilla'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Naranjito'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'Naranjo'),
  ('6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e'::uuid, 'San Martín'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'Chiz'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'La Laguna'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'La Victoria'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'Los Jovitos'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'Los Mora'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'Pith'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'San Cristóbal'),
  ('9970da14-505c-43c3-87cb-9503e6b8a254'::uuid, 'Santa Elena'),
  ('62fee0cb-8c3f-448c-909d-1ba57f4caeeb'::uuid, 'Pejibaye'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Alto Campos'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Bajo Congo'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Congo'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Duan'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Esperanza'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Hamaca'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Sabanilla'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'San Antonio del Monte'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Volconda'),
  ('272cb757-ffd4-4862-b0a2-479ac1818b43'::uuid, 'Vueltas')
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
