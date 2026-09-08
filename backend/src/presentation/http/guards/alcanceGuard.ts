import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import { Request } from "express";
import { ActorActual, Parroquia, Vicaria } from "../../../domain/entities/tiposDominio";
import { REPOSITORIO_ORGANIZACION, RepositorioOrganizacion } from "../../../domain/repositories/contratosRepositorio";
import { ServicioAlcance } from "../../../domain/services/servicioAlcance";
import { ACTOR_REQUEST } from "../decorators/decoradoresHttp";

@Injectable()
export class AlcanceGuard implements CanActivate {
  private readonly servicioAlcance = new ServicioAlcance();

  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actor = request[ACTOR_REQUEST] as ActorActual | undefined;
    if (!actor) {
      return true;
    }
    const parroquiaId =
      request.body?.parroquiaReceptoraId ??
      request.body?.parroquiaId ??
      request.params?.parroquiaId ??
      request.query?.parroquiaId;
    if (!parroquiaId || typeof parroquiaId !== "string") {
      return true;
    }
    const repositorioOrganizacion = await this.resolverRepositorioOrganizacion(request);
    const parroquia = await repositorioOrganizacion.obtenerParroquia(parroquiaId);
    if (!parroquia) {
      return true;
    }
    const vicaria = await repositorioOrganizacion.obtenerVicaria(parroquia.vicariaId);
    if (!vicaria) {
      return true;
    }
    this.servicioAlcance.exigirParroquiaEnAlcance(actor, parroquia as Parroquia, vicaria as Vicaria);
    return true;
  }

  private async resolverRepositorioOrganizacion(request: Request): Promise<RepositorioOrganizacion> {
    const contextId = ContextIdFactory.getByRequest(request);
    this.moduleRef.registerRequestByContextId(request, contextId);
    return this.moduleRef.resolve<RepositorioOrganizacion>(REPOSITORIO_ORGANIZACION, contextId, {
      strict: false,
    });
  }
}
