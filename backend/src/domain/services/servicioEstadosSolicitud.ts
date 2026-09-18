import { EstadoSolicitud, ESTADOS_SOLICITUD_VIGENTES } from "../enums/catalogosDominio";
import { ErrorValidacion } from "../errors/errorDominio";

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

export class ServicioEstadosSolicitud {
  esEstadoVigente(estado: string): boolean {
    return ESTADOS_SOLICITUD_VIGENTES.includes(estado as EstadoSolicitud);
  }

  validarTransicion(estadoActual: string, estadoNuevo: string): void {
    const actuales = TRANSICIONES_PERMITIDAS[estadoActual as EstadoSolicitud];
    if (!actuales) {
      throw new ErrorValidacion(`Estado actual desconocido: ${estadoActual}`);
    }
    if (!actuales.includes(estadoNuevo as EstadoSolicitud)) {
      throw new ErrorValidacion(
        `No se permite transitar de ${estadoActual} a ${estadoNuevo}`,
      );
    }
  }

  transicionesPermitidas(estadoActual: string): EstadoSolicitud[] {
    return TRANSICIONES_PERMITIDAS[estadoActual as EstadoSolicitud] ?? [];
  }
}
