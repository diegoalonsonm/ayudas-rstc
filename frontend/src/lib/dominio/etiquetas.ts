import {
  AccionAuditoria,
  CodigoRol,
  DecisionPlanAyuda,
  EstadoSolicitud,
  FrecuenciaEntrega,
  type SlugCatalogo,
} from "./enums";

export const ETIQUETAS_ROL: Record<CodigoRol, string> = {
  [CodigoRol.PERSONAL_PASTORAL]: "Personal pastoral",
  [CodigoRol.COORDINADOR_PARROQUIAL]: "Coordinador parroquial",
  [CodigoRol.COORDINADOR_VICARIAL]: "Coordinador vicarial",
  [CodigoRol.COORDINADOR_DIOCESANO]: "Coordinador diocesano",
  [CodigoRol.ADMINISTRADOR]: "Administrador",
};

export const ETIQUETAS_ESTADO: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.BORRADOR]: "Borrador",
  [EstadoSolicitud.PRESENTADA]: "Presentada",
  [EstadoSolicitud.EN_REVISION]: "En revisión",
  [EstadoSolicitud.APROBADA]: "Aprobada",
  [EstadoSolicitud.ACTIVA]: "Activa",
  [EstadoSolicitud.RECHAZADA]: "Rechazada",
  [EstadoSolicitud.FINALIZADA]: "Finalizada",
  [EstadoSolicitud.CANCELADA]: "Cancelada",
};

export const ETIQUETAS_TRANSICION: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.BORRADOR]: "Devolver a borrador",
  [EstadoSolicitud.PRESENTADA]: "Presentar",
  [EstadoSolicitud.EN_REVISION]: "Iniciar revisión",
  [EstadoSolicitud.APROBADA]: "Aprobar",
  [EstadoSolicitud.ACTIVA]: "Activar",
  [EstadoSolicitud.RECHAZADA]: "Rechazar",
  [EstadoSolicitud.FINALIZADA]: "Finalizar",
  [EstadoSolicitud.CANCELADA]: "Cancelar",
};

export const ETIQUETAS_DECISION: Record<DecisionPlanAyuda, string> = {
  [DecisionPlanAyuda.APROBADA]: "Aprobada",
  [DecisionPlanAyuda.RECHAZADA]: "Rechazada",
};

export const ETIQUETAS_FRECUENCIA: Record<FrecuenciaEntrega, string> = {
  [FrecuenciaEntrega.UNICA]: "Única",
  [FrecuenciaEntrega.SEMANAL]: "Semanal",
  [FrecuenciaEntrega.QUINCENAL]: "Quincenal",
  [FrecuenciaEntrega.MENSUAL]: "Mensual",
  [FrecuenciaEntrega.BIMESTRAL]: "Bimestral",
  [FrecuenciaEntrega.TRIMESTRAL]: "Trimestral",
  [FrecuenciaEntrega.SEGUN_NECESIDAD]: "Según necesidad",
};

export const ETIQUETAS_ACCION_AUDITORIA: Record<AccionAuditoria, string> = {
  [AccionAuditoria.INICIAR_SESION]: "Iniciar sesión",
  [AccionAuditoria.CERRAR_SESION]: "Cerrar sesión",
  [AccionAuditoria.FALLAR_INICIO_SESION]: "Inicio de sesión fallido",
  [AccionAuditoria.CONSULTAR_EXPEDIENTE]: "Consultar expediente",
  [AccionAuditoria.BUSCAR_PERSONA]: "Buscar persona",
  [AccionAuditoria.CREAR]: "Crear",
  [AccionAuditoria.ACTUALIZAR]: "Actualizar",
  [AccionAuditoria.ELIMINAR_LOGICAMENTE]: "Eliminar lógicamente",
  [AccionAuditoria.RESTAURAR]: "Restaurar",
  [AccionAuditoria.CAMBIAR_ESTADO_SOLICITUD]: "Cambiar estado de solicitud",
  [AccionAuditoria.APROBAR_AYUDA]: "Aprobar ayuda",
  [AccionAuditoria.RECHAZAR_AYUDA]: "Rechazar ayuda",
  [AccionAuditoria.REGISTRAR_ENTREGA]: "Registrar entrega",
  [AccionAuditoria.CREAR_USUARIO]: "Crear usuario",
  [AccionAuditoria.CAMBIAR_ROL]: "Cambiar rol",
  [AccionAuditoria.CAMBIAR_ALCANCE]: "Cambiar alcance",
  [AccionAuditoria.DESACTIVAR_USUARIO]: "Desactivar usuario",
  [AccionAuditoria.CARGAR_DOCUMENTO]: "Cargar documento",
  [AccionAuditoria.VISUALIZAR_DOCUMENTO]: "Visualizar documento",
  [AccionAuditoria.DESCARGAR_DOCUMENTO]: "Descargar documento",
  [AccionAuditoria.EXPORTAR_DATOS]: "Exportar datos",
};

export const ETIQUETAS_CATALOGO: Record<SlugCatalogo, string> = {
  "tipos-documento": "Tipos de documento",
  sexos: "Sexos",
  "grados-academicos": "Grados académicos",
  parentescos: "Parentescos",
  "rangos-ingreso": "Rangos de ingreso",
  "tipos-vivienda": "Tipos de vivienda",
  "tipos-tenencia": "Tipos de tenencia",
  "condiciones-vivienda": "Condiciones de vivienda",
  "tipos-ayuda": "Tipos de ayuda",
  roles: "Roles",
  cantones: "Cantones",
  distritos: "Distritos",
  barrios: "Barrios",
};

export const ETIQUETAS_NIVEL_ALCANCE = {
  diocesis: "Diócesis",
  vicaria: "Vicaría",
  parroquia: "Parroquia",
  ninguno: "Sin alcance territorial",
} as const;

export function etiquetaRol(rolCodigo: string): string {
  return ETIQUETAS_ROL[rolCodigo as CodigoRol] ?? rolCodigo;
}

export function etiquetaEstado(estado: string): string {
  return ETIQUETAS_ESTADO[estado as EstadoSolicitud] ?? estado;
}

export function etiquetaAccionAuditoria(accion: string): string {
  return ETIQUETAS_ACCION_AUDITORIA[accion as AccionAuditoria] ?? accion;
}

export function etiquetaFrecuencia(frecuencia: string | null): string {
  if (!frecuencia) {
    return "Sin definir";
  }
  return ETIQUETAS_FRECUENCIA[frecuencia as FrecuenciaEntrega] ?? frecuencia;
}
