"use server";

import { revalidatePath } from "next/cache";
import {
  esquemaActualizarPersona,
  esquemaBuscarPersona,
  esquemaCrearDireccion,
  esquemaCrearPersona,
  soloCamposDefinidos,
} from "../api/esquemas";
import {
  actualizarDireccion,
  actualizarPersona,
  buscarProcesosVigentes,
  crearDireccion,
  crearPersona,
} from "../api/recursos/personas";
import { puede } from "../autorizacion/permisos";
import type { Direccion, Persona, ProcesoVigentePersona } from "../dominio/tipos";
import { sesionActual } from "../sesion/servidor";
import { correcto, fallido, intentar, type Resultado } from "./resultado";

export async function accionBuscarProcesosVigentes(
  entrada: unknown,
): Promise<Resultado<ProcesoVigentePersona[]>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "personasBuscar")) {
    return fallido("Su rol no permite buscar personas");
  }
  const validado = esquemaBuscarPersona.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  return await intentar(() => buscarProcesosVigentes(validado.data.numeroDocumento));
}

export async function accionCrearPersona(entrada: unknown): Promise<Resultado<Persona>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "personasCrear")) {
    return fallido("Su rol no permite registrar personas");
  }
  const validado = esquemaCrearPersona.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => crearPersona(validado.data));
  if (resultado.exito) {
    revalidatePath("/personas");
  }
  return resultado;
}

export async function accionActualizarPersona(
  personaId: string,
  entrada: unknown,
): Promise<Resultado<Persona>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "personasEditar")) {
    return fallido("Su rol no permite editar personas");
  }
  const validado = esquemaActualizarPersona.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const cuerpo = soloCamposDefinidos(validado.data);
  if (Object.keys(cuerpo).length === 0) {
    return fallido("No hay cambios por guardar");
  }
  const resultado = await intentar(() => actualizarPersona(personaId, cuerpo));
  if (resultado.exito) {
    revalidatePath(`/personas/${personaId}`);
    revalidatePath("/personas");
  }
  return resultado;
}

export async function accionCrearDireccion(
  personaId: string,
  entrada: unknown,
): Promise<Resultado<Direccion>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "direccionesEscribir")) {
    return fallido("Su rol no permite registrar direcciones");
  }
  const validado = esquemaCrearDireccion.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => crearDireccion(personaId, validado.data));
  if (resultado.exito) {
    revalidatePath(`/personas/${personaId}`);
  }
  return resultado;
}

export async function accionActualizarDireccion(
  personaId: string,
  direccionId: string,
  entrada: unknown,
): Promise<Resultado<Direccion>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "direccionesEscribir")) {
    return fallido("Su rol no permite editar direcciones");
  }
  const validado = esquemaCrearDireccion.partial().safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const cuerpo = soloCamposDefinidos(validado.data);
  if (Object.keys(cuerpo).length === 0) {
    return correcto({} as Direccion);
  }
  const resultado = await intentar(() => actualizarDireccion(personaId, direccionId, cuerpo));
  if (resultado.exito) {
    revalidatePath(`/personas/${personaId}`);
  }
  return resultado;
}