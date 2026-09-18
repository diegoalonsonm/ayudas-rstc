import { ActorActual } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria } from "../../../domain/enums/catalogosDominio";
import { RepositorioAuditoria } from "../../../domain/repositories/contratosRepositorio";
import { PuertoAutenticacion } from "../../ports/puertosAplicacion";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

export class CerrarSesion {
  constructor(
    private readonly puertoAutenticacion: PuertoAutenticacion,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual): Promise<void> {
    await this.puertoAutenticacion.cerrarSesion(actor.tokenAcceso);
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.CERRAR_SESION,
      tipoEntidad: "usuarios",
      entidadId: actor.usuarioId,
    });
  }
}
