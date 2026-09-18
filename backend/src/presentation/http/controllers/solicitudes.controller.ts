import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { SERVICIO_CIFRADO } from "../../../application/ports/puertosAplicacion";
import {
  GestionarAyudasSolicitadas,
  GestionarEvaluacionVivienda,
  GestionarIntegrantes,
  GestionarPlanesAyuda,
} from "../../../application/useCases/solicitudes/gestionarExpediente";
import {
  ActualizarSolicitud,
  CambiarEstadoSolicitud,
  EliminarSolicitud,
  ListarSolicitudes,
  ObtenerExpediente,
  RegistrarSolicitud,
  RestaurarSolicitud,
} from "../../../application/useCases/solicitudes/gestionarSolicitudes";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import {
  REPOSITORIO_AUDITORIA,
  REPOSITORIO_ORGANIZACION,
  REPOSITORIO_SOLICITUDES,
  RepositorioAuditoria,
  RepositorioOrganizacion,
  RepositorioSolicitudes,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioCifrado } from "../../../domain/services/servicioCifrado";
import { Actor } from "../decorators/actorActual";
import {
  AyudaSolicitadaDto,
  CambiarEstadoDto,
  CrearDetallePlanDto,
  CrearEntregaDto,
  CrearIntegranteDto,
  CrearPlanDto,
  EvaluacionViviendaDto,
  MotivoDto,
  RegistrarSolicitudDto,
} from "../dto/dtosHttp";

@Controller("solicitudes-ayuda")
export class SolicitudesController {
  constructor(
    @Inject(REPOSITORIO_SOLICITUDES) private readonly repositorioSolicitudes: RepositorioSolicitudes,
    @Inject(REPOSITORIO_ORGANIZACION) private readonly repositorioOrganizacion: RepositorioOrganizacion,
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
    @Inject(SERVICIO_CIFRADO) private readonly servicioCifrado: ServicioCifrado,
  ) {}

  @Get()
  listar() {
    return new ListarSolicitudes(this.repositorioSolicitudes).ejecutar();
  }

  @Post()
  registrar(@Actor() actor: ActorActual, @Body() dto: RegistrarSolicitudDto) {
    return new RegistrarSolicitud(this.repositorioSolicitudes, this.repositorioOrganizacion).ejecutar(actor, {
      personaSolicitanteId: dto.personaSolicitanteId,
      parroquiaReceptoraId: dto.parroquiaReceptoraId,
      sectorOficial: dto.sectorOficial ?? null,
      fechaEntrevista: dto.fechaEntrevista ?? null,
      fechaVisita: dto.fechaVisita ?? null,
      observaciones: dto.observaciones ?? null,
      tiposAyuda: dto.tiposAyuda,
      detalles: dto.detalles ?? null,
      estado: dto.estado ?? "BORRADOR",
    });
  }

  @Get(":id")
  obtener(@Actor() actor: ActorActual, @Param("id") id: string) {
    return new ObtenerExpediente(this.repositorioSolicitudes, this.repositorioAuditoria).ejecutar(actor, id);
  }

  @Patch(":id")
  actualizar(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: Partial<RegistrarSolicitudDto>) {
    return new ActualizarSolicitud(this.repositorioSolicitudes).ejecutar(actor, id, dto);
  }

  @Post(":id/estado")
  cambiarEstado(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: CambiarEstadoDto) {
    return new CambiarEstadoSolicitud(this.repositorioSolicitudes, this.repositorioAuditoria).ejecutar(
      actor,
      id,
      dto.estadoNuevo,
      dto.motivo ?? null,
    );
  }

  @Post(":id/eliminacion")
  eliminar(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: MotivoDto) {
    return new EliminarSolicitud(this.repositorioSolicitudes, this.repositorioAuditoria).ejecutar(
      actor,
      id,
      dto.motivo,
    );
  }

  @Post(":id/restauracion")
  restaurar(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: MotivoDto) {
    return new RestaurarSolicitud(this.repositorioSolicitudes, this.repositorioAuditoria).ejecutar(
      actor,
      id,
      dto.motivo,
    );
  }

  @Get(":id/integrantes")
  listarIntegrantes(@Param("id") id: string) {
    return new GestionarIntegrantes(this.repositorioSolicitudes, this.servicioCifrado).listar(id);
  }

  @Post(":id/integrantes")
  crearIntegrante(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: CrearIntegranteDto) {
    return new GestionarIntegrantes(this.repositorioSolicitudes, this.servicioCifrado).crear(actor, id, {
      personaId: dto.personaId ?? null,
      nombreCompleto: dto.nombreCompleto,
      sexoId: dto.sexoId ?? null,
      ocupacion: dto.ocupacion ?? null,
      tipoDocumentoId: dto.tipoDocumentoId ?? null,
      numeroDocumento: dto.numeroDocumento ?? null,
      gradoAcademicoId: dto.gradoAcademicoId ?? null,
      rangoIngresoId: dto.rangoIngresoId ?? null,
      cuentaConSeguro: dto.cuentaConSeguro ?? null,
      parentescoId: dto.parentescoId ?? null,
    });
  }

