import { ESTADOS_SOLICITUD_VIGENTES, EstadoSolicitud } from "./enums";

const TRANSICIONES_PERMITIDAS: Record<EstadoSolicitud, EstadoSolicitud[]> = {
  [EstadoSolicitud.BORRADOR]: [EstadoSolicitud.PRESENTADA, EstadoSolicitud.CANCELADA],
  [EstadoSolicitud.PRESENTADA]: [EstadoSolicitud.EN_REVISION, EstadoSolicitud.CANCELADA],
  [EstadoSolicitud.EN_REVISION]: [
    EstadoSolicitud.APROBADA,
    EstadoSolicitud.RECHAZADA,
    EstadoSolicitud.CANCELADA,
  ],
  [EstadoSolicitud.APROBADA]: [EstadoSolicitud.ACTIVA, EstadoSolicitud.CANCELADA],
  [EstadoSolicitud.ACTIVA]: [EstadoSolicitud.FINALIZADA, EstadoSolicitud.CANCELADA],
  [EstadoSolicitud.RECHAZADA]: [],
  [EstadoSolicitud.FINALIZADA]: [],
  [EstadoSolicitud.CANCELADA]: [],
};

const ESTADOS_EDITABLES: EstadoSolicitud[] = [
  EstadoSolicitud.BORRADOR,
  EstadoSolicitud.PRESENTADA,
  EstadoSolicitud.EN_REVISION,
];

export function transicionesPermitidas(estadoActual: EstadoSolicitud): EstadoSolicitud[] {
  return TRANSICIONES_PERMITIDAS[estadoActual] ?? [];
}

export function esTransicionPermitida(
  estadoActual: EstadoSolicitud,
  estadoNuevo: EstadoSolicitud,
): boolean {
  return transicionesPermitidas(estadoActual).includes(estadoNuevo);
}

export function esEstadoVigente(estado: EstadoSolicitud): boolean {
  return ESTADOS_SOLICITUD_VIGENTES.includes(estado);
}

export function esEstadoTerminal(estado: EstadoSolicitud): boolean {
  return transicionesPermitidas(estado).length === 0;
}

export function esSolicitudEditable(estado: EstadoSolicitud): boolean {
  return ESTADOS_EDITABLES.includes(estado);
}
