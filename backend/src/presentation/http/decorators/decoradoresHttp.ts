import { SetMetadata } from "@nestjs/common";

export const ES_PUBLICA = "ES_PUBLICA";
export const ROLES_REQUERIDOS = "ROLES_REQUERIDOS";
export const ACTOR_REQUEST = "actorActual";

export const RutaPublica = () => SetMetadata(ES_PUBLICA, true);
export const RequerirRoles = (...roles: string[]) => SetMetadata(ROLES_REQUERIDOS, roles);
