-- Barrios CA-05 (77 registros). Numeración global automática.
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
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Carolina'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Chirripó Abajo'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Chirripó Arriba'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Damaris'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Fortuna'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Jekui'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Moravia'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Namaldí'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Pacuare arriba'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Paso Marcos'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Playa Hermosa'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Porvenir'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Quetzal'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Raíz de Hule'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Río Blanco'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Santubal'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Surí'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Tsipiri (Platanillo)'),
  ('9fb53728-266c-4747-ac41-523aeea2f7f6'::uuid, 'Vereh'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'Alto de Varas (Alto Varal)'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'Azul'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'Guayabo'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'Jesús María'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'La Isabel'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'San Martín'),
  ('b27c106c-3d66-442b-a393-13b69f142a11'::uuid, 'Ánimas'),
  ('f035529d-80b0-4552-b31e-815b1442c65c'::uuid, 'Leona'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Angostura'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Buenavista'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Bóveda'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Chitaría'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Eslabón'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Isla Bonita'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Jabillos'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'San Rafael'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Sitio Mata'),
  ('fe810925-6ca9-4ec4-9e5c-9d9846873398'::uuid, 'Yama'),
  ('bedf908d-0ebc-479d-a594-0cf05a38ad88'::uuid, 'El Seis'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Bajos de Bonilla'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Bolsón'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Bonilla'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Buenos Aires'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Calle Vargas'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Carmen'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Esperanza'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Guayabo Arriba'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'La Central'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'La Fuente'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Pastora'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Picada'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Raicero'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Reunión'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'San Antonio'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'San Diego'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'San Rafael'),
  ('677d3406-17c9-4d58-b35e-3b8dab632a35'::uuid, 'Torito'),
  ('94ca3e12-dadb-40fc-b0f1-d60cd391f8da'::uuid, 'Aquiares'),
  ('94ca3e12-dadb-40fc-b0f1-d60cd391f8da'::uuid, 'Bolsón'),
  ('94ca3e12-dadb-40fc-b0f1-d60cd391f8da'::uuid, 'Carmen'),
  ('94ca3e12-dadb-40fc-b0f1-d60cd391f8da'::uuid, 'Río Claro'),
  ('94ca3e12-dadb-40fc-b0f1-d60cd391f8da'::uuid, 'Verbena Norte'),
  ('94ca3e12-dadb-40fc-b0f1-d60cd391f8da'::uuid, 'Verbena Sur'),
  ('e4d7ec31-c214-4d5f-8db4-dca3b57fcb0f'::uuid, 'Cooperativa'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Bajo Pacuare (sur)'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Dos Amigos'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Dulce Nombre'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Guineal'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Jicotea'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Mina'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Morado'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Quebradas'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'San Martín'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'San Rafael'),
  ('80ca0a43-1849-4edf-985d-537d1955bf44'::uuid, 'Tacotal'),
  ('c5e5ecca-2f6f-4d95-a195-1535bd16e7c4'::uuid, 'Tres Equis'),
  ('c770bece-47ad-43ff-bfb6-48877067dae1'::uuid, 'Tuis'),
  ('466c9774-7827-4a99-8403-aefbbcfe4230'::uuid, 'Turrialba')
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
