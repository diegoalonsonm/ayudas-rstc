export const CodigoRol = {
  PERSONAL_PASTORAL: "PERSONAL_PASTORAL",
  COORDINADOR_PARROQUIAL: "COORDINADOR_PARROQUIAL",
  COORDINADOR_VICARIAL: "COORDINADOR_VICARIAL",
  COORDINADOR_DIOCESANO: "COORDINADOR_DIOCESANO",
  ADMINISTRADOR: "ADMINISTRADOR",
} as const;

export type CodigoRol = (typeof CodigoRol)[keyof typeof CodigoRol];

export const CODIGOS_ROL = Object.values(CodigoRol);

export const EstadoSolicitud = {
  BORRADOR: "BORRADOR",
  PRESENTADA: "PRESENTADA",
  EN_REVISION: "EN_REVISION",
  APROBADA: "APROBADA",
  ACTIVA: "ACTIVA",
  RECHAZADA: "RECHAZADA",
  FINALIZADA: "FINALIZADA",
  CANCELADA: "CANCELADA",
} as const;

export type EstadoSolicitud = (typeof EstadoSolicitud)[keyof typeof EstadoSolicitud];

export const ESTADOS_SOLICITUD = Object.values(EstadoSolicitud);

export const ESTADOS_SOLICITUD_VIGENTES: EstadoSolicitud[] = [
  EstadoSolicitud.PRESENTADA,
  EstadoSolicitud.EN_REVISION,
  EstadoSolicitud.APROBADA,
  EstadoSolicitud.ACTIVA,
];

export const DecisionPlanAyuda = {
  APROBADA: "APROBADA",
  RECHAZADA: "RECHAZADA",
} as const;

export type DecisionPlanAyuda = (typeof DecisionPlanAyuda)[keyof typeof DecisionPlanAyuda];

export const FrecuenciaEntrega = {
  UNICA: "UNICA",
  SEMANAL: "SEMANAL",
  QUINCENAL: "QUINCENAL",
  MENSUAL: "MENSUAL",
  BIMESTRAL: "BIMESTRAL",
  TRIMESTRAL: "TRIMESTRAL",
  SEGUN_NECESIDAD: "SEGUN_NECESIDAD",
} as const;

export type FrecuenciaEntrega = (typeof FrecuenciaEntrega)[keyof typeof FrecuenciaEntrega];

export const FRECUENCIAS_ENTREGA = Object.values(FrecuenciaEntrega);

export const TipoActorAuditoria = {
  USUARIO: "USUARIO",
  SISTEMA: "SISTEMA",
  TAREA_AUTOMATICA: "TAREA_AUTOMATICA",
} as const;

export type TipoActorAuditoria = (typeof TipoActorAuditoria)[keyof typeof TipoActorAuditoria];

export const ResultadoAuditoria = {
  EXITOSO: "EXITOSO",
  FALLIDO: "FALLIDO",
} as const;

export type ResultadoAuditoria = (typeof ResultadoAuditoria)[keyof typeof ResultadoAuditoria];

export const OrigenAuditoria = {
  APLICACION: "APLICACION",
  API: "API",
  TAREA_PROGRAMADA: "TAREA_PROGRAMADA",
  CONSOLA_ADMINISTRATIVA: "CONSOLA_ADMINISTRATIVA",
} as const;

export type OrigenAuditoria = (typeof OrigenAuditoria)[keyof typeof OrigenAuditoria];

export const AccionAuditoria = {
  INICIAR_SESION: "INICIAR_SESION",
  CERRAR_SESION: "CERRAR_SESION",
  FALLAR_INICIO_SESION: "FALLAR_INICIO_SESION",
  CONSULTAR_EXPEDIENTE: "CONSULTAR_EXPEDIENTE",
  BUSCAR_PERSONA: "BUSCAR_PERSONA",
  CREAR: "CREAR",
  ACTUALIZAR: "ACTUALIZAR",
  ELIMINAR_LOGICAMENTE: "ELIMINAR_LOGICAMENTE",
  RESTAURAR: "RESTAURAR",
  CAMBIAR_ESTADO_SOLICITUD: "CAMBIAR_ESTADO_SOLICITUD",
  APROBAR_AYUDA: "APROBAR_AYUDA",
  RECHAZAR_AYUDA: "RECHAZAR_AYUDA",
  REGISTRAR_ENTREGA: "REGISTRAR_ENTREGA",
  CREAR_USUARIO: "CREAR_USUARIO",
  CAMBIAR_ROL: "CAMBIAR_ROL",
  CAMBIAR_ALCANCE: "CAMBIAR_ALCANCE",
  DESACTIVAR_USUARIO: "DESACTIVAR_USUARIO",
  CARGAR_DOCUMENTO: "CARGAR_DOCUMENTO",
  VISUALIZAR_DOCUMENTO: "VISUALIZAR_DOCUMENTO",
  DESCARGAR_DOCUMENTO: "DESCARGAR_DOCUMENTO",
  EXPORTAR_DATOS: "EXPORTAR_DATOS",
} as const;

export type AccionAuditoria = (typeof AccionAuditoria)[keyof typeof AccionAuditoria];

export const ACCIONES_AUDITORIA = Object.values(AccionAuditoria);

export const SLUGS_CATALOGO = [
  "tipos-documento",
  "sexos",
  "grados-academicos",
  "parentescos",
  "rangos-ingreso",
  "tipos-vivienda",
  "tipos-tenencia",
  "condiciones-vivienda",
  "tipos-ayuda",
  "roles",
  "cantones",
  "distritos",
  "barrios",
] as const;

export type SlugCatalogo = (typeof SLUGS_CATALOGO)[number];

export const MIMES_CONSENTIMIENTO = ["application/pdf", "image/jpeg", "image/png"] as const;
