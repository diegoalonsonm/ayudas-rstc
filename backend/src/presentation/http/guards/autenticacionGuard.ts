import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ContextIdFactory, ModuleRef, Reflector } from "@nestjs/core";
import { randomUUID } from "crypto";
import { Request } from "express";
import { PUERTO_AUTENTICACION, PuertoAutenticacion } from "../../../application/ports/puertosAplicacion";
import { ErrorNoAutenticado } from "../../../domain/errors/errorDominio";
import { REPOSITORIO_USUARIOS, RepositorioUsuarios } from "../../../domain/repositories/contratosRepositorio";
import { ACTOR_REQUEST, ES_PUBLICA } from "../decorators/decoradoresHttp";

@Injectable()
export class AutenticacionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(PUERTO_AUTENTICACION) private readonly puertoAutenticacion: PuertoAutenticacion,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const esPublica = this.reflector.getAllAndOverride<boolean>(ES_PUBLICA, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (esPublica) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ErrorNoAutenticado();
    }
    const token = header.slice("Bearer ".length);
    const verificado = await this.puertoAutenticacion.verificarToken(token);
    const repositorioUsuarios = await this.resolverRepositorioUsuarios(request);
    const usuario = await repositorioUsuarios.obtenerPorIdentidadAutenticacion(verificado.sub);
    if (!usuario || usuario.eliminadoEn || !usuario.activo) {
      throw new ErrorNoAutenticado("Usuario inactivo o inexistente");
    }
    const asignacion = await repositorioUsuarios.obtenerAsignacionVigente(usuario.id);
    if (!asignacion) {
      throw new ErrorNoAutenticado("El usuario no tiene una asignación vigente");
    }
    (request as Request & { [ACTOR_REQUEST]: unknown })[ACTOR_REQUEST] = {
      usuarioId: usuario.id,
      identidadAutenticacionId: usuario.identidadAutenticacionId ?? verificado.sub,
      correo: usuario.correo,
      nombreCompleto: usuario.nombreCompleto,
      rolCodigo: asignacion.rolCodigo ?? "",
      rolId: asignacion.rolId,
      diocesisId: asignacion.diocesisId,
      vicariaId: asignacion.vicariaId,
      parroquiaId: asignacion.parroquiaId,
      tokenAcceso: token,
      identificadorSesion: verificado.identificadorSesion,
      direccionIp: request.ip ?? null,
      agenteUsuario: request.headers["user-agent"] ?? null,
      identificadorSolicitud: String(request.headers["x-request-id"] ?? randomUUID()),
    };
    return true;
  }

  private async resolverRepositorioUsuarios(request: Request): Promise<RepositorioUsuarios> {
    const contextId = ContextIdFactory.getByRequest(request);
    this.moduleRef.registerRequestByContextId(request, contextId);
    return this.moduleRef.resolve<RepositorioUsuarios>(REPOSITORIO_USUARIOS, contextId, {
      strict: false,
    });
  }
}
