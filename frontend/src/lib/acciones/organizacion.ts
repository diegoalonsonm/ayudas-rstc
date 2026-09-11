"use server";

import { revalidatePath } from "next/cache";
import { esquemaItemCatalogo, esquemaMotivo, esquemaOrganizacion } from "../api/esquemas";
import {
  actualizarItemCatalogo,
  crearItemCatalogo,
  eliminarItemCatalogo,
} from "../api/recursos/catalogos";
import {
  actualizarOrganizacion,
  crearOrganizacion,
  eliminarOrganizacion,
} from "../api/recursos/organizacion";
import { puede } from "../autorizacion/permisos";
import type { SlugCatalogo } from "../dominio/enums";
import { SLUGS_CATALOGO } from "../dominio/enums";
import { sesionActual } from "../sesion/servidor";
import { fallido, intentar, type Resultado } from "./resultado";

export type NivelOrganizacion = "diocesis" | "vicarias" | "parroquias";

const NIVELES: NivelOrganizacion[] = ["diocesis", "vicarias", "parroquias"];

export async function accionCrearOrganizacion(
  nivel: string,
  entrada: unknown,
): Promise<Resultado<unknown>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "organizacionEscribir")) {
    return fallido("Solo el administrador puede modificar la estructura territorial");
  }
  if (!NIVELES.includes(nivel as NivelOrganizacion)) {
    return fallido("Nivel territorial no reconocido");
  }
  const validado = esquemaOrganizacion.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() =>
    crearOrganizacion(nivel as NivelOrganizacion, limpiar(validado.data)),
  );
  if (resultado.exito) {
    revalidatePath("/organizacion");
  }
  return resultado;
}

export async function accionActualizarOrganizacion(
  nivel: string,
  id: string,
  entrada: unknown,
): Promise<Resultado<unknown>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "organizacionEscribir")) {
    return fallido("Solo el administrador puede modificar la estructura territorial");
  }
  if (!NIVELES.includes(nivel as NivelOrganizacion)) {
    return fallido("Nivel territorial no reconocido");
  }
  const validado = esquemaOrganizacion.partial().safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() =>
    actualizarOrganizacion(nivel as NivelOrganizacion, id, limpiar(validado.data)),
  );
  if (resultado.exito) {
    revalidatePath("/organizacion");
  }
  return resultado;
}

export async function accionEliminarOrganizacion(
  nivel: string,
  id: string,
  entrada: unknown,
): Promise<Resultado<unknown>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "organizacionEscribir")) {
    return fallido("Solo el administrador puede modificar la estructura territorial");
  }
  if (!NIVELES.includes(nivel as NivelOrganizacion)) {
    return fallido("Nivel territorial no reconocido");
  }
  const validado = esquemaMotivo.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Indique el motivo");
  }
  const resultado = await intentar(() =>
    eliminarOrganizacion(nivel as NivelOrganizacion, id, validado.data.motivo),
  );
  if (resultado.exito) {
    revalidatePath("/organizacion");
  }
  return resultado;
}

export async function accionCrearItemCatalogo(
  slug: string,
  entrada: unknown,
): Promise<Resultado<unknown>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "catalogosEscribir")) {
    return fallido("Solo el administrador puede modificar los catálogos");
  }
  if (!esSlug(slug)) {
    return fallido("Catálogo no reconocido");
  }
  const validado = esquemaItemCatalogo.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => crearItemCatalogo(slug, limpiar(validado.data)));
  if (resultado.exito) {
    revalidatePath("/catalogos");
  }
  return resultado;
}

export async function accionActualizarItemCatalogo(
  slug: string,
  id: string,
  entrada: unknown,
): Promise<Resultado<unknown>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "catalogosEscribir")) {
    return fallido("Solo el administrador puede modificar los catálogos");
  }
  if (!esSlug(slug)) {
    return fallido("Catálogo no reconocido");
  }
  const validado = esquemaItemCatalogo.partial().safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const resultado = await intentar(() => actualizarItemCatalogo(slug, id, limpiar(validado.data)));
  if (resultado.exito) {
    revalidatePath("/catalogos");
  }
  return resultado;
}

export async function accionEliminarItemCatalogo(
  slug: string,
  id: string,
  entrada: unknown,
): Promise<Resultado<unknown>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "catalogosEscribir")) {
    return fallido("Solo el administrador puede modificar los catálogos");
  }
  if (!esSlug(slug)) {
    return fallido("Catálogo no reconocido");
  }
  const validado = esquemaMotivo.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Indique el motivo");
  }
  const resultado = await intentar(() => eliminarItemCatalogo(slug, id, validado.data.motivo));
  if (resultado.exito) {
    revalidatePath("/catalogos");
  }
  return resultado;
}

function esSlug(slug: string): slug is SlugCatalogo {
  return (SLUGS_CATALOGO as readonly string[]).includes(slug);
}

function limpiar(datos: Record<string, unknown>): Record<string, unknown> {
  const salida: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined && valor !== null && valor !== "") {
      salida[clave] = valor;
    }
  }
  return salida;
}
