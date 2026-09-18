import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ErrorNoAutorizado } from "../../../domain/errors/errorDominio";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { ACTOR_REQUEST, ROLES_REQUERIDOS } from "../decorators/decoradoresHttp";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_REQUERIDOS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const actor = request[ACTOR_REQUEST] as ActorActual | undefined;
    if (!actor) {
      throw new ErrorNoAutorizado();
    }
    if (!roles.includes(actor.rolCodigo)) {
      throw new ErrorNoAutorizado("El rol no permite esta operación");
    }
    return true;
  }
}
