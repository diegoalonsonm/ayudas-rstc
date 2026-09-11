import { CodigoRol, EstadoSolicitud } from "../dominio/enums";
import { esSolicitudEditable, transicionesPermitidas } from "../dominio/estadosSolicitud";
import type { Sesion } from "../dominio/tipos";

const TODOS: CodigoRol[] = [
  CodigoRol.PERSONAL_PASTORAL,
  CodigoRol.COORDINADOR_PARROQUIAL,
  CodigoRol.COORDINADOR_VICARIAL,
  CodigoRol.COORDINADOR_DIOCESANO,
  CodigoRol.ADMINISTRADOR,
];

const COORDINADORES: CodigoRol[] = [
  CodigoRol.COORDINADOR_PARROQUIAL,
  CodigoRol.COORDINADOR_VICARIAL,
  CodigoRol.COORDINADOR_DIOCESANO,
  CodigoRol.ADMINISTRADOR,
];

const DIOCESANOS: CodigoRol[] = [CodigoRol.COORDINADOR_DIOCESANO, CodigoRol.ADMINISTRADOR];

const SOLO_ADMINISTRADOR: CodigoRol[] = [CodigoRol.ADMINISTRADOR];

export const MATRIZ_PERMISOS = {
  solicitudesVer: TODOS,
  solicitudesCrear: TODOS,
  solicitudesEditar: TODOS,
  solicitudesEliminar: COORDINADORES,
  solicitudesRestaurar: DIOCESANOS,

  integrantesEscribir: TODOS,
  viviendaEscribir: TODOS,
  ayudasAgregar: TODOS,
  ayudasEliminar: COORDINADORES,

  planesVer: TODOS,
  planesDecidir: COORDINADORES,
  planesDetallesCrear: COORDINADORES,
  entregasRegistrar: TODOS,

  documentosVer: TODOS,
  documentosCargar: TODOS,

  personasVer: TODOS,
  personasBuscar: TODOS,
  personasCrear: TODOS,
  personasEditar: TODOS,
  direccionesEscribir: TODOS,

  usuariosListar: DIOCESANOS,
  usuariosCrear: TODOS,
  usuariosEditar: SOLO_ADMINISTRADOR,
  usuariosReasignar: SOLO_ADMINISTRADOR,

  organizacionVer: TODOS,
  organizacionEscribir: SOLO_ADMINISTRADOR,

  catalogosVer: TODOS,
  catalogosEscribir: SOLO_ADMINISTRADOR,

  auditoriaVer: DIOCESANOS,
} as const satisfies Record<string, readonly CodigoRol[]>;

export type Permiso = keyof typeof MATRIZ_PERMISOS;

const TRANSICIONES_POR_ROL: Record<EstadoSolicitud, readonly CodigoRol[]> = {
  [EstadoSolicitud.BORRADOR]: COORDINADORES,
  [EstadoSolicitud.PRESENTADA]: TODOS,
  [EstadoSolicitud.EN_REVISION]: COORDINADORES,
  [EstadoSolicitud.APROBADA]: COORDINADORES,
  [EstadoSolicitud.ACTIVA]: TODOS,
  [EstadoSolicitud.RECHAZADA]: COORDINADORES,
  [EstadoSolicitud.FINALIZADA]: COORDINADORES,
  [EstadoSolicitud.CANCELADA]: COORDINADORES,
};

const ROL_A_CREAR: Record<CodigoRol, CodigoRol | null> = {
  [CodigoRol.PERSONAL_PASTORAL]: CodigoRol.PERSONAL_PASTORAL,
  [CodigoRol.COORDINADOR_PARROQUIAL]: CodigoRol.PERSONAL_PASTORAL,
  [CodigoRol.COORDINADOR_VICARIAL]: CodigoRol.COORDINADOR_PARROQUIAL,
  [CodigoRol.COORDINADOR_DIOCESANO]: CodigoRol.COORDINADOR_VICARIAL,
  [CodigoRol.ADMINISTRADOR]: null,
};

export function puede(sesion: Sesion | null, permiso: Permiso): boolean {
  if (!sesion) {
    return false;
  }
  return (MATRIZ_PERMISOS[permiso] as readonly CodigoRol[]).includes(sesion.rolCodigo);
}

export function esAdministrador(sesion: Sesion | null): boolean {
  return sesion?.rolCodigo === CodigoRol.ADMINISTRADOR;
}

export function puedeEditarSolicitud(sesion: Sesion | null, estado: EstadoSolicitud): boolean {
  return puede(sesion, "solicitudesEditar") && esSolicitudEditable(estado);
}

export function puedeTransitar(
  sesion: Sesion | null,
  estadoActual: EstadoSolicitud,
  estadoNuevo: EstadoSolicitud,
): boolean {
  if (!sesion) {
    return false;
  }
  if (!transicionesPermitidas(estadoActual).includes(estadoNuevo)) {
    return false;
  }
  return TRANSICIONES_POR_ROL[estadoNuevo].includes(sesion.rolCodigo);
}

export function motivoTransicionBloqueada(estadoNuevo: EstadoSolicitud): string {
  const roles = TRANSICIONES_POR_ROL[estadoNuevo];
  if (roles === TODOS) {
    return "Esta transición no está disponible para su rol";
  }
  return "Solo un coordinador parroquial o superior puede ejecutar esta transición";
}

export function puedeDecidirPlan(sesion: Sesion | null, estado: EstadoSolicitud): boolean {
  return puede(sesion, "planesDecidir") && estado === EstadoSolicitud.EN_REVISION;
}

export function motivoPlanBloqueado(sesion: Sesion | null): string {
  if (!puede(sesion, "planesDecidir")) {
    return "Solo un coordinador parroquial o superior puede registrar la decisión del plan";
  }
  return "La decisión del plan solo se registra cuando la solicitud está en revisión";
}

export function rolesQuePuedeCrear(sesion: Sesion | null): CodigoRol[] {
  if (!sesion) {
    return [];
  }
  const permitido = ROL_A_CREAR[sesion.rolCodigo];
  if (permitido === null) {
    return [...TODOS];
  }
  return [permitido];
}

export function puedeEditarUsuario(sesion: Sesion | null, usuarioId: string): boolean {
  if (!sesion) {
    return false;
  }
  return esAdministrador(sesion) || sesion.usuarioId === usuarioId;
}

export function puedeReasignarUsuario(sesion: Sesion | null, usuarioId: string): boolean {
  return puede(sesion, "usuariosReasignar") && sesion?.usuarioId !== usuarioId;
}

const ROLES_MULTIPARROQUIA: CodigoRol[] = [
  CodigoRol.COORDINADOR_VICARIAL,
  CodigoRol.COORDINADOR_DIOCESANO,
  CodigoRol.ADMINISTRADOR,
];

const ROLES_MULTIVICARIA: CodigoRol[] = [
  CodigoRol.COORDINADOR_DIOCESANO,
  CodigoRol.ADMINISTRADOR,
];

export function verColumnaParroquia(sesion: Sesion | null): boolean {
  if (!sesion) {
    return false;
  }
  return ROLES_MULTIPARROQUIA.includes(sesion.rolCodigo);
}

export function verColumnaVicaria(sesion: Sesion | null): boolean {
  if (!sesion) {
    return false;
  }
  return ROLES_MULTIVICARIA.includes(sesion.rolCodigo);
}
