import { Inject, Injectable, Scope } from "@nestjs/common";
import {
  AsignacionUsuario,
  Usuario,
} from "../../domain/entities/tiposDominio";
import { RepositorioUsuarios } from "../../domain/repositories/contratosRepositorio";
import { ErrorValidacion } from "../../domain/errors/errorDominio";
import { filaACamel, filasACamel } from "../mappers/mapeoCampos";
import { lanzarSiError, RepositorioGenericoSupabase } from "./repositorioGenericoSupabase";

@Injectable({ scope: Scope.REQUEST })
export class RepositorioUsuariosSupabase implements RepositorioUsuarios {
  constructor(@Inject(RepositorioGenericoSupabase) private readonly base: RepositorioGenericoSupabase) {}

  async obtenerPorIdentidadAutenticacion(id: string): Promise<Usuario | null> {
    const { data, error } = await this.base
      .clienteServicio()
      .from("usuarios")
      .select("*")
      .eq("identidad_autenticacion_id", id)
      .is("eliminado_en", null)
      .maybeSingle();
    lanzarSiError(error);
    return filaACamel<Usuario>((data ?? null) as Record<string, unknown> | null);
  }

  obtenerPorId(id: string): Promise<Usuario | null> {
    return this.base.obtenerPorId<Usuario>("usuarios", id);
  }

  async obtenerPorCorreo(correo: string): Promise<Usuario | null> {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("usuarios")
      .select("*")
      .eq("correo", correo.toLowerCase())
      .is("eliminado_en", null)
      .maybeSingle();
    lanzarSiError(error);
    return filaACamel<Usuario>((data ?? null) as Record<string, unknown> | null);
  }

  listar(): Promise<Usuario[]> {
    return this.base.listarActivos<Usuario>("usuarios");
  }

  async actualizarUltimoAcceso(id: string, fechaIso: string): Promise<void> {
    await this.base.actualizar("usuarios", id, { ultimoAccesoEn: fechaIso });
  }

  actualizar(id: string, datos: Record<string, unknown>): Promise<Usuario> {
    return this.base.actualizar<Usuario>("usuarios", id, datos);
  }

  async obtenerAsignacionVigente(usuarioId: string): Promise<AsignacionUsuario | null> {
    const ahora = new Date().toISOString();
    const { data, error } = await this.base
      .clienteUsuario()
      .from("asignaciones_usuario")
      .select("*, roles!inner(codigo)")
      .eq("usuario_id", usuarioId)
      .is("eliminado_en", null)
      .lte("vigente_desde", ahora)
      .or(`vigente_hasta.is.null,vigente_hasta.gt.${ahora}`)
      .order("creado_en", { ascending: false })
      .limit(1)
      .maybeSingle();
    lanzarSiError(error);
    if (!data) {
      return null;
    }
    const fila = data as Record<string, unknown> & { roles?: { codigo: string } };
    const asignacion = filaACamel<AsignacionUsuario>(fila) as AsignacionUsuario;
    asignacion.rolCodigo = fila.roles?.codigo;
    return asignacion;
  }

  async crearUsuarioConAsignacion(entrada: {
    nombreCompleto: string;
    correo: string;
    rolCodigo: string;
    identidadAutenticacionId: string;
    diocesisId: string | null;
    vicariaId: string | null;
    parroquiaId: string | null;
    motivo: string | null;
  }): Promise<string> {
    const { data, error } = await this.base.clienteUsuario().rpc("crear_usuario_con_asignacion", {
      p_nombre_completo: entrada.nombreCompleto,
      p_correo: entrada.correo,
      p_rol_codigo: entrada.rolCodigo,
      p_identidad_autenticacion_id: entrada.identidadAutenticacionId,
      p_diocesis_id: entrada.diocesisId,
      p_vicaria_id: entrada.vicariaId,
      p_parroquia_id: entrada.parroquiaId,
      p_motivo: entrada.motivo,
    });
    lanzarSiError(error);
    if (!data) {
      throw new ErrorValidacion("No se pudo crear el usuario");
    }
    return data as string;
  }
}
