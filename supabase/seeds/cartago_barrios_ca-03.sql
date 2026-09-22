-- Barrios CA-03 (50 registros). Numeración global automática.
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
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Cima'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Cuadrante'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Lirios'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Llanos de Concepción'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Los Ángeles'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Naranjal'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Poró'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'Salitrillo'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'San Francisco'),
  ('a8124955-960a-4771-8894-13175d4110ba'::uuid, 'San Josecito'),
  ('3cc0e605-84c5-4d70-9c5b-20b37ab5ef04'::uuid, 'Alto del Carmen'),
  ('3cc0e605-84c5-4d70-9c5b-20b37ab5ef04'::uuid, 'Tirrá'),
  ('3e778eb0-5fb0-4cca-b8f6-8b44282a6ab6'::uuid, 'Condominio Ayarco Boulevard'),
  ('3e778eb0-5fb0-4cca-b8f6-8b44282a6ab6'::uuid, 'Lindavista (Loma Gobierno)'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Eulalia'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Florencio del Castillo'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Jirales'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Omega'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Paso Real'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Tacora'),
  ('04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5'::uuid, 'Villas de Florencia'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Araucarias'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Colinas de Montealegre'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Danza del Sol'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Hacienda Sacramento y Hacienda Imperial'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Herrán'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Loma Verde'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Monserrat'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Montufar'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Terracafe'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Terralta'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Unión'),
  ('42d9ace5-4205-46ae-8c4e-eeea995a7f9a'::uuid, 'Villas de Ayarco'),
  ('7b77a1fd-3128-480b-875a-2071fb6d04cc'::uuid, 'Carpintera'),
  ('7b77a1fd-3128-480b-875a-2071fb6d04cc'::uuid, 'Pilarica'),
  ('7b77a1fd-3128-480b-875a-2071fb6d04cc'::uuid, 'San Miguel'),
  ('7b77a1fd-3128-480b-875a-2071fb6d04cc'::uuid, 'San Vicente'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'Bellomonte'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'Cumbres'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'El Cerrito'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'Holandés'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'Mansiones'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'Montaña Rusa'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'Naranjal'),
  ('076895ee-167d-43df-ad5b-eed5c08e61c4'::uuid, 'San Josecito'),
  ('e1521d69-4219-475e-9840-27224ec6c76f'::uuid, 'La Antigua'),
  ('e1521d69-4219-475e-9840-27224ec6c76f'::uuid, 'La Carpintera'),
  ('e1521d69-4219-475e-9840-27224ec6c76f'::uuid, 'La Cruz'),
  ('e1521d69-4219-475e-9840-27224ec6c76f'::uuid, 'Villas')
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
