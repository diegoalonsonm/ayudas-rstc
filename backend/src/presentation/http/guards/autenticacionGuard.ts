import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
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
    @Inject(REPOSITORIO_USUARIOS) private readonly repositorioUsuarios: RepositorioUsuarios,
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
    const usuario = await this.repositorioUsuarios.obtenerPorIdentidadAutenticacion(verificado.sub);
    if (!usuario || usuario.eliminadoEn || !usuario.activo) {
      throw new ErrorNoAutenticado("Usuario inactivo o inexistente");
    }
    const asignacion = await this.repositorioUsuarios.obtenerAsignacionVigente(usuario.id);
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
}
