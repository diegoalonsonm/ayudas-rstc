import {
  AsignacionUsuario,
  AyudaSolicitada,
  DetallePlanAyuda,
  Direccion,
  DocumentoConsentimiento,
  EntregaAyuda,
  EvaluacionVivienda,
  EventoAuditoria,
  ExpedienteSolicitud,
  IntegranteConvivencia,
  ItemCatalogo,
  Parroquia,
  Persona,
  PlanAyuda,
  ProcesoVigentePersona,
  SolicitudAyuda,
  Usuario,
  Vicaria,
} from "../entities/tiposDominio";

export const REPOSITORIO_GENERICO = "REPOSITORIO_GENERICO";
export const REPOSITORIO_USUARIOS = "REPOSITORIO_USUARIOS";
export const REPOSITORIO_SOLICITUDES = "REPOSITORIO_SOLICITUDES";
export const REPOSITORIO_PERSONAS = "REPOSITORIO_PERSONAS";
export const REPOSITORIO_ORGANIZACION = "REPOSITORIO_ORGANIZACION";
export const REPOSITORIO_DOCUMENTOS = "REPOSITORIO_DOCUMENTOS";
export const REPOSITORIO_AUDITORIA = "REPOSITORIO_AUDITORIA";

export interface RepositorioGenerico {
  listarActivos<T>(tabla: string, filtros?: Record<string, unknown>): Promise<T[]>;
  obtenerPorId<T>(tabla: string, id: string): Promise<T | null>;
  insertar<T>(tabla: string, datos: Record<string, unknown>): Promise<T>;
  actualizar<T>(tabla: string, id: string, datos: Record<string, unknown>): Promise<T>;
  eliminarLogicamente<T>(
    tabla: string,
    id: string,
    motivo: string,
    usuarioId: string,
  ): Promise<T>;
  restaurar<T>(tabla: string, id: string, usuarioId: string): Promise<T>;
}

export interface RepositorioUsuarios {
  obtenerPorIdentidadAutenticacion(id: string): Promise<Usuario | null>;
  obtenerPorId(id: string): Promise<Usuario | null>;
  obtenerPorCorreo(correo: string): Promise<Usuario | null>;
  listar(): Promise<Usuario[]>;
  actualizarUltimoAcceso(id: string, fechaIso: string): Promise<void>;
  actualizar(id: string, datos: Record<string, unknown>): Promise<Usuario>;
  obtenerAsignacionVigente(usuarioId: string): Promise<AsignacionUsuario | null>;
  crearUsuarioConAsignacion(entrada: {
    nombreCompleto: string;
    correo: string;
    rolCodigo: string;
    identidadAutenticacionId: string;
    diocesisId: string | null;
    vicariaId: string | null;
    parroquiaId: string | null;
    motivo: string | null;
  }): Promise<string>;
}

export interface RepositorioOrganizacion {
  obtenerParroquia(id: string): Promise<Parroquia | null>;
  obtenerVicaria(id: string): Promise<Vicaria | null>;
}

export interface RepositorioPersonas {
  crear(datos: Record<string, unknown>): Promise<Persona>;
  obtenerPorId(id: string): Promise<Persona | null>;
  obtenerPorHashDocumento(hash: string): Promise<Persona | null>;
  listar(): Promise<Persona[]>;
  actualizar(id: string, datos: Record<string, unknown>): Promise<Persona>;
  listarDirecciones(personaId: string): Promise<Direccion[]>;
  obtenerDireccionActual(personaId: string): Promise<Direccion | null>;
  crearDireccion(datos: Record<string, unknown>): Promise<Direccion>;
  actualizarDireccion(id: string, datos: Record<string, unknown>): Promise<Direccion>;
  consultarProcesosVigentes(hashDocumento: string): Promise<ProcesoVigentePersona[]>;
}

export interface RepositorioSolicitudes {
  registrarConAyudas(entrada: {
    personaSolicitanteId: string;
    parroquiaReceptoraId: string;
    sectorOficial: string | null;
    usuarioEntrevistadorId: string | null;
    fechaEntrevista: string | null;
    fechaVisita: string | null;
    observaciones: string | null;
    tiposAyuda: string[];
    detalles: string[] | null;
    estado: string;
    creadoPorUsuarioId: string;
  }): Promise<string>;
  listar(filtros?: Record<string, unknown>): Promise<SolicitudAyuda[]>;
  obtenerPorId(id: string): Promise<SolicitudAyuda | null>;
  actualizar(id: string, datos: Record<string, unknown>): Promise<SolicitudAyuda>;
  obtenerExpediente(id: string): Promise<ExpedienteSolicitud | null>;
  listarIntegrantes(solicitudId: string): Promise<IntegranteConvivencia[]>;
  crearIntegrante(datos: Record<string, unknown>): Promise<IntegranteConvivencia>;
  actualizarIntegrante(id: string, datos: Record<string, unknown>): Promise<IntegranteConvivencia>;
  obtenerEvaluacion(solicitudId: string): Promise<EvaluacionVivienda | null>;
  upsertEvaluacion(datos: Record<string, unknown>): Promise<EvaluacionVivienda>;
  listarAyudasSolicitadas(solicitudId: string): Promise<AyudaSolicitada[]>;
  crearAyudaSolicitada(datos: Record<string, unknown>): Promise<AyudaSolicitada>;
  actualizarAyudaSolicitada(id: string, datos: Record<string, unknown>): Promise<AyudaSolicitada>;
  listarPlanes(solicitudId: string): Promise<PlanAyuda[]>;
  crearPlan(datos: Record<string, unknown>): Promise<PlanAyuda>;
  actualizarPlan(id: string, datos: Record<string, unknown>): Promise<PlanAyuda>;
  obtenerPlanPorId(id: string): Promise<PlanAyuda | null>;
  listarDetallesPlan(planId: string): Promise<DetallePlanAyuda[]>;
  crearDetallePlan(datos: Record<string, unknown>): Promise<DetallePlanAyuda>;
  actualizarDetallePlan(id: string, datos: Record<string, unknown>): Promise<DetallePlanAyuda>;
  obtenerDetallePlanPorId(id: string): Promise<DetallePlanAyuda | null>;
  listarEntregas(detallePlanId: string): Promise<EntregaAyuda[]>;
  crearEntrega(datos: Record<string, unknown>): Promise<EntregaAyuda>;
  actualizarEntrega(id: string, datos: Record<string, unknown>): Promise<EntregaAyuda>;
}

export interface RepositorioDocumentos {
  crear(datos: Record<string, unknown>): Promise<DocumentoConsentimiento>;
  listarPorSolicitud(solicitudId: string): Promise<DocumentoConsentimiento[]>;
  obtenerPorId(id: string): Promise<DocumentoConsentimiento | null>;
  actualizar(id: string, datos: Record<string, unknown>): Promise<DocumentoConsentimiento>;
}

export interface RepositorioAuditoria {
  registrar(evento: Partial<EventoAuditoria>): Promise<void>;
  listar(filtros?: Record<string, unknown>): Promise<EventoAuditoria[]>;
}

export type { ItemCatalogo };
