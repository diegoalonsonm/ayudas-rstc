import { Inject, Injectable, Scope } from "@nestjs/common";
import {
  AyudaSolicitada,
  DetallePlanAyuda,
  Direccion,
  EntregaAyuda,
  EvaluacionVivienda,
  ExpedienteSolicitud,
  IntegranteConvivencia,
  PlanAyuda,
  SolicitudAyuda,
} from "../../domain/entities/tiposDominio";
import { RepositorioSolicitudes } from "../../domain/repositories/contratosRepositorio";
import { ErrorValidacion } from "../../domain/errors/errorDominio";
import { filaACamel, filasACamel } from "../mappers/mapeoCampos";
import { lanzarSiError, RepositorioGenericoSupabase } from "./repositorioGenericoSupabase";

@Injectable({ scope: Scope.REQUEST })
export class RepositorioSolicitudesSupabase implements RepositorioSolicitudes {
  constructor(
    @Inject(RepositorioGenericoSupabase) private readonly base: RepositorioGenericoSupabase,
  ) {}

  async registrarConAyudas(entrada: {
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
  }): Promise<string> {
    const { data, error } = await this.base.clienteUsuario().rpc("registrar_solicitud_con_ayudas", {
      p_persona_solicitante_id: entrada.personaSolicitanteId,
      p_parroquia_receptora_id: entrada.parroquiaReceptoraId,
      p_sector_oficial: entrada.sectorOficial,
      p_usuario_entrevistador_id: entrada.usuarioEntrevistadorId,
      p_fecha_entrevista: entrada.fechaEntrevista,
      p_fecha_visita: entrada.fechaVisita,
      p_observaciones: entrada.observaciones,
      p_tipos_ayuda: entrada.tiposAyuda,
      p_detalles: entrada.detalles,
      p_estado: entrada.estado,
      p_creado_por_usuario_id: entrada.creadoPorUsuarioId,
    });
    lanzarSiError(error);
    if (!data) {
      throw new ErrorValidacion("No se pudo registrar la solicitud");
    }
    return data as string;
  }

  async listar(filtros: Record<string, unknown> = {}): Promise<SolicitudAyuda[]> {
    return this.base.listarActivos<SolicitudAyuda>("solicitudes_ayuda", filtros);
  }

  obtenerPorId(id: string): Promise<SolicitudAyuda | null> {
    return this.base.obtenerPorId<SolicitudAyuda>("solicitudes_ayuda", id);
  }

  actualizar(id: string, datos: Record<string, unknown>): Promise<SolicitudAyuda> {
    return this.base.actualizar<SolicitudAyuda>("solicitudes_ayuda", id, datos);
  }

  async obtenerExpediente(id: string): Promise<ExpedienteSolicitud | null> {
    const solicitud = await this.obtenerPorId(id);
    if (!solicitud) {
      return null;
    }
    const [
      persona,
      direccionActual,
      integrantes,
      evaluacionVivienda,
      ayudasSolicitadas,
      planes,
      documentos,
      historial,
    ] = await Promise.all([
      this.base.obtenerPorId("personas", solicitud.personaSolicitanteId),
      this.cargarDireccionActual(solicitud.personaSolicitanteId),
      this.listarIntegrantes(id),
      this.obtenerEvaluacion(id),
      this.listarAyudasSolicitadas(id),
      this.listarPlanes(id),
      this.base.listarActivos("documentos_consentimiento", { solicitudAyudaId: id }),
      this.cargarHistorial(id),
    ]);
    return {
      solicitud,
      persona: persona as ExpedienteSolicitud["persona"],
      direccionActual,
      integrantes,
      evaluacionVivienda,
      ayudasSolicitadas,
      planes,
      documentos: documentos as ExpedienteSolicitud["documentos"],
      historialEstados: historial,
    };
  }

  async listarIntegrantes(solicitudId: string): Promise<IntegranteConvivencia[]> {
    return this.base.listarActivos<IntegranteConvivencia>("integrantes_convivencia", {
      solicitudAyudaId: solicitudId,
    });
  }

  crearIntegrante(datos: Record<string, unknown>): Promise<IntegranteConvivencia> {
    return this.base.insertar<IntegranteConvivencia>("integrantes_convivencia", datos);
  }

  actualizarIntegrante(id: string, datos: Record<string, unknown>): Promise<IntegranteConvivencia> {
    return this.base.actualizar<IntegranteConvivencia>("integrantes_convivencia", id, datos);
  }

