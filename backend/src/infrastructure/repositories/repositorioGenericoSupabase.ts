import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { RepositorioGenerico } from "../../domain/repositories/contratosRepositorio";
import { ErrorConflicto, ErrorNoEncontrado, ErrorValidacion } from "../../domain/errors/errorDominio";
import { camelAFila, filaACamel, filasACamel } from "../mappers/mapeoCampos";
import { FabricaClienteSupabase } from "../supabase/fabricaClienteSupabase";

function extraerToken(request: Request): string | null {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}

export function lanzarSiError(error: { message?: string; code?: string } | null): void {
  if (!error) {
    return;
  }
  const mensaje = error.message ?? "Error de persistencia";
  if (error.code === "23505" || mensaje.toLowerCase().includes("duplicate") || mensaje.includes("vigente")) {
    throw new ErrorConflicto(mensaje);
  }
  if (error.code === "PGRST116") {
    throw new ErrorNoEncontrado(mensaje);
  }
  throw new ErrorValidacion(mensaje);
}

@Injectable({ scope: Scope.REQUEST })
export class RepositorioGenericoSupabase implements RepositorioGenerico {
  constructor(
    private readonly fabrica: FabricaClienteSupabase,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  clienteUsuario() {
    const token = extraerToken(this.request);
    if (token) {
      return this.fabrica.crearClienteUsuario(token);
    }
    return this.fabrica.crearClienteAnonimo();
  }

  clienteServicio() {
    return this.fabrica.crearClienteServicio();
  }

  async listarActivos<T>(tabla: string, filtros: Record<string, unknown> = {}): Promise<T[]> {
    let consulta = this.clienteUsuario().from(tabla).select("*").is("eliminado_en", null);
    const filaFiltros = camelAFila(filtros);
    for (const [clave, valor] of Object.entries(filaFiltros)) {
      consulta = consulta.eq(clave, valor as never);
    }
    const { data, error } = await consulta;
    lanzarSiError(error);
    return filasACamel<T>((data ?? []) as Record<string, unknown>[]);
  }

  async obtenerPorId<T>(tabla: string, id: string): Promise<T | null> {
    const { data, error } = await this.clienteUsuario().from(tabla).select("*").eq("id", id).maybeSingle();
    lanzarSiError(error);
    return filaACamel<T>((data ?? null) as Record<string, unknown> | null);
  }

  async insertar<T>(tabla: string, datos: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.clienteUsuario()
      .from(tabla)
      .insert(camelAFila(datos))
      .select("*")
      .single();
    lanzarSiError(error);
    return filaACamel<T>(data as Record<string, unknown>) as T;
  }

  async actualizar<T>(tabla: string, id: string, datos: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.clienteUsuario()
      .from(tabla)
      .update(camelAFila(datos))
      .eq("id", id)
      .select("*")
      .single();
    lanzarSiError(error);
    return filaACamel<T>(data as Record<string, unknown>) as T;
  }

  async eliminarLogicamente<T>(tabla: string, id: string, motivo: string, usuarioId: string): Promise<T> {
    return this.actualizar<T>(tabla, id, {
      eliminadoEn: new Date().toISOString(),
      eliminadoPorUsuarioId: usuarioId,
      motivoEliminacion: motivo,
      actualizadoPorUsuarioId: usuarioId,
    });
  }

  async restaurar<T>(tabla: string, id: string, usuarioId: string): Promise<T> {
    return this.actualizar<T>(tabla, id, {
      eliminadoEn: null,
      eliminadoPorUsuarioId: null,
      motivoEliminacion: null,
      actualizadoPorUsuarioId: usuarioId,
    });
  }
}
