import { Usuario } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria, ResultadoAuditoria } from "../../../domain/enums/catalogosDominio";
import { ErrorNoAutenticado } from "../../../domain/errors/errorDominio";
import { RepositorioAuditoria, RepositorioUsuarios } from "../../../domain/repositories/contratosRepositorio";
import { PuertoAutenticacion } from "../../ports/puertosAplicacion";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

export class IniciarSesion {
  constructor(
    private readonly puertoAutenticacion: PuertoAutenticacion,
    private readonly repositorioUsuarios: RepositorioUsuarios,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(correo: string, contrasena: string, meta: {
    direccionIp: string | null;
    agenteUsuario: string | null;
    identificadorSolicitud: string;
  }): Promise<{
    tokenAcceso: string;
    tokenRenovacion: string;
    expiraEn: number;
    usuario: Usuario;
    asignacion: {
      rolCodigo: string;
      diocesisId: string | null;
      vicariaId: string | null;
      parroquiaId: string | null;
    };
  }> {
    const auditoria = new RegistrarEventoAuditoria(this.repositorioAuditoria);
    try {
      const sesion = await this.puertoAutenticacion.iniciarSesion(correo, contrasena);
      const usuario = await this.repositorioUsuarios.obtenerPorIdentidadAutenticacion(
        sesion.usuarioAuthId,
      );
      if (!usuario || usuario.eliminadoEn || !usuario.activo) {
        throw new ErrorNoAutenticado("Credenciales inválidas o usuario inactivo");
      }
      const asignacion = await this.repositorioUsuarios.obtenerAsignacionVigente(usuario.id);
      if (!asignacion) {
        throw new ErrorNoAutenticado("El usuario no tiene una asignación vigente");
      }
      await this.repositorioUsuarios.actualizarUltimoAcceso(usuario.id, new Date().toISOString());
      await auditoria.ejecutar({
        actor: {
          usuarioId: usuario.id,
          identidadAutenticacionId: usuario.identidadAutenticacionId ?? sesion.usuarioAuthId,
          correo: usuario.correo,
          nombreCompleto: usuario.nombreCompleto,
          rolCodigo: asignacion.rolCodigo ?? "",
          rolId: asignacion.rolId,
          diocesisId: asignacion.diocesisId,
          vicariaId: asignacion.vicariaId,
          parroquiaId: asignacion.parroquiaId,
          tokenAcceso: sesion.tokenAcceso,
          identificadorSesion: sesion.identificadorSesion,
          direccionIp: meta.direccionIp,
          agenteUsuario: meta.agenteUsuario,
          identificadorSolicitud: meta.identificadorSolicitud,
        },
        accion: AccionAuditoria.INICIAR_SESION,
        tipoEntidad: "usuarios",
        entidadId: usuario.id,
      });
      return {
        tokenAcceso: sesion.tokenAcceso,
        tokenRenovacion: sesion.tokenRenovacion,
        expiraEn: sesion.expiraEn,
        usuario,
        asignacion: {
          rolCodigo: asignacion.rolCodigo ?? "",
          diocesisId: asignacion.diocesisId,
          vicariaId: asignacion.vicariaId,
          parroquiaId: asignacion.parroquiaId,
        },
      };
    } catch (error) {
      await auditoria.ejecutar({
        accion: AccionAuditoria.FALLAR_INICIO_SESION,
        tipoEntidad: "usuarios",
        datosNuevos: { correo },
        resultado: ResultadoAuditoria.FALLIDO,
        codigoError: "FALLAR_INICIO_SESION",
      });
      throw error;
    }
  }
}
