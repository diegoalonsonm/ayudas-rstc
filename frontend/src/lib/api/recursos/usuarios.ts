import { solicitar } from "../clienteServidor";
import type { AsignacionUsuario, Usuario, UsuarioConAsignacion } from "../../dominio/tipos";

export async function listarUsuarios(): Promise<Usuario[]> {
  const usuarios = await solicitar<Usuario[]>("/usuarios");
  return [...usuarios].sort((uno, otro) =>
    uno.nombreCompleto.localeCompare(otro.nombreCompleto, "es"),
  );
}

export async function obtenerUsuario(id: string): Promise<UsuarioConAsignacion> {
  return await solicitar<UsuarioConAsignacion>(`/usuarios/${id}`);
}

export async function crearUsuario(cuerpo: Record<string, unknown>): Promise<Usuario> {
  return await solicitar<Usuario>("/usuarios", { metodo: "POST", cuerpo });
}

export async function actualizarUsuario(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<Usuario> {
  return await solicitar<Usuario>(`/usuarios/${id}`, { metodo: "PATCH", cuerpo });
}

export async function cambiarAsignacion(
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<AsignacionUsuario> {
  return await solicitar<AsignacionUsuario>(`/usuarios/${id}/asignaciones`, {
    metodo: "POST",
    cuerpo,
  });
}

export async function listarUsuariosConAsignacion(): Promise<UsuarioConAsignacion[]> {
  const usuarios = await listarUsuarios();
  const detalles = await Promise.all(
    usuarios.map(async (usuario) => {
      try {
        return await obtenerUsuario(usuario.id);
      } catch {
        return { usuario, asignacion: null };
      }
    }),
  );
  return detalles;
}
