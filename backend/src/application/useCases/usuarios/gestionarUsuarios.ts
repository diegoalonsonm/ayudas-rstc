import { ActorActual, Usuario } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria } from "../../../domain/enums/catalogosDominio";
import { ErrorNoEncontrado, ErrorValidacion } from "../../../domain/errors/errorDominio";
import {
  RepositorioAuditoria,
  RepositorioOrganizacion,
  RepositorioUsuarios,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioCreacionUsuarios } from "../../../domain/services/servicioCreacionUsuarios";
import { PuertoAutenticacion } from "../../ports/puertosAplicacion";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

export class CrearUsuario {
  constructor(
    private readonly puertoAutenticacion: PuertoAutenticacion,
    private readonly repositorioUsuarios: RepositorioUsuarios,
    private readonly repositorioOrganizacion: RepositorioOrganizacion,
    private readonly repositorioAuditoria: RepositorioAuditoria,
    private readonly servicioCreacion = new ServicioCreacionUsuarios(),
  ) {}

  async ejecutar(
    actor: ActorActual,
    entrada: {
      nombreCompleto: string;
      correo: string;
      contrasena: string;
      rolCodigo: string;
      diocesisId: string | null;
      vicariaId: string | null;
      parroquiaId: string | null;
      motivo: string | null;
    },
  ): Promise<Usuario> {
    const parroquia = entrada.parroquiaId
      ? await this.repositorioOrganizacion.obtenerParroquia(entrada.parroquiaId)
      : null;
    const vicariaId = entrada.vicariaId ?? parroquia?.vicariaId ?? null;
    const vicaria = vicariaId
      ? await this.repositorioOrganizacion.obtenerVicaria(vicariaId)
      : null;

    this.servicioCreacion.validarCreacion(
      actor,
      entrada.rolCodigo,
      {
        diocesisId: entrada.diocesisId,
        vicariaId: entrada.vicariaId,
        parroquiaId: entrada.parroquiaId,
      },
      null,
      parroquia,
      vicaria,
    );

    const identidadId = await this.puertoAutenticacion.crearIdentidad(
      entrada.correo,
      entrada.contrasena,
      entrada.nombreCompleto,
    );

    this.servicioCreacion.validarCreacion(
      actor,
      entrada.rolCodigo,
      {
        diocesisId: entrada.diocesisId,
        vicariaId: entrada.vicariaId,
        parroquiaId: entrada.parroquiaId,
      },
      identidadId,
      parroquia,
      vicaria,
    );

    const usuarioId = await this.repositorioUsuarios.crearUsuarioConAsignacion({
      nombreCompleto: entrada.nombreCompleto,
      correo: entrada.correo,
      rolCodigo: entrada.rolCodigo,
      identidadAutenticacionId: identidadId,
      diocesisId: entrada.diocesisId,
      vicariaId: entrada.vicariaId,
      parroquiaId: entrada.parroquiaId,
      motivo: entrada.motivo,
    });

    const usuario = await this.repositorioUsuarios.obtenerPorId(usuarioId);
    if (!usuario) {
      throw new ErrorNoEncontrado("No se pudo leer el usuario recién creado");
    }
    return usuario;
  }
}

export class ListarUsuarios {
  constructor(private readonly repositorioUsuarios: RepositorioUsuarios) {}

  ejecutar() {
    return this.repositorioUsuarios.listar();
  }
}

export class ObtenerUsuario {
  constructor(private readonly repositorioUsuarios: RepositorioUsuarios) {}

  async ejecutar(id: string) {
    const usuario = await this.repositorioUsuarios.obtenerPorId(id);
    if (!usuario) {
      throw new ErrorNoEncontrado("Usuario no encontrado");
    }
    const asignacion = await this.repositorioUsuarios.obtenerAsignacionVigente(id);
    return { usuario, asignacion };
  }
}

export class ActualizarUsuario {
  constructor(
    private readonly repositorioUsuarios: RepositorioUsuarios,
    private readonly repositorioAuditoria: RepositorioAuditoria,
    private readonly servicioCreacion = new ServicioCreacionUsuarios(),
  ) {}

