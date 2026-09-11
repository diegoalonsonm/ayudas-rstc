import { solicitar } from "../clienteServidor";
import type { DetallePlanAyuda, EntregaAyuda } from "../../dominio/tipos";

export async function listarDetallesPlan(planId: string): Promise<DetallePlanAyuda[]> {
  return await solicitar<DetallePlanAyuda[]>(`/planes-ayuda/${planId}/detalles`);
}

export async function crearDetallePlan(
  planId: string,
  cuerpo: Record<string, unknown>,
): Promise<DetallePlanAyuda> {
  return await solicitar<DetallePlanAyuda>(`/planes-ayuda/${planId}/detalles`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function listarEntregas(detalleId: string): Promise<EntregaAyuda[]> {
  return await solicitar<EntregaAyuda[]>(`/detalles-plan-ayuda/${detalleId}/entregas`);
}

export async function registrarEntrega(
  detalleId: string,
  cuerpo: Record<string, unknown>,
): Promise<EntregaAyuda> {
  return await solicitar<EntregaAyuda>(`/detalles-plan-ayuda/${detalleId}/entregas`, {
    metodo: "POST",
    cuerpo,
  });
}

export type DetalleConEntregas = DetallePlanAyuda & { entregas: EntregaAyuda[] };

export async function listarDetallesConEntregas(planId: string): Promise<DetalleConEntregas[]> {
  const detalles = await listarDetallesPlan(planId);
  const entregas = await Promise.all(detalles.map((detalle) => listarEntregas(detalle.id)));
  return detalles.map((detalle, indice) => ({ ...detalle, entregas: entregas[indice] }));
}
