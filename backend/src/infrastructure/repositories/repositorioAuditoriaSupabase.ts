import { Inject, Injectable, Scope } from "@nestjs/common";
import { EventoAuditoria } from "../../domain/entities/tiposDominio";
import { RepositorioAuditoria } from "../../domain/repositories/contratosRepositorio";
import { camelAFila, filasACamel } from "../mappers/mapeoCampos";
import { lanzarSiError, RepositorioGenericoSupabase } from "./repositorioGenericoSupabase";

@Injectable({ scope: Scope.REQUEST })
export class RepositorioAuditoriaSupabase implements RepositorioAuditoria {
  constructor(@Inject(RepositorioGenericoSupabase) private readonly base: RepositorioGenericoSupabase) {}

  async registrar(evento: Partial<EventoAuditoria>): Promise<void> {
    const { error } = await this.base
      .clienteUsuario()
      .from("eventos_auditoria")
      .insert(camelAFila(evento as Record<string, unknown>));
    if (error) {
      const { error: errorServicio } = await this.base
        .clienteServicio()
        .from("eventos_auditoria")
        .insert(camelAFila(evento as Record<string, unknown>));
      lanzarSiError(errorServicio);
    }
  }

  async listar(filtros: Record<string, unknown> = {}): Promise<EventoAuditoria[]> {
    let consulta = this.base.clienteUsuario().from("eventos_auditoria").select("*").order("ocurrido_en", {
      ascending: false,
    });
    const filaFiltros = camelAFila(filtros);
    for (const [clave, valor] of Object.entries(filaFiltros)) {
      consulta = consulta.eq(clave, valor as never);
    }
    const { data, error } = await consulta.limit(200);
    lanzarSiError(error);
    return filasACamel<EventoAuditoria>((data ?? []) as Record<string, unknown>[]);
  }
}
