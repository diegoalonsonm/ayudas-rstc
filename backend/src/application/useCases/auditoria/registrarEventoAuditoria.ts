import { ActorActual } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria, OrigenAuditoria, ResultadoAuditoria, TipoActorAuditoria } from "../../../domain/enums/catalogosDominio";
import { RepositorioAuditoria } from "../../../domain/repositories/contratosRepositorio";
import { ServicioEnmascarado } from "../../../domain/services/servicioEnmascarado";

export class RegistrarEventoAuditoria {
  constructor(
    private readonly repositorioAuditoria: RepositorioAuditoria,
    private readonly enmascarado = new ServicioEnmascarado(),
  ) {}

  async ejecutar(entrada: {
    actor?: ActorActual | null;
    accion: AccionAuditoria;
    tipoEntidad: string;
    entidadId?: string | null;
    datosAnteriores?: Record<string, unknown> | null;
    datosNuevos?: Record<string, unknown> | null;
    motivo?: string | null;
    resultado?: ResultadoAuditoria;
    codigoError?: string | null;
  }): Promise<void> {
    const actor = entrada.actor ?? null;
    await this.repositorioAuditoria.registrar({
      usuarioId: actor?.usuarioId ?? null,
      rolCodigo: actor?.rolCodigo ?? null,
      tipoActor: actor ? TipoActorAuditoria.USUARIO : TipoActorAuditoria.SISTEMA,
      accion: entrada.accion,
      tipoEntidad: entrada.tipoEntidad,
      entidadId: entrada.entidadId ?? null,
      diocesisId: actor?.diocesisId ?? null,
      vicariaId: actor?.vicariaId ?? null,
      parroquiaId: actor?.parroquiaId ?? null,
      datosAnteriores: this.enmascarado.enmascarar(entrada.datosAnteriores ?? null),
      datosNuevos: this.enmascarado.enmascarar(entrada.datosNuevos ?? null),
      motivo: entrada.motivo ?? null,
      resultado: entrada.resultado ?? ResultadoAuditoria.EXITOSO,
      codigoError: entrada.codigoError ?? null,
      direccionIp: actor?.direccionIp ?? null,
      agenteUsuario: actor?.agenteUsuario ?? null,
      identificadorSesion: actor?.identificadorSesion ?? null,
      identificadorSolicitud: actor?.identificadorSolicitud ?? null,
      origen: OrigenAuditoria.API,
    });
  }
}
