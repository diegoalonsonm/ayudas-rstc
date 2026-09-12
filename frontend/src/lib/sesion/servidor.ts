import { redirect } from "next/navigation";
import { obtenerSesionONulo } from "../api/recursos/auth";
import { obtenerOrganizacion } from "../api/recursos/organizacion";
import { puede, type Permiso } from "../autorizacion/permisos";
import type { Organizacion, Sesion } from "../dominio/tipos";
import type { NombresOrganizacion } from "./contextoSesion";

export async function sesionActual(): Promise<Sesion> {
  const sesion = await obtenerSesionONulo();
  if (!sesion) {
    redirect("/ingreso");
  }
  return sesion;
}

export async function exigirPermiso(permiso: Permiso): Promise<Sesion> {
  const sesion = await sesionActual();
  if (!puede(sesion, permiso)) {
    redirect("/sin-acceso");
  }
  return sesion;
}

export async function organizacionSegura(): Promise<Organizacion> {
  try {
    return await obtenerOrganizacion();
  } catch {
    return { diocesis: [], vicarias: [], parroquias: [] };
  }
}

export function nombresDeOrganizacion(organizacion: Organizacion): NombresOrganizacion {
  return {
    diocesis: Object.fromEntries(organizacion.diocesis.map((item) => [item.id, item.nombre])),
    vicarias: Object.fromEntries(organizacion.vicarias.map((item) => [item.id, item.nombre])),
    parroquias: Object.fromEntries(organizacion.parroquias.map((item) => [item.id, item.nombre])),
  };
}
