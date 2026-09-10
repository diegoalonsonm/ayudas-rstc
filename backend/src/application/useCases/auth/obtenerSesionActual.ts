import { ActorActual } from "../../../domain/entities/tiposDominio";

export class ObtenerSesionActual {
  ejecutar(actor: ActorActual) {
    return {
      usuarioId: actor.usuarioId,
      correo: actor.correo,
      nombreCompleto: actor.nombreCompleto,
      rolCodigo: actor.rolCodigo,
      diocesisId: actor.diocesisId,
      vicariaId: actor.vicariaId,
      parroquiaId: actor.parroquiaId,
    };
  }
}
