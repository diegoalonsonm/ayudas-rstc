import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { PUERTO_AUTENTICACION, PuertoAutenticacion } from "../../../application/ports/puertosAplicacion";
import {
  ActualizarUsuario,
  CambiarAsignacionUsuario,
  CrearUsuario,
  ListarUsuarios,
  ObtenerUsuario,
} from "../../../application/useCases/usuarios/gestionarUsuarios";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import {
  REPOSITORIO_AUDITORIA,
  REPOSITORIO_GENERICO,
  REPOSITORIO_ORGANIZACION,
  REPOSITORIO_USUARIOS,
  RepositorioAuditoria,
  RepositorioGenerico,
  RepositorioOrganizacion,
  RepositorioUsuarios,
} from "../../../domain/repositories/contratosRepositorio";
import { Actor } from "../decorators/actorActual";
import { ActualizarUsuarioDto, CambiarAsignacionDto, CrearUsuarioDto } from "../dto/dtosHttp";

@Controller("usuarios")
export class UsuariosController {
  constructor(
    @Inject(PUERTO_AUTENTICACION) private readonly puertoAutenticacion: PuertoAutenticacion,
    @Inject(REPOSITORIO_USUARIOS) private readonly repositorioUsuarios: RepositorioUsuarios,
    @Inject(REPOSITORIO_ORGANIZACION) private readonly repositorioOrganizacion: RepositorioOrganizacion,
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
    @Inject(REPOSITORIO_GENERICO) private readonly repositorioGenerico: RepositorioGenerico,
  ) {}

  @Get()
  listar() {
    return new ListarUsuarios(this.repositorioUsuarios).ejecutar();
  }

  @Get(":id")
  obtener(@Param("id") id: string) {
    return new ObtenerUsuario(this.repositorioUsuarios).ejecutar(id);
  }

  @Post()
  crear(@Actor() actor: ActorActual, @Body() dto: CrearUsuarioDto) {
    return new CrearUsuario(
      this.puertoAutenticacion,
      this.repositorioUsuarios,
      this.repositorioOrganizacion,
      this.repositorioAuditoria,
    ).ejecutar(actor, {
      nombreCompleto: dto.nombreCompleto,
      correo: dto.correo,
      contrasena: dto.contrasena,
      rolCodigo: dto.rolCodigo,
      diocesisId: dto.diocesisId ?? null,
      vicariaId: dto.vicariaId ?? null,
      parroquiaId: dto.parroquiaId ?? null,
      motivo: dto.motivo ?? null,
    });
  }

  @Patch(":id")
  actualizar(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: ActualizarUsuarioDto) {
    return new ActualizarUsuario(this.repositorioUsuarios, this.repositorioAuditoria).ejecutar(actor, id, dto);
  }

  @Post(":id/asignaciones")
  cambiarAsignacion(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Body() dto: CambiarAsignacionDto,
  ) {
    return new CambiarAsignacionUsuario(
      this.repositorioUsuarios,
      this.repositorioOrganizacion,
      this.repositorioAuditoria,
      this.repositorioGenerico,
    ).ejecutar(actor, id, {
      rolCodigo: dto.rolCodigo,
      diocesisId: dto.diocesisId ?? null,
      vicariaId: dto.vicariaId ?? null,
      parroquiaId: dto.parroquiaId ?? null,
      motivo: dto.motivo ?? null,
    });
  }
}
