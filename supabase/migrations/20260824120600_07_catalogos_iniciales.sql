-- =============================================================================
-- 07. Catálogos institucionales
-- Van en migración (no en seed.sql) porque producción los necesita.
-- IDs deterministas vía uuid_catalogo() para que coincidan entre ambientes.
-- =============================================================================

SET search_path = ayudas_rstc, extensions;
SELECT set_config('app.omitir_auditoria', 'true', true);

INSERT INTO ayudas_rstc.roles (id, codigo, nombre) VALUES
  (ayudas_rstc.uuid_catalogo('rol.PERSONAL_PASTORAL'), 'PERSONAL_PASTORAL', 'Personal pastoral'),
  (ayudas_rstc.uuid_catalogo('rol.COORDINADOR_PARROQUIAL'), 'COORDINADOR_PARROQUIAL', 'Coordinador parroquial / Párroco'),
  (ayudas_rstc.uuid_catalogo('rol.COORDINADOR_VICARIAL'), 'COORDINADOR_VICARIAL', 'Coordinador vicarial'),
  (ayudas_rstc.uuid_catalogo('rol.COORDINADOR_DIOCESANO'), 'COORDINADOR_DIOCESANO', 'Coordinador diocesano'),
  (ayudas_rstc.uuid_catalogo('rol.ADMINISTRADOR'), 'ADMINISTRADOR', 'Administrador');

INSERT INTO ayudas_rstc.tipos_documento (id, codigo, nombre) VALUES
  (ayudas_rstc.uuid_catalogo('tipo_documento.CEDULA_NACIONAL'), 'CEDULA_NACIONAL', 'Cédula nacional'),
  (ayudas_rstc.uuid_catalogo('tipo_documento.DIMEX'), 'DIMEX', 'DIMEX'),
  (ayudas_rstc.uuid_catalogo('tipo_documento.PASAPORTE'), 'PASAPORTE', 'Pasaporte'),
  (ayudas_rstc.uuid_catalogo('tipo_documento.OTRO'), 'OTRO', 'Otro'),
  (ayudas_rstc.uuid_catalogo('tipo_documento.SIN_DOCUMENTO'), 'SIN_DOCUMENTO', 'Sin documento');

INSERT INTO ayudas_rstc.sexos (id, codigo, nombre, orden_presentacion) VALUES
  (ayudas_rstc.uuid_catalogo('sexo.FEMENINO'), 'FEMENINO', 'Femenino', 1),
  (ayudas_rstc.uuid_catalogo('sexo.MASCULINO'), 'MASCULINO', 'Masculino', 2),
  (ayudas_rstc.uuid_catalogo('sexo.OTRO'), 'OTRO', 'Otro', 3),
  (ayudas_rstc.uuid_catalogo('sexo.NO_ESPECIFICADO'), 'NO_ESPECIFICADO', 'No especificado', 4);

INSERT INTO ayudas_rstc.grados_academicos (id, codigo, nombre, orden_presentacion) VALUES
  (ayudas_rstc.uuid_catalogo('grado.SIN_ESTUDIOS'), 'SIN_ESTUDIOS', 'Sin estudios', 1),
  (ayudas_rstc.uuid_catalogo('grado.PRIMARIA_INCOMPLETA'), 'PRIMARIA_INCOMPLETA', 'Primaria incompleta', 2),
  (ayudas_rstc.uuid_catalogo('grado.PRIMARIA_COMPLETA'), 'PRIMARIA_COMPLETA', 'Primaria completa', 3),
  (ayudas_rstc.uuid_catalogo('grado.SECUNDARIA_INCOMPLETA'), 'SECUNDARIA_INCOMPLETA', 'Secundaria incompleta', 4),
  (ayudas_rstc.uuid_catalogo('grado.SECUNDARIA_COMPLETA'), 'SECUNDARIA_COMPLETA', 'Secundaria completa', 5),
  (ayudas_rstc.uuid_catalogo('grado.TECNICO'), 'TECNICO', 'Técnico', 6),
  (ayudas_rstc.uuid_catalogo('grado.UNIVERSITARIA_INCOMPLETA'), 'UNIVERSITARIA_INCOMPLETA', 'Universitaria incompleta', 7),
  (ayudas_rstc.uuid_catalogo('grado.UNIVERSITARIA_COMPLETA'), 'UNIVERSITARIA_COMPLETA', 'Universitaria completa', 8),
  (ayudas_rstc.uuid_catalogo('grado.POSTGRADO'), 'POSTGRADO', 'Posgrado', 9);

INSERT INTO ayudas_rstc.parentescos (id, codigo, nombre, orden_presentacion) VALUES
  (ayudas_rstc.uuid_catalogo('parentesco.SOLICITANTE'), 'SOLICITANTE', 'Solicitante', 1),
  (ayudas_rstc.uuid_catalogo('parentesco.CONYUGE'), 'CONYUGE', 'Cónyuge', 2),
  (ayudas_rstc.uuid_catalogo('parentesco.HIJO'), 'HIJO', 'Hijo / Hija', 3),
  (ayudas_rstc.uuid_catalogo('parentesco.PADRE_MADRE'), 'PADRE_MADRE', 'Padre / Madre', 4),
  (ayudas_rstc.uuid_catalogo('parentesco.HERMANO'), 'HERMANO', 'Hermano / Hermana', 5),
  (ayudas_rstc.uuid_catalogo('parentesco.NIETO'), 'NIETO', 'Nieto / Nieta', 6),
  (ayudas_rstc.uuid_catalogo('parentesco.ABUELO'), 'ABUELO', 'Abuelo / Abuela', 7),
  (ayudas_rstc.uuid_catalogo('parentesco.OTRO'), 'OTRO', 'Otro', 8);

