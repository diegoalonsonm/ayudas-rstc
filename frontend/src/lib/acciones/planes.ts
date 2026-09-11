"use server";

import { revalidatePath } from "next/cache";
import {
  esquemaCrearDetallePlan,
  esquemaCrearEntrega,
  esquemaCrearPlan,
} from "../api/esquemas";
import { crearDetallePlan, registrarEntrega } from "../api/recursos/planes";
import { crearPlan } from "../api/recursos/solicitudes";
import { puede, puedeDecidirPlan } from "../autorizacion/permisos";
import { EstadoSolicitud } from "../dominio/enums";
import type { DetallePlanAyuda, EntregaAyuda, PlanAyuda } from "../dominio/tipos";
import { sesionActual } from "../sesion/servidor";
import { fallido, intentar, type Resultado } from "./resultado";

export async function accionCrearPlan(
  solicitudId: string,
  estadoActual: EstadoSolicitud,
  entrada: unknown,
): Promise<Resultado<PlanAyuda>> {
  const sesion = await sesionActual();
  if (!puedeDecidirPlan(sesion, estadoActual)) {
    return fallido(
      "El plan de ayuda se registra con la solicitud en revisión y con rol de coordinador parroquial o superior",
    );
  }
  const validado = esquemaCrearPlan.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => crearPlan(solicitudId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionCrearDetallePlan(
  solicitudId: string,
  planId: string,
  entrada: unknown,
): Promise<Resultado<DetallePlanAyuda>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "planesDetallesCrear")) {
    return fallido("Solo un coordinador parroquial o superior puede definir el detalle del plan");
  }
  const validado = esquemaCrearDetallePlan.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => crearDetallePlan(planId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionRegistrarEntrega(
  solicitudId: string,
  detalleId: string,
  entrada: unknown,
): Promise<Resultado<EntregaAyuda>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "entregasRegistrar")) {
    return fallido("Su rol no permite registrar entregas");
  }
  const validado = esquemaCrearEntrega.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => registrarEntrega(detalleId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}
