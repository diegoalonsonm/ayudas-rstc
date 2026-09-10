import { Body, Controller, Delete, Get, Inject, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { PUERTO_AUTENTICACION, PuertoAutenticacion } from "../../../application/ports/puertosAplicacion";
import { CerrarSesion } from "../../../application/useCases/auth/cerrarSesion";
import { IniciarSesion } from "../../../application/useCases/auth/iniciarSesion";
import { ObtenerSesionActual } from "../../../application/useCases/auth/obtenerSesionActual";
import { RenovarSesion } from "../../../application/useCases/auth/renovarSesion";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { REPOSITORIO_AUDITORIA, REPOSITORIO_USUARIOS, RepositorioAuditoria, RepositorioUsuarios } from "../../../domain/repositories/contratosRepositorio";
import { Actor } from "../decorators/actorActual";
import { RutaPublica } from "../decorators/decoradoresHttp";
import { IniciarSesionDto, RenovarSesionDto } from "../dto/dtosHttp";
import { randomUUID } from "crypto";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(PUERTO_AUTENTICACION) private readonly puertoAutenticacion: PuertoAutenticacion,
    @Inject(REPOSITORIO_USUARIOS) private readonly repositorioUsuarios: RepositorioUsuarios,
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  @Post("sesiones")
  @RutaPublica()
  iniciarSesion(@Body() dto: IniciarSesionDto, @Req() request: Request) {
    return new IniciarSesion(
      this.puertoAutenticacion,
      this.repositorioUsuarios,
      this.repositorioAuditoria,
    ).ejecutar(dto.correo, dto.contrasena, {
      direccionIp: request.ip ?? null,
      agenteUsuario: request.headers["user-agent"] ?? null,
      identificadorSolicitud: String(request.headers["x-request-id"] ?? randomUUID()),
    });
  }

  @Post("sesiones/renovacion")
  @RutaPublica()
  renovarSesion(@Body() dto: RenovarSesionDto) {
    return new RenovarSesion(this.puertoAutenticacion).ejecutar(dto.tokenRenovacion);
  }

  @Delete("sesiones")
  cerrarSesion(@Actor() actor: ActorActual) {
    return new CerrarSesion(this.puertoAutenticacion, this.repositorioAuditoria).ejecutar(actor);
  }

  @Get("sesion")
  obtenerSesion(@Actor() actor: ActorActual) {
    return new ObtenerSesionActual().ejecutar(actor);
  }
}
