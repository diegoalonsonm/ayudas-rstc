import { ActorActual } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria, DecisionPlanAyuda } from "../../../domain/enums/catalogosDominio";
import { ErrorNoEncontrado, ErrorValidacion } from "../../../domain/errors/errorDominio";
import {
  RepositorioAuditoria,
  RepositorioSolicitudes,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioCifrado } from "../../../domain/services/servicioCifrado";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

export class GestionarIntegrantes {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly servicioCifrado: ServicioCifrado,
  ) {}

  listar(solicitudId: string) {
    return this.repositorioSolicitudes.listarIntegrantes(solicitudId);
  }

  async crear(
    actor: ActorActual,
    solicitudId: string,
    entrada: {
      personaId: string | null;
      nombreCompleto: string;
      sexoId: string | null;
      ocupacion: string | null;
      tipoDocumentoId: string | null;
      numeroDocumento: string | null;
      gradoAcademicoId: string | null;
      rangoIngresoId: string | null;
      cuentaConSeguro: boolean | null;
      parentescoId: string | null;
    },
  ) {
    await this.exigirSolicitud(solicitudId);
    return this.repositorioSolicitudes.crearIntegrante({
      solicitudAyudaId: solicitudId,
      personaId: entrada.personaId,
      nombreCompleto: entrada.nombreCompleto,
      sexoId: entrada.sexoId,
      ocupacion: entrada.ocupacion,
      tipoDocumentoId: entrada.tipoDocumentoId,
      numeroDocumentoCifrado: entrada.numeroDocumento
        ? this.servicioCifrado.cifrar(entrada.numeroDocumento)
        : null,
      numeroDocumentoHash: entrada.numeroDocumento
        ? this.servicioCifrado.calcularHashDocumento(entrada.numeroDocumento)
        : null,
      gradoAcademicoId: entrada.gradoAcademicoId,
      rangoIngresoId: entrada.rangoIngresoId,
      cuentaConSeguro: entrada.cuentaConSeguro,
      parentescoId: entrada.parentescoId,
      creadoPorUsuarioId: actor.usuarioId,
    });
  }

  async actualizar(
    actor: ActorActual,
    solicitudId: string,
    integranteId: string,
    entrada: Record<string, unknown>,
  ) {
    await this.exigirSolicitud(solicitudId);
    const datos: Record<string, unknown> = { ...entrada, actualizadoPorUsuarioId: actor.usuarioId };
    if (typeof entrada.numeroDocumento === "string") {
      datos.numeroDocumentoCifrado = this.servicioCifrado.cifrar(entrada.numeroDocumento);
      datos.numeroDocumentoHash = this.servicioCifrado.calcularHashDocumento(
        entrada.numeroDocumento,
      );
      delete datos.numeroDocumento;
    }
    return this.repositorioSolicitudes.actualizarIntegrante(integranteId, datos);
  }

  private async exigirSolicitud(solicitudId: string) {
    const solicitud = await this.repositorioSolicitudes.obtenerPorId(solicitudId);
    if (!solicitud) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
  }
}

export class GestionarEvaluacionVivienda {
  constructor(private readonly repositorioSolicitudes: RepositorioSolicitudes) {}

  obtener(solicitudId: string) {
    return this.repositorioSolicitudes.obtenerEvaluacion(solicitudId);
  }

