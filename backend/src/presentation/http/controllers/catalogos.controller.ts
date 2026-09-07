import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { CodigoRol } from "../../../domain/enums/catalogosDominio";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { REPOSITORIO_GENERICO, RepositorioGenerico } from "../../../domain/repositories/contratosRepositorio";
import { ErrorValidacion } from "../../../domain/errors/errorDominio";
import { GestionarCatalogo } from "../../../application/useCases/catalogos/gestionarCatalogo";
import { Actor } from "../decorators/actorActual";
import { RequerirRoles } from "../decorators/decoradoresHttp";
import { ItemCatalogoDto, MotivoDto } from "../dto/dtosHttp";

const TABLAS: Record<string, string> = {
  "tipos-documento": "tipos_documento",
  sexos: "sexos",
  "grados-academicos": "grados_academicos",
  parentescos: "parentescos",
  "rangos-ingreso": "rangos_ingreso",
  "tipos-vivienda": "tipos_vivienda",
  "tipos-tenencia": "tipos_tenencia",
  "condiciones-vivienda": "condiciones_vivienda",
  "tipos-ayuda": "tipos_ayuda",
  roles: "roles",
  cantones: "cantones",
  distritos: "distritos",
  barrios: "barrios",
};

@Controller("catalogos")
export class CatalogosController {
  constructor(
    @Inject(REPOSITORIO_GENERICO) private readonly repositorioGenerico: RepositorioGenerico,
  ) {}

  private caso() {
    return new GestionarCatalogo(this.repositorioGenerico);
  }

  private tabla(catalogo: string): string {
    const tabla = TABLAS[catalogo];
    if (!tabla) {
      throw new ErrorValidacion("Catálogo desconocido");
    }
    return tabla;
  }

  @Get(":catalogo")
  listar(@Param("catalogo") catalogo: string) {
    return this.caso().listar(this.tabla(catalogo));
  }

  @Get(":catalogo/:id")
  obtener(@Param("catalogo") catalogo: string, @Param("id") id: string) {
    return this.caso().obtener(this.tabla(catalogo), id);
  }

  @Post(":catalogo")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  crear(
    @Actor() actor: ActorActual,
    @Param("catalogo") catalogo: string,
    @Body() dto: ItemCatalogoDto,
  ) {
    return this.caso().crear(actor, this.tabla(catalogo), dto as unknown as Record<string, unknown>);
  }

  @Patch(":catalogo/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  actualizar(
    @Actor() actor: ActorActual,
    @Param("catalogo") catalogo: string,
    @Param("id") id: string,
    @Body() dto: Partial<ItemCatalogoDto>,
  ) {
    return this.caso().actualizar(actor, this.tabla(catalogo), id, dto as Record<string, unknown>);
  }

  @Delete(":catalogo/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  eliminar(
    @Actor() actor: ActorActual,
    @Param("catalogo") catalogo: string,
    @Param("id") id: string,
    @Body() dto: MotivoDto,
  ) {
    return this.caso().eliminar(actor, this.tabla(catalogo), id, dto.motivo);
  }
}
