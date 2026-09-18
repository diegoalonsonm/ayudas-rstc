import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { ACTOR_REQUEST } from "../decorators/decoradoresHttp";

export const Actor = createParamDecorator((_data: unknown, ctx: ExecutionContext): ActorActual => {
  const request = ctx.switchToHttp().getRequest();
  return request[ACTOR_REQUEST];
});
