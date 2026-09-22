-- Barrios CA-02 (45 registros). Numeración global automática.
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
  ('98e9f096-c0d0-4fd8-964f-8495d5c88a21'::uuid, 'Alto Birrisito'),
  ('98e9f096-c0d0-4fd8-964f-8495d5c88a21'::uuid, 'El Carmen'),
  ('98e9f096-c0d0-4fd8-964f-8495d5c88a21'::uuid, 'El Chiral'),
  ('98e9f096-c0d0-4fd8-964f-8495d5c88a21'::uuid, 'La Huerta'),
  ('752c145b-255e-4604-834b-4cbff0ca7b0f'::uuid, 'Cachí'),
  ('80c41afa-f19a-4bd7-b038-890ace137555'::uuid, 'Ayala'),
  ('80c41afa-f19a-4bd7-b038-890ace137555'::uuid, 'Páez'),
  ('80c41afa-f19a-4bd7-b038-890ace137555'::uuid, 'Salvador'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Alegría'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Alto Araya'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Calle Jucó'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Hotel'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Nubes'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Palomas'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Palomo'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Patillos'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Puente Negro'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Purisil'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Queverí'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Río Macho'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'San Rafael'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Sitio'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Tapantí'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Troya'),
  ('c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c'::uuid, 'Villa Mills'),
  ('60cb6b93-b1bc-4f58-8473-23f83192a2fe'::uuid, 'Paraíso'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Acevedo'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Ajenjal'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Arrabará'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Birrís Este'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Cúscares'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'El Yas'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Flor'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Jetatuerta'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Lapuente'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Mesas'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Mesitas'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Nueva Ujarrás'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Pedregal'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Piedra Azul'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Puente Fajardo'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Río Regado'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Sandalia'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Talolinga'),
  ('db846fbf-7091-4c30-8894-42dbf65c1c1c'::uuid, 'Veintiuno de Noviembre')
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