  async ejecutar(
    actor: ActorActual,
    id: string,
    datos: { nombreCompleto?: string; activo?: boolean; motivo?: string },
  ) {
    if (datos.activo === false) {
      this.servicioCreacion.validarCambioPropio(actor, id);
    }
    const actual = await this.repositorioUsuarios.obtenerPorId(id);
    if (!actual) {
      throw new ErrorNoEncontrado("Usuario no encontrado");
    }
    const actualizado = await this.repositorioUsuarios.actualizar(id, {
      nombreCompleto: datos.nombreCompleto,
      activo: datos.activo,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
    if (datos.activo === false) {
      await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
        actor,
        accion: AccionAuditoria.DESACTIVAR_USUARIO,
        tipoEntidad: "usuarios",
        entidadId: id,
        motivo: datos.motivo ?? null,
        datosAnteriores: { activo: actual.activo },
        datosNuevos: { activo: false },
      });
    }
    return actualizado;
  }
}

export class CambiarAsignacionUsuario {
  constructor(
    private readonly repositorioUsuarios: RepositorioUsuarios,
    private readonly repositorioOrganizacion: RepositorioOrganizacion,
    private readonly repositorioAuditoria: RepositorioAuditoria,
    private readonly repositorioGenerico: import("../../../domain/repositories/contratosRepositorio").RepositorioGenerico,
    private readonly servicioCreacion = new ServicioCreacionUsuarios(),
  ) {}

  async ejecutar(
    actor: ActorActual,
    usuarioId: string,
    entrada: {
      rolCodigo: string;
      diocesisId: string | null;
      vicariaId: string | null;
      parroquiaId: string | null;
      motivo: string | null;
    },
  ) {
    this.servicioCreacion.validarCambioPropio(actor, usuarioId);
    const usuario = await this.repositorioUsuarios.obtenerPorId(usuarioId);
    if (!usuario) {
      throw new ErrorNoEncontrado("Usuario no encontrado");
    }
    if (!usuario.identidadAutenticacionId) {
      throw new ErrorValidacion("El usuario no tiene identidad de autenticación");
    }
    const parroquia = entrada.parroquiaId
      ? await this.repositorioOrganizacion.obtenerParroquia(entrada.parroquiaId)
      : null;
    const vicariaId = entrada.vicariaId ?? parroquia?.vicariaId ?? null;
    const vicaria = vicariaId
      ? await this.repositorioOrganizacion.obtenerVicaria(vicariaId)
      : null;
    this.servicioCreacion.validarCreacion(
      actor,
      entrada.rolCodigo,
      {
        diocesisId: entrada.diocesisId,
        vicariaId: entrada.vicariaId,
        parroquiaId: entrada.parroquiaId,
      },
      usuario.identidadAutenticacionId,
      parroquia,
      vicaria,
    );

    const vigente = await this.repositorioUsuarios.obtenerAsignacionVigente(usuarioId);
    if (vigente) {
      await this.repositorioGenerico.actualizar("asignaciones_usuario", vigente.id, {
        vigenteHasta: new Date().toISOString(),
        actualizadoPorUsuarioId: actor.usuarioId,
      });
    }

    const roles = await this.repositorioGenerico.listarActivos<{ id: string; codigo: string }>(
      "roles",
      { codigo: entrada.rolCodigo },
    );
    const rol = roles[0];
    if (!rol) {
      throw new ErrorValidacion(`Rol desconocido: ${entrada.rolCodigo}`);
    }

    const nueva = await this.repositorioGenerico.insertar("asignaciones_usuario", {
      usuarioId,
      rolId: rol.id,
      diocesisId: entrada.diocesisId,
      vicariaId: entrada.vicariaId,
      parroquiaId: entrada.parroquiaId,
      creadoPorUsuarioId: actor.usuarioId,
    });

    const auditoria = new RegistrarEventoAuditoria(this.repositorioAuditoria);
    await auditoria.ejecutar({
      actor,
      accion: AccionAuditoria.CAMBIAR_ROL,
      tipoEntidad: "asignaciones_usuario",
      entidadId: usuarioId,
      motivo: entrada.motivo,
      datosAnteriores: vigente ? { rolCodigo: vigente.rolCodigo } : null,
      datosNuevos: { rolCodigo: entrada.rolCodigo },
    });
    await auditoria.ejecutar({
      actor,
      accion: AccionAuditoria.CAMBIAR_ALCANCE,
      tipoEntidad: "asignaciones_usuario",
      entidadId: usuarioId,
      motivo: entrada.motivo,
      datosNuevos: {
        diocesisId: entrada.diocesisId,
        vicariaId: entrada.vicariaId,
        parroquiaId: entrada.parroquiaId,
      },
    });
    return nueva;
  }
}
