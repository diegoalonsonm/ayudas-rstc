import { CodigoRol } from "../enums/catalogosDominio";
import { ActorActual, Parroquia, Vicaria } from "../entities/tiposDominio";
import { ErrorNoAutorizado, ErrorValidacion } from "../errors/errorDominio";

export class ServicioAlcance {
  esAdministrador(actor: ActorActual): boolean {
    return actor.rolCodigo === CodigoRol.ADMINISTRADOR;
  }

  puedeVerAuditoria(actor: ActorActual): boolean {
    return (
      actor.rolCodigo === CodigoRol.ADMINISTRADOR ||
      actor.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO
    );
  }

  parroquiaEstaEnAlcance(
    actor: ActorActual,
    parroquia: Parroquia,
    vicaria: Vicaria,
  ): boolean {
    if (actor.rolCodigo === CodigoRol.ADMINISTRADOR) {
      return true;
    }
    if (actor.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
      return actor.diocesisId === vicaria.diocesisId;
    }
    if (actor.rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
      return actor.vicariaId === parroquia.vicariaId;
    }
    if (
      actor.rolCodigo === CodigoRol.PERSONAL_PASTORAL ||
      actor.rolCodigo === CodigoRol.COORDINADOR_PARROQUIAL
    ) {
      return actor.parroquiaId === parroquia.id;
    }
    return false;
  }

  exigirParroquiaEnAlcance(
    actor: ActorActual,
    parroquia: Parroquia,
    vicaria: Vicaria,
  ): void {
    if (!this.parroquiaEstaEnAlcance(actor, parroquia, vicaria)) {
      throw new ErrorNoAutorizado("La parroquia está fuera del alcance del usuario");
    }
  }

  validarFormaDeAlcance(rolCodigo: string, alcance: {
    diocesisId: string | null;
    vicariaId: string | null;
    parroquiaId: string | null;
  }): void {
    if (
      rolCodigo === CodigoRol.PERSONAL_PASTORAL ||
      rolCodigo === CodigoRol.COORDINADOR_PARROQUIAL
    ) {
      if (!alcance.parroquiaId || alcance.vicariaId || alcance.diocesisId) {
        throw new ErrorValidacion(
          `El rol ${rolCodigo} requiere parroquiaId y no admite vicariaId ni diocesisId`,
        );
      }
      return;
    }
    if (rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
      if (!alcance.vicariaId || alcance.parroquiaId || alcance.diocesisId) {
        throw new ErrorValidacion(
          "El rol COORDINADOR_VICARIAL requiere vicariaId y no admite parroquiaId ni diocesisId",
        );
      }
      return;
    }
    if (rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
      if (!alcance.diocesisId || alcance.vicariaId || alcance.parroquiaId) {
        throw new ErrorValidacion(
          "El rol COORDINADOR_DIOCESANO requiere diocesisId y no admite vicariaId ni parroquiaId",
        );
      }
      return;
    }
    if (rolCodigo === CodigoRol.ADMINISTRADOR) {
      if (alcance.diocesisId || alcance.vicariaId || alcance.parroquiaId) {
        throw new ErrorValidacion("El rol ADMINISTRADOR no admite alcance territorial");
      }
      return;
    }
    throw new ErrorValidacion(`Rol no contemplado: ${rolCodigo}`);
  }
}
