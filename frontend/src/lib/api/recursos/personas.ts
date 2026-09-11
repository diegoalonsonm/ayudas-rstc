import { solicitar } from "../clienteServidor";
import type { Direccion, Persona, ProcesoVigentePersona } from "../../dominio/tipos";

export async function listarPersonas(): Promise<Persona[]> {
  const personas = await solicitar<Persona[]>("/personas");
  return [...personas].sort((uno, otro) =>
    `${uno.primerApellido} ${uno.primerNombre}`.localeCompare(
      `${otro.primerApellido} ${otro.primerNombre}`,
      "es",
    ),
  );
}

export async function obtenerPersona(id: string): Promise<Persona> {
  return await solicitar<Persona>(`/personas/${id}`);
}

export async function crearPersona(cuerpo: Record<string, unknown>): Promise<Persona> {
  return await solicitar<Persona>("/personas", { metodo: "POST", cuerpo });
}

export async function actualizarPersona(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<Persona> {
  return await solicitar<Persona>(`/personas/${id}`, { metodo: "PATCH", cuerpo });
}

export async function buscarProcesosVigentes(
  numeroDocumento: string,
): Promise<ProcesoVigentePersona[]> {
  return await solicitar<ProcesoVigentePersona[]>("/personas/busquedas", {
    metodo: "POST",
    cuerpo: { numeroDocumento },
  });
}

export async function listarDirecciones(personaId: string): Promise<Direccion[]> {
  return await solicitar<Direccion[]>(`/personas/${personaId}/direcciones`);
}

export async function crearDireccion(
  personaId: string,
  cuerpo: Record<string, unknown>,
): Promise<Direccion> {
  return await solicitar<Direccion>(`/personas/${personaId}/direcciones`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function actualizarDireccion(
  personaId: string,
  direccionId: string,
  cuerpo: Record<string, unknown>,
): Promise<Direccion> {
  return await solicitar<Direccion>(`/personas/${personaId}/direcciones/${direccionId}`, {
    metodo: "PATCH",
    cuerpo,
  });
}