  async obtenerEvaluacion(solicitudId: string): Promise<EvaluacionVivienda | null> {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("evaluaciones_vivienda")
      .select("*")
      .eq("solicitud_ayuda_id", solicitudId)
      .is("eliminado_en", null)
      .maybeSingle();
    lanzarSiError(error);
    return filaACamel<EvaluacionVivienda>((data ?? null) as Record<string, unknown> | null);
  }

  async upsertEvaluacion(datos: Record<string, unknown>): Promise<EvaluacionVivienda> {
    const existente = await this.obtenerEvaluacion(String(datos.solicitudAyudaId));
    if (existente) {
      return this.base.actualizar<EvaluacionVivienda>("evaluaciones_vivienda", existente.id, datos);
    }
    return this.base.insertar<EvaluacionVivienda>("evaluaciones_vivienda", datos);
  }

  listarAyudasSolicitadas(solicitudId: string): Promise<AyudaSolicitada[]> {
    return this.base.listarActivos<AyudaSolicitada>("ayudas_solicitadas", {
      solicitudAyudaId: solicitudId,
    });
  }

  crearAyudaSolicitada(datos: Record<string, unknown>): Promise<AyudaSolicitada> {
    return this.base.insertar<AyudaSolicitada>("ayudas_solicitadas", datos);
  }

  actualizarAyudaSolicitada(id: string, datos: Record<string, unknown>): Promise<AyudaSolicitada> {
    return this.base.actualizar<AyudaSolicitada>("ayudas_solicitadas", id, datos);
  }

  listarPlanes(solicitudId: string): Promise<PlanAyuda[]> {
    return this.base.listarActivos<PlanAyuda>("planes_ayuda", { solicitudAyudaId: solicitudId });
  }

  crearPlan(datos: Record<string, unknown>): Promise<PlanAyuda> {
    return this.base.insertar<PlanAyuda>("planes_ayuda", datos);
  }

  actualizarPlan(id: string, datos: Record<string, unknown>): Promise<PlanAyuda> {
    return this.base.actualizar<PlanAyuda>("planes_ayuda", id, datos);
  }

  obtenerPlanPorId(id: string): Promise<PlanAyuda | null> {
    return this.base.obtenerPorId<PlanAyuda>("planes_ayuda", id);
  }

  listarDetallesPlan(planId: string): Promise<DetallePlanAyuda[]> {
    return this.base.listarActivos<DetallePlanAyuda>("detalles_plan_ayuda", { planAyudaId: planId });
  }

  crearDetallePlan(datos: Record<string, unknown>): Promise<DetallePlanAyuda> {
    return this.base.insertar<DetallePlanAyuda>("detalles_plan_ayuda", datos);
  }

  actualizarDetallePlan(id: string, datos: Record<string, unknown>): Promise<DetallePlanAyuda> {
    return this.base.actualizar<DetallePlanAyuda>("detalles_plan_ayuda", id, datos);
  }

  obtenerDetallePlanPorId(id: string): Promise<DetallePlanAyuda | null> {
    return this.base.obtenerPorId<DetallePlanAyuda>("detalles_plan_ayuda", id);
  }

  listarEntregas(detallePlanId: string): Promise<EntregaAyuda[]> {
    return this.base.listarActivos<EntregaAyuda>("entregas_ayuda", {
      detallePlanAyudaId: detallePlanId,
    });
  }

  crearEntrega(datos: Record<string, unknown>): Promise<EntregaAyuda> {
    return this.base.insertar<EntregaAyuda>("entregas_ayuda", datos);
  }

  actualizarEntrega(id: string, datos: Record<string, unknown>): Promise<EntregaAyuda> {
    return this.base.actualizar<EntregaAyuda>("entregas_ayuda", id, datos);
  }

  private async cargarDireccionActual(personaId: string) {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("direcciones")
      .select("*")
      .eq("persona_id", personaId)
      .eq("es_actual", true)
      .is("eliminado_en", null)
      .maybeSingle();
    lanzarSiError(error);
    return filaACamel<Direccion>((data ?? null) as Record<string, unknown> | null);
  }

  private async cargarHistorial(solicitudId: string) {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("historial_estados_solicitud")
      .select("*")
      .eq("solicitud_ayuda_id", solicitudId)
      .order("ocurrido_en", { ascending: true });
    lanzarSiError(error);
    return filasACamel<ExpedienteSolicitud["historialEstados"][number]>(
      (data ?? []) as Record<string, unknown>[],
    );
  }
}
