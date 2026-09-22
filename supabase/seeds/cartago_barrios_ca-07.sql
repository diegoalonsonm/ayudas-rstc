-- Barrios CA-07 (31 registros). Numeración global automática.
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
  ('245e60d3-d43d-42b6-8aeb-9e3d2a3a7772'::uuid, 'Aguas'),
  ('245e60d3-d43d-42b6-8aeb-9e3d2a3a7772'::uuid, 'Barrionuevo'),
  ('245e60d3-d43d-42b6-8aeb-9e3d2a3a7772'::uuid, 'Boquerón'),
  ('245e60d3-d43d-42b6-8aeb-9e3d2a3a7772'::uuid, 'Capira'),
  ('245e60d3-d43d-42b6-8aeb-9e3d2a3a7772'::uuid, 'Oratorio'),
  ('c4253efe-8d11-42e2-830f-654949c4915e'::uuid, 'Mata de Mora'),
  ('c4253efe-8d11-42e2-830f-654949c4915e'::uuid, 'Paso Ancho'),
  ('c4253efe-8d11-42e2-830f-654949c4915e'::uuid, 'Páez'),
  ('c4253efe-8d11-42e2-830f-654949c4915e'::uuid, 'San Cayetano'),
  ('818a1091-6d39-4bf1-9b20-f90d44d7498c'::uuid, 'Maya'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Alto Cerrillos (Corazón de Jesús)'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Artavia'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Barrial'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Bosque'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Breñas'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Caballo Blanco'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Chircagre'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Flores'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Gamboa'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'José Jesús Méndez'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Juan Pablo II'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Monseñor Sanabria'),
  ('f6b065f6-99dd-4592-aa9a-49c0764b81ad'::uuid, 'Sagrada Familia'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'Cuesta Quemados'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'Pasquí'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'Platanillal'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'San Gerardo'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'San Juan'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'San Martín'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'San Pablo'),
  ('251315e0-7815-48c0-bd88-5f77016a9601'::uuid, 'Titoral')
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
