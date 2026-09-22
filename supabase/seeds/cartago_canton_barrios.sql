-- Barrios del cantón Cartago (CA-01), fuente: División territorial (Wikipedia / INEC).
-- Códigos BA-NN únicos en todo el cantón (orden: DI-01..DI-11, luego nombre A-Z).
-- Con más de 99 barrios usar 3 dígitos: BA-001..BA-135.
SET search_path = ayudas_rstc, public;

-- Distritos CA-01 (ids locales)
-- DI-01 f868831b-4b26-4c4a-ac0c-36bd8df06fad Oriental
-- DI-02 6df2d77e-4349-4319-bc24-a39683e8724b Occidental
-- DI-03 8e4a1507-5133-4e1d-bfa1-760ee4ceacb4 El Carmen
-- DI-04 be4f5cab-3219-470f-8972-9abf4fafaba6 San Nicolás
-- DI-05 31ce7c2f-8fc4-4bb8-bd05-a0b568612fae Agua Caliente
-- DI-06 b5879e12-5b3b-4ea6-8e62-3323c5667717 Guadalupe
-- DI-07 c9095207-e17f-45a4-9693-888dbc814dac Corralillo
-- DI-08 7594b6da-eb8e-4494-b0b0-6db036e96ecb Tierra Blanca
-- DI-09 be3841d7-4cd2-470f-b761-cbd53173eecc Dulce Nombre
-- DI-10 4fe02242-d304-42b6-9eb2-de817aa8a83d Llano Grande
-- DI-11 81617b25-7ffe-4935-8db0-972410e4382c Quebradilla

WITH admin AS (
  SELECT '6bf12564-ed1f-4a20-809d-bf6b23e029ad'::uuid AS usuario_id
),
datos (distrito_id, nombre) AS (
  VALUES
  -- Oriental (barrios oficiales)
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad'::uuid, 'Ángeles'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Asís'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Brisas'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Calvario'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Cerrillos'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Corazón de Jesús'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Cortinas'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Cruz de Caravaca'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Estadio'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Galera'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Hospital'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Istarú'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Jesús Jiménez'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Matamoros'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Montelimar'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Puebla'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Residencial Cartago'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Soledad'),
  ('f868831b-4b26-4c4a-ac0c-36bd8df06fad', 'Telles'),
  -- Occidental
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Cinco Esquinas'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Fátima'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Hospital'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Jesús Jiménez'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Laborio'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Molino'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Murillo'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'Palmas'),
  ('6df2d77e-4349-4319-bc24-a39683e8724b', 'San Cayetano'),
  -- El Carmen
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Alpes'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Asilo'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Cruz de Caravaca'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Diques'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Fontana'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Jora'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'López'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'San Blas'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Santa Eduvigis'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Santa Fe'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Solano'),
  ('8e4a1507-5133-4e1d-bfa1-760ee4ceacb4', 'Turbina'),
  -- San Nicolás
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Alto de Ochomogo'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Caracol'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Cooperrosales'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Cruz'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Espinal'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Johnson'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Lima'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Loyola'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Nazareth'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Ochomogo'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Orontes'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Pedregal'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Quircot'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Ronda'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Rosas'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'San Nicolás'),
  ('be4f5cab-3219-470f-8972-9abf4fafaba6', 'Violín'),
  -- Agua Caliente
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Cocorí'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Coronado'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Guayabal'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Hervidero'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'López'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Lourdes'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Padua'),
  ('31ce7c2f-8fc4-4bb8-bd05-a0b568612fae', 'Pitahaya'),
  -- Guadalupe
  ('b5879e12-5b3b-4ea6-8e62-3323c5667717', 'Américas'),
  ('b5879e12-5b3b-4ea6-8e62-3323c5667717', 'Higuerón'),
  ('b5879e12-5b3b-4ea6-8e62-3323c5667717', 'Joya'),
  ('b5879e12-5b3b-4ea6-8e62-3323c5667717', 'Las Palmas'),
  ('b5879e12-5b3b-4ea6-8e62-3323c5667717', 'Marías'),
  -- Corralillo (poblados; no hay barrios formales en fuente)
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Alumbre'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Bajo Amador'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Calle Valverdes'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Guaria'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Hortensia'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Llano Ángeles'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Loma Larga'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Palangana'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Rincón de Abarca'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Río Conejo'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Salitrillo'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'San Antonio'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'San Joaquín'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'San Juan Norte'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'San Juan Sur'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Santa Elena'),
  ('c9095207-e17f-45a4-9693-888dbc814dac', 'Santa Elena Arriba'),
  -- Tierra Blanca
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Calle Lázaro'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Cuesta de Piedra'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'El Alto'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'El Pueblito'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'La Sanabria'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Misión Norte'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Misión Sur'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Ortiga'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Rodeo'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Sabanilla'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Sabanillas'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'San Ramón'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Santa Eduviges'),
  ('7594b6da-eb8e-4494-b0b0-6db036e96ecb', 'Santísima Trinidad'),
  -- Dulce Nombre
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'Caballo Blanco'),
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'Cóncavas'),
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'Dulce Nombre'),
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'Navarro'),
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'Perlas'),
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'Río Claro'),
  ('be3841d7-4cd2-470f-b761-cbd53173eecc', 'San José'),
  -- Llano Grande
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Azahar'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Banderillas'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Boquerón'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Centro'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'La Angelina'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'La Cruz'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'La Laguna'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'La Socola'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'La Trinidad'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Las Pavas'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Los Comunes'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Potrerillos'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Prusia'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Retes'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Rodeo'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Sagrada Familia'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Varillal'),
  ('4fe02242-d304-42b6-9eb2-de817aa8a83d', 'Y Griega'),
  -- Quebradilla (poblados)
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Alto Quebradilla'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Azahar'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Bermejo'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Cañada'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Copalchí'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Coris'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Garita'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Rueda'),
  ('81617b25-7ffe-4935-8db0-972410e4382c', 'Valle Verde')
),
numerados AS (
  SELECT
    d.distrito_id,
    d.nombre,
    'BA-' || lpad(
      row_number() OVER (
        ORDER BY di.codigo, lower(d.nombre)
      )::text,
      3,
      '0'
    ) AS codigo
  FROM datos d
  JOIN ayudas_rstc.distritos di ON di.id = d.distrito_id
)
INSERT INTO ayudas_rstc.barrios (distrito_id, codigo, nombre, creado_por_usuario_id)
SELECT n.distrito_id, n.codigo, n.nombre, a.usuario_id
FROM numerados n
CROSS JOIN admin a
WHERE NOT EXISTS (
  SELECT 1
  FROM ayudas_rstc.barrios b
  WHERE b.codigo = n.codigo
    AND b.eliminado_en IS NULL
);