  @Patch(":id/integrantes/:integranteId")
  actualizarIntegrante(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Param("integranteId") integranteId: string,
    @Body() dto: Partial<CrearIntegranteDto>,
  ) {
    return new GestionarIntegrantes(this.repositorioSolicitudes, this.servicioCifrado).actualizar(
      actor,
      id,
      integranteId,
      dto as Record<string, unknown>,
    );
  }

  @Get(":id/evaluacion-vivienda")
  obtenerEvaluacion(@Param("id") id: string) {
    return new GestionarEvaluacionVivienda(this.repositorioSolicitudes).obtener(id);
  }

  @Post(":id/evaluacion-vivienda")
  guardarEvaluacion(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: EvaluacionViviendaDto) {
    return new GestionarEvaluacionVivienda(this.repositorioSolicitudes).guardar(actor, id, {
      tipoViviendaId: dto.tipoViviendaId ?? null,
      tipoTenenciaId: dto.tipoTenenciaId ?? null,
      condicionViviendaId: dto.condicionViviendaId ?? null,
      observaciones: dto.observaciones ?? null,
    });
  }

  @Get(":id/ayudas-solicitadas")
  listarAyudas(@Param("id") id: string) {
    return new GestionarAyudasSolicitadas(this.repositorioSolicitudes).listar(id);
  }

  @Post(":id/ayudas-solicitadas")
  crearAyuda(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: AyudaSolicitadaDto) {
    return new GestionarAyudasSolicitadas(this.repositorioSolicitudes).crear(actor, id, {
      tipoAyudaId: dto.tipoAyudaId,
      detalle: dto.detalle ?? null,
    });
  }

  @Delete(":id/ayudas-solicitadas/:ayudaId")
  eliminarAyuda(
    @Actor() actor: ActorActual,
    @Param("ayudaId") ayudaId: string,
    @Body() dto: MotivoDto,
  ) {
    return new GestionarAyudasSolicitadas(this.repositorioSolicitudes).eliminarLogicamente(
      actor,
      ayudaId,
      dto.motivo,
    );
  }

  @Get(":id/planes-ayuda")
  listarPlanes(@Param("id") id: string) {
    return new GestionarPlanesAyuda(this.repositorioSolicitudes, this.repositorioAuditoria).listar(id);
  }

  @Post(":id/planes-ayuda")
  crearPlan(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: CrearPlanDto) {
    return new GestionarPlanesAyuda(this.repositorioSolicitudes, this.repositorioAuditoria).crear(actor, id, {
      decision: dto.decision,
      fechaInicio: dto.fechaInicio ?? null,
      fechaFin: dto.fechaFin ?? null,
      motivoDecision: dto.motivoDecision ?? null,
    });
  }
}

@Controller()
export class PlanesAyudaController {
  constructor(
    @Inject(REPOSITORIO_SOLICITUDES) private readonly repositorioSolicitudes: RepositorioSolicitudes,
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  @Get("planes-ayuda/:planId/detalles")
  listarDetalles(@Param("planId") planId: string) {
    return new GestionarPlanesAyuda(this.repositorioSolicitudes, this.repositorioAuditoria).listarDetalles(planId);
  }

  @Post("planes-ayuda/:planId/detalles")
  crearDetalle(@Actor() actor: ActorActual, @Param("planId") planId: string, @Body() dto: CrearDetallePlanDto) {
    return new GestionarPlanesAyuda(this.repositorioSolicitudes, this.repositorioAuditoria).crearDetalle(
      actor,
      planId,
      {
        tipoAyudaId: dto.tipoAyudaId,
        descripcion: dto.descripcion ?? null,
        frecuencia: dto.frecuencia ?? null,
        montoEstimado: dto.montoEstimado ?? null,
      },
    );
  }

  @Get("detalles-plan-ayuda/:detalleId/entregas")
  listarEntregas(@Param("detalleId") detalleId: string) {
    return new GestionarPlanesAyuda(this.repositorioSolicitudes, this.repositorioAuditoria).listarEntregas(detalleId);
  }

  @Post("detalles-plan-ayuda/:detalleId/entregas")
  registrarEntrega(
    @Actor() actor: ActorActual,
    @Param("detalleId") detalleId: string,
    @Body() dto: CrearEntregaDto,
  ) {
    return new GestionarPlanesAyuda(this.repositorioSolicitudes, this.repositorioAuditoria).registrarEntrega(
      actor,
      detalleId,
      {
        fechaEntrega: dto.fechaEntrega,
        descripcion: dto.descripcion ?? null,
        monto: dto.monto ?? null,
        observaciones: dto.observaciones ?? null,
      },
    );
  }
}
