import { solicitar } from "../clienteServidor";
import type { Sesion } from "../../dominio/tipos";

export async function obtenerSesion(): Promise<Sesion> {
  return await solicitar<Sesion>("/auth/sesion");
}

export async function obtenerSesionONulo(): Promise<Sesion | null> {
  try {
    return await obtenerSesion();
  } catch {
    return null;
  }
}
