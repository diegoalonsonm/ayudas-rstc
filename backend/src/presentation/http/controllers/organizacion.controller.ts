import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { GestionarCatalogo } from "../../../application/useCases/catalogos/gestionarCatalogo";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { CodigoRol } from "../../../domain/enums/catalogosDominio";
import { REPOSITORIO_GENERICO, RepositorioGenerico } from "../../../domain/repositories/contratosRepositorio";
import { Actor } from "../decorators/actorActual";
import { RequerirRoles } from "../decorators/decoradoresHttp";
import { MotivoDto, OrganizacionDto } from "../dto/dtosHttp";

@Controller()
export class OrganizacionController {
  constructor(
    @Inject(REPOSITORIO_GENERICO) private readonly repositorioGenerico: RepositorioGenerico,
  ) {}

  private caso() {
    return new GestionarCatalogo(this.repositorioGenerico);
  }

  @Get("diocesis")
  listarDiocesis() {
    return this.caso().listar("diocesis");
  }

  @Get("diocesis/:id")
  obtenerDiocesis(@Param("id") id: string) {
    return this.caso().obtener("diocesis", id);
  }

  @Post("diocesis")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  crearDiocesis(@Actor() actor: ActorActual, @Body() dto: OrganizacionDto) {
    return this.caso().crear(actor, "diocesis", dto as unknown as Record<string, unknown>);
  }

  @Patch("diocesis/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  actualizarDiocesis(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Body() dto: Partial<OrganizacionDto>,
  ) {
    return this.caso().actualizar(actor, "diocesis", id, dto as Record<string, unknown>);
  }

  @Delete("diocesis/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  eliminarDiocesis(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: MotivoDto) {
    return this.caso().eliminar(actor, "diocesis", id, dto.motivo);
  }

  @Get("vicarias")
  listarVicarias() {
    return this.caso().listar("vicarias");
  }

  @Get("vicarias/:id")
  obtenerVicaria(@Param("id") id: string) {
    return this.caso().obtener("vicarias", id);
  }

  @Post("vicarias")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  crearVicaria(@Actor() actor: ActorActual, @Body() dto: OrganizacionDto) {
    return this.caso().crear(actor, "vicarias", dto as unknown as Record<string, unknown>);
  }

  @Patch("vicarias/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  actualizarVicaria(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Body() dto: Partial<OrganizacionDto>,
  ) {
    return this.caso().actualizar(actor, "vicarias", id, dto as Record<string, unknown>);
  }

  @Delete("vicarias/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  eliminarVicaria(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: MotivoDto) {
    return this.caso().eliminar(actor, "vicarias", id, dto.motivo);
  }

  @Get("parroquias")
  listarParroquias() {
    return this.caso().listar("parroquias");
  }

  @Get("parroquias/:id")
  obtenerParroquia(@Param("id") id: string) {
    return this.caso().obtener("parroquias", id);
  }

  @Post("parroquias")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  crearParroquia(@Actor() actor: ActorActual, @Body() dto: OrganizacionDto) {
    return this.caso().crear(actor, "parroquias", dto as unknown as Record<string, unknown>);
  }

  @Patch("parroquias/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  actualizarParroquia(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Body() dto: Partial<OrganizacionDto>,
  ) {
    return this.caso().actualizar(actor, "parroquias", id, dto as Record<string, unknown>);
  }

  @Delete("parroquias/:id")
  @RequerirRoles(CodigoRol.ADMINISTRADOR)
  eliminarParroquia(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: MotivoDto) {
    return this.caso().eliminar(actor, "parroquias", id, dto.motivo);
  }
}
