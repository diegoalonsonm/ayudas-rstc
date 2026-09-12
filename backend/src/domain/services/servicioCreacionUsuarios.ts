import { CodigoRol } from "../enums/catalogosDominio";
import { ActorActual, Parroquia, Vicaria } from "../entities/tiposDominio";
import { ErrorNoAutorizado, ErrorValidacion } from "../errors/errorDominio";
import { ServicioAlcance } from "./servicioAlcance";

export type AlcanceAsignacion = {
  diocesisId: string | null;
  vicariaId: string | null;
  parroquiaId: string | null;
};

export class ServicioCreacionUsuarios {
  constructor(private readonly servicioAlcance = new ServicioAlcance()) {}

  rolPermitidoParaCrear(actorRol: string): string | null {
    switch (actorRol) {
      case CodigoRol.PERSONAL_PASTORAL:
      case CodigoRol.COORDINADOR_PARROQUIAL:
        return CodigoRol.PERSONAL_PASTORAL;
      case CodigoRol.COORDINADOR_VICARIAL:
        return CodigoRol.COORDINADOR_PARROQUIAL;
      case CodigoRol.COORDINADOR_DIOCESANO:
        return CodigoRol.COORDINADOR_VICARIAL;
      case CodigoRol.ADMINISTRADOR:
        return null;
      default:
        throw new ErrorValidacion(`Rol de actor desconocido: ${actorRol}`);
    }
  }

  validarCreacion(
    actor: ActorActual,
    rolNuevo: string,
    alcance: AlcanceAsignacion,
    identidadAutenticacionNueva: string | null,
    parroquiaDestino: Parroquia | null,
    vicariaDestino: Vicaria | null,
  ): void {
    if (identidadAutenticacionNueva && identidadAutenticacionNueva === actor.identidadAutenticacionId) {
      throw new ErrorNoAutorizado("Ningún usuario puede asignarse a sí mismo otro rol o alcance");
    }

    this.servicioAlcance.validarFormaDeAlcance(rolNuevo, alcance);

    const permitido = this.rolPermitidoParaCrear(actor.rolCodigo);
    if (permitido !== null && permitido !== rolNuevo) {
      throw new ErrorNoAutorizado(
        `${actor.rolCodigo} solo puede crear usuarios ${permitido}`,
      );
    }

    if (actor.rolCodigo === CodigoRol.ADMINISTRADOR) {
      return;
    }

    if (
      actor.rolCodigo === CodigoRol.PERSONAL_PASTORAL ||
      actor.rolCodigo === CodigoRol.COORDINADOR_PARROQUIAL
    ) {
      if (!parroquiaDestino || parroquiaDestino.id !== actor.parroquiaId) {
        throw new ErrorNoAutorizado("Solo puede crear usuarios para su misma parroquia");
      }
      return;
    }

    if (actor.rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
      if (!parroquiaDestino || !vicariaDestino) {
        throw new ErrorValidacion("La parroquia de destino es obligatoria");
      }
      if (vicariaDestino.id !== actor.vicariaId || parroquiaDestino.vicariaId !== actor.vicariaId) {
        throw new ErrorNoAutorizado("Solo puede crear coordinadores parroquiales en su vicaría");
      }
      return;
    }

    if (actor.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
      if (!vicariaDestino) {
        throw new ErrorValidacion("La vicaría de destino es obligatoria");
      }
      if (vicariaDestino.diocesisId !== actor.diocesisId) {
        throw new ErrorNoAutorizado("Solo puede crear coordinadores vicariales en su diócesis");
      }
    }
  }

  validarCambioPropio(actor: ActorActual, usuarioObjetivoId: string): void {
    if (actor.usuarioId === usuarioObjetivoId) {
      throw new ErrorNoAutorizado("Ningún usuario puede asignarse a sí mismo otro rol o alcance");
    }
  }

  validarReasignacion(
    actor: ActorActual,
    usuarioObjetivoId: string,
    rolNuevo: string,
    alcance: AlcanceAsignacion,
    parroquiaDestino: Parroquia | null,
    vicariaDestino: Vicaria | null,
  ): void {
    this.validarCambioPropio(actor, usuarioObjetivoId);
    this.servicioAlcance.validarFormaDeAlcance(rolNuevo, alcance);

    if (actor.rolCodigo === CodigoRol.ADMINISTRADOR) {
      return;
    }

    if (actor.rolCodigo !== CodigoRol.COORDINADOR_DIOCESANO) {
      throw new ErrorNoAutorizado(
        "Solo el administrador o el coordinador diocesano puede cambiar la asignación de un usuario",
      );
    }

    if (rolNuevo === CodigoRol.ADMINISTRADOR) {
      throw new ErrorNoAutorizado("El coordinador diocesano no puede asignar el rol administrador");
    }

    this.exigirAlcanceEnDiocesis(actor, rolNuevo, alcance, parroquiaDestino, vicariaDestino);
  }

  validarUsuarioObjetivoEnDiocesis(
    actor: ActorActual,
    alcanceActual: AlcanceAsignacion,
    parroquiaActual: Parroquia | null,
    vicariaActual: Vicaria | null,
  ): void {
    if (actor.rolCodigo === CodigoRol.ADMINISTRADOR) {
      return;
    }
    if (actor.rolCodigo !== CodigoRol.COORDINADOR_DIOCESANO) {
      throw new ErrorNoAutorizado(
        "Solo el administrador o el coordinador diocesano puede cambiar la asignación de un usuario",
      );
    }
    if (alcanceActual.parroquiaId) {
      if (!parroquiaActual || !vicariaActual || vicariaActual.diocesisId !== actor.diocesisId) {
        throw new ErrorNoAutorizado("Solo puede reasignar usuarios dentro de su diócesis");
      }
      return;
    }
    if (alcanceActual.vicariaId) {
      if (!vicariaActual || vicariaActual.diocesisId !== actor.diocesisId) {
        throw new ErrorNoAutorizado("Solo puede reasignar usuarios dentro de su diócesis");
      }
      return;
    }
    if (alcanceActual.diocesisId && alcanceActual.diocesisId === actor.diocesisId) {
      return;
    }
    throw new ErrorNoAutorizado("Solo puede reasignar usuarios dentro de su diócesis");
  }

  private exigirAlcanceEnDiocesis(
    actor: ActorActual,
    rolNuevo: string,
    alcance: AlcanceAsignacion,
    parroquiaDestino: Parroquia | null,
    vicariaDestino: Vicaria | null,
  ): void {
    if (!actor.diocesisId) {
      throw new ErrorNoAutorizado("El coordinador diocesano no tiene diócesis asignada");
    }
    if (rolNuevo === CodigoRol.COORDINADOR_DIOCESANO) {
      if (alcance.diocesisId !== actor.diocesisId) {
        throw new ErrorNoAutorizado("Solo puede reasignar usuarios dentro de su diócesis");
      }
      return;
    }
    if (rolNuevo === CodigoRol.COORDINADOR_VICARIAL) {
      if (!vicariaDestino || vicariaDestino.diocesisId !== actor.diocesisId) {
        throw new ErrorNoAutorizado("Solo puede reasignar usuarios dentro de su diócesis");
      }
      return;
    }
    if (!parroquiaDestino || !vicariaDestino || vicariaDestino.diocesisId !== actor.diocesisId) {
      throw new ErrorNoAutorizado("Solo puede reasignar usuarios dentro de su diócesis");
    }
  }
}
