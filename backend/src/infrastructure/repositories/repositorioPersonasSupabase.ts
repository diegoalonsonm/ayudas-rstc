import { Inject, Injectable, Scope } from "@nestjs/common";
import { Direccion, Persona, ProcesoVigentePersona } from "../../domain/entities/tiposDominio";
import { RepositorioPersonas } from "../../domain/repositories/contratosRepositorio";
import { filaACamel, filasACamel } from "../mappers/mapeoCampos";
import { lanzarSiError, RepositorioGenericoSupabase } from "./repositorioGenericoSupabase";

@Injectable({ scope: Scope.REQUEST })
export class RepositorioPersonasSupabase implements RepositorioPersonas {
  constructor(@Inject(RepositorioGenericoSupabase) private readonly base: RepositorioGenericoSupabase) {}

  crear(datos: Record<string, unknown>): Promise<Persona> {
    return this.base.insertar<Persona>("personas", datos);
  }

  obtenerPorId(id: string): Promise<Persona | null> {
    return this.base.obtenerPorId<Persona>("personas", id);
  }

  async obtenerPorHashDocumento(hash: string): Promise<Persona | null> {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("personas")
      .select("*")
      .eq("numero_documento_hash", hash)
      .is("eliminado_en", null)
      .maybeSingle();
    lanzarSiError(error);
    return filaACamel<Persona>((data ?? null) as Record<string, unknown> | null);
  }

  listar(): Promise<Persona[]> {
    return this.base.listarActivos<Persona>("personas");
  }

  actualizar(id: string, datos: Record<string, unknown>): Promise<Persona> {
    return this.base.actualizar<Persona>("personas", id, datos);
  }

  async listarDirecciones(personaId: string): Promise<Direccion[]> {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("direcciones")
      .select("*")
      .eq("persona_id", personaId)
      .is("eliminado_en", null)
      .order("es_actual", { ascending: false });
    lanzarSiError(error);
    return filasACamel<Direccion>((data ?? []) as Record<string, unknown>[]);
  }

  async obtenerDireccionActual(personaId: string): Promise<Direccion | null> {
    const { data, error } = await this.base
      .clienteUsuario()
      .from("direcciones")
      .select("*")
      .eq("persona_id", personaId)
      .eq("es_actual", true)
      .is("eliminado_en", null)
      .maybeSingle();
    lanzarSiError(error);
    return filaACamel<Direccion>((data ?? null) as Record<string, unknown> | null);
  }

  crearDireccion(datos: Record<string, unknown>): Promise<Direccion> {
    return this.base.insertar<Direccion>("direcciones", datos);
  }

  actualizarDireccion(id: string, datos: Record<string, unknown>): Promise<Direccion> {
    return this.base.actualizar<Direccion>("direcciones", id, datos);
  }

  async consultarProcesosVigentes(hashDocumento: string): Promise<ProcesoVigentePersona[]> {
    const { data, error } = await this.base
      .clienteUsuario()
      .rpc("consultar_procesos_vigentes_persona", {
        p_numero_documento_hash: hashDocumento,
      });
    lanzarSiError(error);
    return filasACamel<ProcesoVigentePersona>((data ?? []) as Record<string, unknown>[]);
  }
}
