import { solicitar } from "../clienteServidor";
import type { Diocesis, Organizacion, Parroquia, Vicaria } from "../../dominio/tipos";

export async function listarDiocesis(): Promise<Diocesis[]> {
  return await solicitar<Diocesis[]>("/diocesis");
}

export async function listarVicarias(): Promise<Vicaria[]> {
  return await solicitar<Vicaria[]>("/vicarias");
}

export async function listarParroquias(): Promise<Parroquia[]> {
  return await solicitar<Parroquia[]>("/parroquias");
}

export async function obtenerOrganizacion(): Promise<Organizacion> {
  const [diocesis, vicarias, parroquias] = await Promise.all([
    listarDiocesis(),
    listarVicarias(),
    listarParroquias(),
  ]);
  return { diocesis, vicarias, parroquias };
}

export async function crearOrganizacion(
  nivel: "diocesis" | "vicarias" | "parroquias",
  cuerpo: Record<string, unknown>,
): Promise<unknown> {
  return await solicitar(`/${nivel}`, { metodo: "POST", cuerpo });
}

export async function actualizarOrganizacion(
  nivel: "diocesis" | "vicarias" | "parroquias",
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<unknown> {
  return await solicitar(`/${nivel}/${id}`, { metodo: "PATCH", cuerpo });
}

export async function eliminarOrganizacion(
  nivel: "diocesis" | "vicarias" | "parroquias",
  id: string,
  motivo: string,
): Promise<unknown> {
  return await solicitar(`/${nivel}/${id}`, { metodo: "DELETE", cuerpo: { motivo } });
}
