import { Inject, Injectable, Scope } from "@nestjs/common";
import { Parroquia, Vicaria } from "../../domain/entities/tiposDominio";
import { RepositorioOrganizacion } from "../../domain/repositories/contratosRepositorio";
import { RepositorioGenericoSupabase } from "./repositorioGenericoSupabase";

@Injectable({ scope: Scope.REQUEST })
export class RepositorioOrganizacionSupabase implements RepositorioOrganizacion {
  constructor(@Inject(RepositorioGenericoSupabase) private readonly base: RepositorioGenericoSupabase) {}

  obtenerParroquia(id: string): Promise<Parroquia | null> {
    return this.base.obtenerPorId<Parroquia>("parroquias", id);
  }

  obtenerVicaria(id: string): Promise<Vicaria | null> {
    return this.base.obtenerPorId<Vicaria>("vicarias", id);
  }
}
