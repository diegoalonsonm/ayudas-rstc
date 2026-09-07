import { ActorActual, SolicitudAyuda } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria, EstadoSolicitud } from "../../../domain/enums/catalogosDominio";
import { ErrorNoEncontrado, ErrorValidacion } from "../../../domain/errors/errorDominio";
import {
  RepositorioAuditoria,
  RepositorioOrganizacion,
  RepositorioSolicitudes,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioAlcance } from "../../../domain/services/servicioAlcance";
import { ServicioEstadosSolicitud } from "../../../domain/services/servicioEstadosSolicitud";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

export class RegistrarSolicitud {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioOrganizacion: RepositorioOrganizacion,
    private readonly servicioAlcance = new ServicioAlcance(),
  ) {}

  async ejecutar(
    actor: ActorActual,
    entrada: {
      personaSolicitanteId: string;
      parroquiaReceptoraId: string;
      sectorOficial: string | null;
      fechaEntrevista: string | null;
      fechaVisita: string | null;
      observaciones: string | null;
      tiposAyuda: string[];
      detalles: string[] | null;
      estado: string;
    },
  ): Promise<{ id: string }> {
    const parroquia = await this.repositorioOrganizacion.obtenerParroquia(
      entrada.parroquiaReceptoraId,
    );
    if (!parroquia) {
      throw new ErrorNoEncontrado("Parroquia no encontrada");
    }
    const vicaria = await this.repositorioOrganizacion.obtenerVicaria(parroquia.vicariaId);
    if (!vicaria) {
      throw new ErrorNoEncontrado("Vicaría no encontrada");
    }
    this.servicioAlcance.exigirParroquiaEnAlcance(actor, parroquia, vicaria);
    if (!entrada.tiposAyuda.length) {
      throw new ErrorValidacion("Debe indicar al menos un tipo de ayuda");
    }
    const id = await this.repositorioSolicitudes.registrarConAyudas({
      personaSolicitanteId: entrada.personaSolicitanteId,
      parroquiaReceptoraId: entrada.parroquiaReceptoraId,
      sectorOficial: entrada.sectorOficial,
      usuarioEntrevistadorId: actor.usuarioId,
      fechaEntrevista: entrada.fechaEntrevista,
      fechaVisita: entrada.fechaVisita,
      observaciones: entrada.observaciones,
      tiposAyuda: entrada.tiposAyuda,
      detalles: entrada.detalles,
      estado: entrada.estado || EstadoSolicitud.BORRADOR,
      creadoPorUsuarioId: actor.usuarioId,
    });
    return { id };
  }
}

export class ListarSolicitudes {
  constructor(private readonly repositorioSolicitudes: RepositorioSolicitudes) {}

  ejecutar(filtros?: Record<string, unknown>) {
    return this.repositorioSolicitudes.listar(filtros);
  }
}

export class ObtenerExpediente {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual, id: string) {
    const expediente = await this.repositorioSolicitudes.obtenerExpediente(id);
    if (!expediente) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.CONSULTAR_EXPEDIENTE,
      tipoEntidad: "solicitudes_ayuda",
      entidadId: id,
    });
    return expediente;
  }
}

export class ActualizarSolicitud {
  constructor(private readonly repositorioSolicitudes: RepositorioSolicitudes) {}

  async ejecutar(actor: ActorActual, id: string, datos: Partial<SolicitudAyuda>) {
    const actual = await this.repositorioSolicitudes.obtenerPorId(id);
    if (!actual) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    return this.repositorioSolicitudes.actualizar(id, {
      ...datos,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
  }
}

export class CambiarEstadoSolicitud {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioAuditoria: RepositorioAuditoria,
    private readonly servicioEstados = new ServicioEstadosSolicitud(),
  ) {}

  async ejecutar(
    actor: ActorActual,
    id: string,
    estadoNuevo: string,
    motivo: string | null,
  ) {
    const actual = await this.repositorioSolicitudes.obtenerPorId(id);
    if (!actual) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    this.servicioEstados.validarTransicion(actual.estado, estadoNuevo);
    const datos: Record<string, unknown> = {
      estado: estadoNuevo,
      observaciones: motivo ?? actual.observaciones,
      actualizadoPorUsuarioId: actor.usuarioId,
    };
    if (estadoNuevo === EstadoSolicitud.PRESENTADA && !actual.presentadaEn) {
      datos.presentadaEn = new Date().toISOString();
    }
    const actualizada = await this.repositorioSolicitudes.actualizar(id, datos);
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.CAMBIAR_ESTADO_SOLICITUD,
      tipoEntidad: "solicitudes_ayuda",
      entidadId: id,
      motivo,
      datosAnteriores: { estado: actual.estado },
      datosNuevos: { estado: estadoNuevo },
    });
    return actualizada;
  }
}

export class EliminarSolicitud {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual, id: string, motivo: string) {
    if (!motivo.trim()) {
      throw new ErrorValidacion("motivoEliminacion es obligatorio");
    }
    const actual = await this.repositorioSolicitudes.obtenerPorId(id);
    if (!actual) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    const actualizada = await this.repositorioSolicitudes.actualizar(id, {
      eliminadoEn: new Date().toISOString(),
      eliminadoPorUsuarioId: actor.usuarioId,
      motivoEliminacion: motivo,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.ELIMINAR_LOGICAMENTE,
      tipoEntidad: "solicitudes_ayuda",
      entidadId: id,
      motivo,
    });
    return actualizada;
  }
}

export class RestaurarSolicitud {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual, id: string, motivo: string) {
    if (!motivo.trim()) {
      throw new ErrorValidacion("El motivo de restauración es obligatorio");
    }
    const actualizada = await this.repositorioSolicitudes.actualizar(id, {
      eliminadoEn: null,
      eliminadoPorUsuarioId: null,
      motivoEliminacion: null,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.RESTAURAR,
      tipoEntidad: "solicitudes_ayuda",
      entidadId: id,
      motivo,
    });
    return actualizada;
  }
}