  async guardar(
    actor: ActorActual,
    solicitudId: string,
    entrada: {
      tipoViviendaId: string | null;
      tipoTenenciaId: string | null;
      condicionViviendaId: string | null;
      observaciones: string | null;
    },
  ) {
    const solicitud = await this.repositorioSolicitudes.obtenerPorId(solicitudId);
    if (!solicitud) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    return this.repositorioSolicitudes.upsertEvaluacion({
      solicitudAyudaId: solicitudId,
      ...entrada,
      creadoPorUsuarioId: actor.usuarioId,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
  }
}

export class GestionarAyudasSolicitadas {
  constructor(private readonly repositorioSolicitudes: RepositorioSolicitudes) {}

  listar(solicitudId: string) {
    return this.repositorioSolicitudes.listarAyudasSolicitadas(solicitudId);
  }

  async crear(
    actor: ActorActual,
    solicitudId: string,
    entrada: { tipoAyudaId: string; detalle: string | null },
  ) {
    const solicitud = await this.repositorioSolicitudes.obtenerPorId(solicitudId);
    if (!solicitud) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    return this.repositorioSolicitudes.crearAyudaSolicitada({
      solicitudAyudaId: solicitudId,
      tipoAyudaId: entrada.tipoAyudaId,
      detalle: entrada.detalle,
      creadoPorUsuarioId: actor.usuarioId,
    });
  }

  async eliminarLogicamente(actor: ActorActual, id: string, motivo: string) {
    if (!motivo.trim()) {
      throw new ErrorValidacion("motivoEliminacion es obligatorio");
    }
    return this.repositorioSolicitudes.actualizarAyudaSolicitada(id, {
      eliminadoEn: new Date().toISOString(),
      eliminadoPorUsuarioId: actor.usuarioId,
      motivoEliminacion: motivo,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
  }
}

export class GestionarPlanesAyuda {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  listar(solicitudId: string) {
    return this.repositorioSolicitudes.listarPlanes(solicitudId);
  }

  async crear(
    actor: ActorActual,
    solicitudId: string,
    entrada: {
      decision: string;
      fechaInicio: string | null;
      fechaFin: string | null;
      motivoDecision: string | null;
    },
  ) {
    const solicitud = await this.repositorioSolicitudes.obtenerPorId(solicitudId);
    if (!solicitud) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    const plan = await this.repositorioSolicitudes.crearPlan({
      solicitudAyudaId: solicitudId,
      decision: entrada.decision,
      fechaInicio: entrada.fechaInicio,
      fechaFin: entrada.fechaFin,
      motivoDecision: entrada.motivoDecision,
      usuarioDecisorId: actor.usuarioId,
      decididoEn: new Date().toISOString(),
      creadoPorUsuarioId: actor.usuarioId,
    });
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion:
        entrada.decision === DecisionPlanAyuda.APROBADA
          ? AccionAuditoria.APROBAR_AYUDA
          : AccionAuditoria.RECHAZAR_AYUDA,
      tipoEntidad: "planes_ayuda",
      entidadId: plan.id,
      motivo: entrada.motivoDecision,
    });
    return plan;
  }

  listarDetalles(planId: string) {
    return this.repositorioSolicitudes.listarDetallesPlan(planId);
  }

  async crearDetalle(
    actor: ActorActual,
    planId: string,
    entrada: {
      tipoAyudaId: string;
      descripcion: string | null;
      frecuencia: string | null;
      montoEstimado: number | null;
    },
  ) {
    const plan = await this.repositorioSolicitudes.obtenerPlanPorId(planId);
    if (!plan) {
      throw new ErrorNoEncontrado("Plan de ayuda no encontrado");
    }
    return this.repositorioSolicitudes.crearDetallePlan({
      planAyudaId: planId,
      ...entrada,
      creadoPorUsuarioId: actor.usuarioId,
    });
  }

  listarEntregas(detallePlanId: string) {
    return this.repositorioSolicitudes.listarEntregas(detallePlanId);
  }

  async registrarEntrega(
    actor: ActorActual,
    detallePlanId: string,
    entrada: {
      fechaEntrega: string;
      descripcion: string | null;
      monto: number | null;
      observaciones: string | null;
    },
  ) {
    const detalle = await this.repositorioSolicitudes.obtenerDetallePlanPorId(detallePlanId);
    if (!detalle) {
      throw new ErrorNoEncontrado("Detalle de plan no encontrado");
    }
    const entrega = await this.repositorioSolicitudes.crearEntrega({
      detallePlanAyudaId: detallePlanId,
      fechaEntrega: entrada.fechaEntrega,
      descripcion: entrada.descripcion,
      monto: entrada.monto,
      observaciones: entrada.observaciones,
      usuarioResponsableId: actor.usuarioId,
      creadoPorUsuarioId: actor.usuarioId,
    });
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.REGISTRAR_ENTREGA,
      tipoEntidad: "entregas_ayuda",
      entidadId: entrega.id,
    });
    return entrega;
  }
}
