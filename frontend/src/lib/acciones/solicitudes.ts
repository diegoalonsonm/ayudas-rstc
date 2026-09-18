"use server";

import { revalidatePath } from "next/cache";
import {
  esquemaActualizarIntegrante,
  esquemaActualizarSolicitud,
  esquemaAyudaSolicitada,
  esquemaCambiarEstado,
  esquemaCrearIntegrante,
  esquemaEvaluacionVivienda,
  esquemaMotivo,
  esquemaRegistrarSolicitud,
  soloCamposDefinidos,
} from "../api/esquemas";
import {
  actualizarIntegrante,
  actualizarSolicitud,
  agregarAyudaSolicitada,
  cambiarEstadoSolicitud,
  crearIntegrante,
  eliminarAyudaSolicitada,
  eliminarSolicitud,
  guardarEvaluacionVivienda,
  registrarSolicitud,
  restaurarSolicitud,
} from "../api/recursos/solicitudes";
import { puede, puedeEditarSolicitud, puedeTransitar } from "../autorizacion/permisos";
import { EstadoSolicitud } from "../dominio/enums";
import type {
  AyudaSolicitada,
  EvaluacionVivienda,
  IntegranteConvivencia,
  SolicitudAyuda,
} from "../dominio/tipos";
import { sesionActual } from "../sesion/servidor";
import { fallido, intentar, type Resultado } from "./resultado";

export async function accionRegistrarSolicitud(
  entrada: unknown,
): Promise<Resultado<{ id: string }>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "solicitudesCrear")) {
    return fallido("Su rol no permite registrar solicitudes");
  }
  const validado = esquemaRegistrarSolicitud.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => registrarSolicitud(validado.data));
  if (resultado.exito) {
    revalidatePath("/solicitudes");
    revalidatePath("/panel");
  }
  return resultado;
}

export async function accionActualizarSolicitud(
  solicitudId: string,
  estadoActual: EstadoSolicitud,
  entrada: unknown,
): Promise<Resultado<SolicitudAyuda>> {
  const sesion = await sesionActual();
  if (!puedeEditarSolicitud(sesion, estadoActual)) {
    return fallido(
      "La solicitud solo se puede editar en borrador, presentada o en revisión, y con un rol autorizado",
    );
  }
  const validado = esquemaActualizarSolicitud.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const cuerpo = soloCamposDefinidos(validado.data);
  if (Object.keys(cuerpo).length === 0) {
    return fallido("No hay cambios por guardar");
  }
  const resultado = await intentar(() => actualizarSolicitud(solicitudId, cuerpo));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionCambiarEstado(
  solicitudId: string,
  estadoActual: EstadoSolicitud,
  entrada: unknown,
): Promise<Resultado<void>> {
  const sesion = await sesionActual();
  const validado = esquemaCambiarEstado.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const estadoNuevo = validado.data.estadoNuevo as EstadoSolicitud;
  if (!puedeTransitar(sesion, estadoActual, estadoNuevo)) {
    return fallido("Su rol no permite esta transición de estado");
  }
  const resultado = await intentar(async () => {
    await cambiarEstadoSolicitud(solicitudId, estadoNuevo, validado.data.motivo ?? null);
  });
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
    revalidatePath("/solicitudes");
    revalidatePath("/panel");
  }
  return resultado;
}

export async function accionEliminarSolicitud(
  solicitudId: string,
  entrada: unknown,
): Promise<Resultado<void>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "solicitudesEliminar")) {
    return fallido("Solo un coordinador parroquial o superior puede eliminar una solicitud");
  }
  const validado = esquemaMotivo.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Indique el motivo");
  }
  const resultado = await intentar(async () => {
    await eliminarSolicitud(solicitudId, validado.data.motivo);
  });
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
    revalidatePath("/solicitudes");
  }
  return resultado;
}

export async function accionRestaurarSolicitud(
  solicitudId: string,
  entrada: unknown,
): Promise<Resultado<void>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "solicitudesRestaurar")) {
    return fallido("Solo un coordinador diocesano o administrador puede restaurar una solicitud");
  }
  const validado = esquemaMotivo.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Indique el motivo");
  }
  const resultado = await intentar(async () => {
    await restaurarSolicitud(solicitudId, validado.data.motivo);
  });
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
    revalidatePath("/solicitudes");
  }
  return resultado;
}

export async function accionCrearIntegrante(
  solicitudId: string,
  entrada: unknown,
): Promise<Resultado<IntegranteConvivencia>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "integrantesEscribir")) {
    return fallido("Su rol no permite registrar integrantes");
  }
  const validado = esquemaCrearIntegrante.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => crearIntegrante(solicitudId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionActualizarIntegrante(
  solicitudId: string,
  integranteId: string,
  entrada: unknown,
): Promise<Resultado<IntegranteConvivencia>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "integrantesEscribir")) {
    return fallido("Su rol no permite editar integrantes");
  }
  const validado = esquemaActualizarIntegrante.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const cuerpo = soloCamposDefinidos(validado.data);
  if (Object.keys(cuerpo).length === 0) {
    return fallido("No hay cambios por guardar");
  }
  const resultado = await intentar(() =>
    actualizarIntegrante(solicitudId, integranteId, cuerpo),
  );
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionGuardarEvaluacionVivienda(
  solicitudId: string,
  entrada: unknown,
): Promise<Resultado<EvaluacionVivienda>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "viviendaEscribir")) {
    return fallido("Su rol no permite registrar la evaluación de vivienda");
  }
  const validado = esquemaEvaluacionVivienda.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => guardarEvaluacionVivienda(solicitudId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionAgregarAyuda(
  solicitudId: string,
  entrada: unknown,
): Promise<Resultado<AyudaSolicitada>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "ayudasAgregar")) {
    return fallido("Su rol no permite agregar tipos de ayuda");
  }
  const validado = esquemaAyudaSolicitada.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => agregarAyudaSolicitada(solicitudId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionEliminarAyuda(
  solicitudId: string,
  ayudaId: string,
  entrada: unknown,
): Promise<Resultado<void>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "ayudasEliminar")) {
    return fallido("Solo un coordinador parroquial o superior puede quitar un tipo de ayuda");
  }
  const validado = esquemaMotivo.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Indique el motivo");
  }
  const resultado = await intentar(async () => {
    await eliminarAyudaSolicitada(solicitudId, ayudaId, validado.data.motivo);
  });
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}
