import { solicitar } from "../clienteServidor";
import type { EstadoSolicitud } from "../../dominio/enums";
import type {
  AyudaSolicitada,
  DocumentoConsentimiento,
  EvaluacionVivienda,
  ExpedienteSolicitud,
  IntegranteConvivencia,
  PlanAyuda,
  SolicitudAyuda,
} from "../../dominio/tipos";

export async function listarSolicitudes(): Promise<SolicitudAyuda[]> {
  const solicitudes = await solicitar<SolicitudAyuda[]>("/solicitudes-ayuda");
  return [...solicitudes].sort((uno, otro) => otro.creadoEn.localeCompare(uno.creadoEn));
}

export async function obtenerExpediente(id: string): Promise<ExpedienteSolicitud> {
  return await solicitar<ExpedienteSolicitud>(`/solicitudes-ayuda/${id}`);
}

export async function registrarSolicitud(cuerpo: Record<string, unknown>): Promise<{ id: string }> {
  return await solicitar<{ id: string }>("/solicitudes-ayuda", { metodo: "POST", cuerpo });
}

export async function actualizarSolicitud(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<SolicitudAyuda> {
  return await solicitar<SolicitudAyuda>(`/solicitudes-ayuda/${id}`, { metodo: "PATCH", cuerpo });
}

export async function cambiarEstadoSolicitud(
  id: string,
  estadoNuevo: EstadoSolicitud,
  motivo: string | null,
): Promise<unknown> {
  return await solicitar(`/solicitudes-ayuda/${id}/estado`, {
    metodo: "POST",
    cuerpo: { estadoNuevo, motivo },
  });
}

export async function eliminarSolicitud(id: string, motivo: string): Promise<unknown> {
  return await solicitar(`/solicitudes-ayuda/${id}/eliminacion`, {
    metodo: "POST",
    cuerpo: { motivo },
  });
}

export async function restaurarSolicitud(id: string, motivo: string): Promise<unknown> {
  return await solicitar(`/solicitudes-ayuda/${id}/restauracion`, {
    metodo: "POST",
    cuerpo: { motivo },
  });
}

export async function listarIntegrantes(id: string): Promise<IntegranteConvivencia[]> {
  return await solicitar<IntegranteConvivencia[]>(`/solicitudes-ayuda/${id}/integrantes`);
}

export async function crearIntegrante(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<IntegranteConvivencia> {
  return await solicitar<IntegranteConvivencia>(`/solicitudes-ayuda/${id}/integrantes`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function actualizarIntegrante(
  id: string,
  integranteId: string,
  cuerpo: Record<string, unknown>,
): Promise<IntegranteConvivencia> {
  return await solicitar<IntegranteConvivencia>(
    `/solicitudes-ayuda/${id}/integrantes/${integranteId}`,
    { metodo: "PATCH", cuerpo },
  );
}

export async function obtenerEvaluacionVivienda(id: string): Promise<EvaluacionVivienda | null> {
  return await solicitar<EvaluacionVivienda | null>(
    `/solicitudes-ayuda/${id}/evaluacion-vivienda`,
  );
}

export async function guardarEvaluacionVivienda(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<EvaluacionVivienda> {
  return await solicitar<EvaluacionVivienda>(`/solicitudes-ayuda/${id}/evaluacion-vivienda`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function listarAyudasSolicitadas(id: string): Promise<AyudaSolicitada[]> {
  return await solicitar<AyudaSolicitada[]>(`/solicitudes-ayuda/${id}/ayudas-solicitadas`);
}

export async function agregarAyudaSolicitada(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<AyudaSolicitada> {
  return await solicitar<AyudaSolicitada>(`/solicitudes-ayuda/${id}/ayudas-solicitadas`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function eliminarAyudaSolicitada(
  id: string,
  ayudaId: string,
  motivo: string,
): Promise<unknown> {
  return await solicitar(`/solicitudes-ayuda/${id}/ayudas-solicitadas/${ayudaId}`, {
    metodo: "DELETE",
    cuerpo: { motivo },
  });
}

export async function listarPlanes(id: string): Promise<PlanAyuda[]> {
  return await solicitar<PlanAyuda[]>(`/solicitudes-ayuda/${id}/planes-ayuda`);
}

export async function crearPlan(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<PlanAyuda> {
  return await solicitar<PlanAyuda>(`/solicitudes-ayuda/${id}/planes-ayuda`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function listarDocumentos(id: string): Promise<DocumentoConsentimiento[]> {
  return await solicitar<DocumentoConsentimiento[]>(
    `/solicitudes-ayuda/${id}/documentos-consentimiento`,
  );
}