INSERT INTO ayudas_rstc.rangos_ingreso (
  id, codigo, nombre, monto_minimo, monto_maximo, orden_presentacion
) VALUES
  (ayudas_rstc.uuid_catalogo('rango.SIN_INGRESOS_REPORTADOS'), 'SIN_INGRESOS_REPORTADOS', 'Sin ingresos reportados', NULL, 0, 1),
  (ayudas_rstc.uuid_catalogo('rango.HASTA_100000'), 'HASTA_100000', 'Hasta ₡100.000', 0.01, 100000, 2),
  (ayudas_rstc.uuid_catalogo('rango.DE_100001_A_180000'), 'DE_100001_A_180000', '₡100.001 - ₡180.000', 100001, 180000, 3),
  (ayudas_rstc.uuid_catalogo('rango.DE_180001_A_280000'), 'DE_180001_A_280000', '₡180.001 - ₡280.000', 180001, 280000, 4),
  (ayudas_rstc.uuid_catalogo('rango.DE_280001_A_380000'), 'DE_280001_A_380000', '₡280.001 - ₡380.000', 280001, 380000, 5),
  (ayudas_rstc.uuid_catalogo('rango.DE_380001_A_460000'), 'DE_380001_A_460000', '₡380.001 - ₡460.000', 380001, 460000, 6),
  (ayudas_rstc.uuid_catalogo('rango.DE_460001_A_550000'), 'DE_460001_A_550000', '₡460.001 - ₡550.000', 460001, 550000, 7),
  (ayudas_rstc.uuid_catalogo('rango.MAS_DE_550000'), 'MAS_DE_550000', 'Más de ₡550.000', 550000.01, NULL, 8);

INSERT INTO ayudas_rstc.tipos_vivienda (id, codigo, nombre) VALUES
  (ayudas_rstc.uuid_catalogo('tipo_vivienda.CASA'), 'CASA', 'Casa'),
  (ayudas_rstc.uuid_catalogo('tipo_vivienda.CUARTO'), 'CUARTO', 'Cuarto'),
  (ayudas_rstc.uuid_catalogo('tipo_vivienda.ALBERGUE'), 'ALBERGUE', 'Albergue'),
  (ayudas_rstc.uuid_catalogo('tipo_vivienda.REFUGIO'), 'REFUGIO', 'Refugio');

INSERT INTO ayudas_rstc.tipos_tenencia (id, codigo, nombre) VALUES
  (ayudas_rstc.uuid_catalogo('tipo_tenencia.PROPIA'), 'PROPIA', 'Propia'),
  (ayudas_rstc.uuid_catalogo('tipo_tenencia.HIPOTECADA'), 'HIPOTECADA', 'Hipotecada'),
  (ayudas_rstc.uuid_catalogo('tipo_tenencia.PRESTADA'), 'PRESTADA', 'Prestada'),
  (ayudas_rstc.uuid_catalogo('tipo_tenencia.ALQUILADA'), 'ALQUILADA', 'Alquilada'),
  (ayudas_rstc.uuid_catalogo('tipo_tenencia.NO_TIENE'), 'NO_TIENE', 'No tiene');

INSERT INTO ayudas_rstc.condiciones_vivienda (id, codigo, nombre) VALUES
  (ayudas_rstc.uuid_catalogo('condicion_vivienda.BUENA'), 'BUENA', 'Buena'),
  (ayudas_rstc.uuid_catalogo('condicion_vivienda.REGULAR'), 'REGULAR', 'Regular'),
  (ayudas_rstc.uuid_catalogo('condicion_vivienda.MALA'), 'MALA', 'Mala'),
  (ayudas_rstc.uuid_catalogo('condicion_vivienda.PRECARIO'), 'PRECARIO', 'Precario'),
  (ayudas_rstc.uuid_catalogo('condicion_vivienda.TUGURIO'), 'TUGURIO', 'Tugurio');

INSERT INTO ayudas_rstc.tipos_ayuda (id, codigo, nombre, requiere_detalle) VALUES
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.ALIMENTOS'), 'ALIMENTOS', 'Alimentos', false),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.ALIMENTOS_PREPARADOS'), 'ALIMENTOS_PREPARADOS', 'Alimentos preparados', false),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.ARTICULOS_HIGIENE'), 'ARTICULOS_HIGIENE', 'Artículos de higiene', false),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.ROPA'), 'ROPA', 'Ropa', false),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.EQUIPO_MEDICO'), 'EQUIPO_MEDICO', 'Equipo médico', true),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.PAGO_ALQUILER'), 'PAGO_ALQUILER', 'Pago de alquiler', true),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.PAGO_SERVICIOS'), 'PAGO_SERVICIOS', 'Pago de servicios', true),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.PAGO_MEDICAMENTOS'), 'PAGO_MEDICAMENTOS', 'Pago de medicamentos', true),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.APARATOS_ORTOPEDICOS'), 'APARATOS_ORTOPEDICOS', 'Aparatos ortopédicos', true),
  (ayudas_rstc.uuid_catalogo('tipo_ayuda.OTROS'), 'OTROS', 'Otros', true);
