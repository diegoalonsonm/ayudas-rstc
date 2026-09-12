import type {
  CodigoRol,
  DecisionPlanAyuda,
  EstadoSolicitud,
  FrecuenciaEntrega,
} from "./enums";

export type CamposComunes = {
  id: string;
  creadoEn: string;
  creadoPorUsuarioId: string | null;
  actualizadoEn: string;
  actualizadoPorUsuarioId: string | null;
  eliminadoEn: string | null;
  eliminadoPorUsuarioId: string | null;
  motivoEliminacion: string | null;
};

export type Sesion = {
  usuarioId: string;
  correo: string;
  nombreCompleto: string;
  rolCodigo: CodigoRol;
  diocesisId: string | null;
  vicariaId: string | null;
  parroquiaId: string | null;
};

export type Usuario = CamposComunes & {
  identidadAutenticacionId: string | null;
  nombreCompleto: string;
  correo: string;
  activo: boolean;
  ultimoAccesoEn: string | null;
};

export type AsignacionUsuario = CamposComunes & {
  usuarioId: string;
  rolId: string;
  rolCodigo?: CodigoRol;
  diocesisId: string | null;
  vicariaId: string | null;
  parroquiaId: string | null;
  vigenteDesde: string;
  vigenteHasta: string | null;
};

export type UsuarioConAsignacion = {
  usuario: Usuario;
  asignacion: AsignacionUsuario | null;
};

export type RespuestaSesion = {
  tokenAcceso: string;
  tokenRenovacion: string;
  expiraEn: number;
  usuario: Usuario;
  asignacion: {
    rolCodigo: CodigoRol;
    diocesisId: string | null;
    vicariaId: string | null;
    parroquiaId: string | null;
  };
};

export type Diocesis = CamposComunes & {
  nombre: string;
  codigo: string;
};

export type Vicaria = CamposComunes & {
  diocesisId: string;
  nombre: string;
  codigo: string;
};

export type Parroquia = CamposComunes & {
  vicariaId: string;
  nombre: string;
  codigo: string;
};

export type ItemCatalogo = CamposComunes & {
  codigo: string;
  nombre: string;
  ordenPresentacion?: number | null;
  requiereDetalle?: boolean | null;
  montoMinimo?: number | null;
  montoMaximo?: number | null;
  cantonId?: string | null;
  distritoId?: string | null;
};

export type Persona = CamposComunes & {
  tipoDocumentoId: string | null;
  numeroDocumentoCifrado: string | null;
  numeroDocumentoHash: string | null;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  telefono: string | null;
};

export type Direccion = CamposComunes & {
  personaId: string;
  cantonId: string | null;
  distritoId: string | null;
  barrioId: string | null;
  senas: string | null;
  esActual: boolean;
  vigenteDesde: string;
  vigenteHasta: string | null;
};

export type SolicitudAyuda = CamposComunes & {
  numeroSolicitud: string;
  personaSolicitanteId: string;
  parroquiaReceptoraId: string;
  sectorOficial: string | null;
  usuarioEntrevistadorId: string | null;
  fechaEntrevista: string | null;
  fechaVisita: string | null;
  estado: EstadoSolicitud;
  observaciones: string | null;
  presentadaEn: string | null;
};

export type IntegranteConvivencia = CamposComunes & {
  solicitudAyudaId: string;
  personaId: string | null;
  nombreCompleto: string;
  sexoId: string | null;
  ocupacion: string | null;
  tipoDocumentoId: string | null;
  numeroDocumentoCifrado: string | null;
  numeroDocumentoHash: string | null;
  gradoAcademicoId: string | null;
  rangoIngresoId: string | null;
  cuentaConSeguro: boolean | null;
  parentescoId: string | null;
};

export type EvaluacionVivienda = CamposComunes & {
  solicitudAyudaId: string;
  tipoViviendaId: string | null;
  tipoTenenciaId: string | null;
  condicionViviendaId: string | null;
  observaciones: string | null;
};

export type AyudaSolicitada = CamposComunes & {
  solicitudAyudaId: string;
  tipoAyudaId: string;
  detalle: string | null;
};

export type PlanAyuda = CamposComunes & {
  solicitudAyudaId: string;
  decision: DecisionPlanAyuda;
  fechaInicio: string | null;
  fechaFin: string | null;
  motivoDecision: string | null;
  usuarioDecisorId: string | null;
  decididoEn: string | null;
};

export type DetallePlanAyuda = CamposComunes & {
  planAyudaId: string;
  tipoAyudaId: string;
  descripcion: string | null;
  frecuencia: FrecuenciaEntrega | null;
  montoEstimado: number | null;
};

export type EntregaAyuda = CamposComunes & {
  detallePlanAyudaId: string;
  fechaEntrega: string;
  descripcion: string | null;
  monto: number | null;
  usuarioResponsableId: string | null;
  observaciones: string | null;
};

export type DocumentoConsentimiento = CamposComunes & {
  solicitudAyudaId: string;
  nombreBucket: string;
  claveObjeto: string;
  nombreArchivoOriginal: string;
  tipoMime: string | null;
  tamanoBytes: number | null;
  sumaVerificacion: string | null;
  fechaFirma: string | null;
  usuarioCargaId: string | null;
  cargadoEn: string;
};

export type UrlDocumento = {
  urlFirmada: string;
  expiraEnSegundos: number;
};

export type HistorialEstadoSolicitud = {
  id: string;
  solicitudAyudaId: string;
  estadoAnterior: EstadoSolicitud | null;
  estadoNuevo: EstadoSolicitud;
  motivo: string | null;
  usuarioResponsableId: string | null;
  ocurridoEn: string;
};

export type ProcesoVigentePersona = {
  personaId: string;
  solicitudId: string;
  numeroSolicitud: string;
  estado: EstadoSolicitud;
  tipoAyudaCodigo: string;
  tipoAyudaNombre: string;
  parroquiaNombre: string;
  vicariaNombre: string;
};

export type ExpedienteSolicitud = {
  solicitud: SolicitudAyuda;
  persona: Persona;
  direccionActual: Direccion | null;
  integrantes: IntegranteConvivencia[];
  evaluacionVivienda: EvaluacionVivienda | null;
  ayudasSolicitadas: AyudaSolicitada[];
  planes: PlanAyuda[];
  documentos: DocumentoConsentimiento[];
  historialEstados: HistorialEstadoSolicitud[];
};

export type EventoAuditoria = {
  id: string;
  ocurridoEn: string;
  usuarioId: string | null;
  rolCodigo: string | null;
  tipoActor: string;
  accion: string;
  tipoEntidad: string;
  entidadId: string | null;
  diocesisId: string | null;
  vicariaId: string | null;
  parroquiaId: string | null;
  datosAnteriores: Record<string, unknown> | null;
  datosNuevos: Record<string, unknown> | null;
  camposModificados: string[] | null;
  motivo: string | null;
  resultado: string;
  codigoError: string | null;
  direccionIp: string | null;
  agenteUsuario: string | null;
  identificadorSesion: string | null;
  identificadorSolicitud: string | null;
  origen: string | null;
};

export type Organizacion = {
  diocesis: Diocesis[];
  vicarias: Vicaria[];
  parroquias: Parroquia[];
};
