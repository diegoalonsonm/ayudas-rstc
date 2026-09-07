import { ActorActual, Persona } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria } from "../../../domain/enums/catalogosDominio";
import { ErrorNoEncontrado } from "../../../domain/errors/errorDominio";
import {
  RepositorioAuditoria,
  RepositorioPersonas,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioCifrado } from "../../../domain/services/servicioCifrado";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

export class CrearPersona {
  constructor(
    private readonly repositorioPersonas: RepositorioPersonas,
    private readonly servicioCifrado: ServicioCifrado,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(
    actor: ActorActual,
    entrada: {
      tipoDocumentoId: string | null;
      numeroDocumento: string | null;
      primerNombre: string;
      segundoNombre: string | null;
      primerApellido: string;
      segundoApellido: string | null;
      telefono: string | null;
    },
  ): Promise<Persona> {
    const persona = await this.repositorioPersonas.crear({
      tipoDocumentoId: entrada.tipoDocumentoId,
      numeroDocumentoCifrado: entrada.numeroDocumento
        ? this.servicioCifrado.cifrar(entrada.numeroDocumento)
        : null,
      numeroDocumentoHash: entrada.numeroDocumento
        ? this.servicioCifrado.calcularHashDocumento(entrada.numeroDocumento)
        : null,
      primerNombre: entrada.primerNombre,
      segundoNombre: entrada.segundoNombre,
      primerApellido: entrada.primerApellido,
      segundoApellido: entrada.segundoApellido,
      telefono: entrada.telefono ? this.servicioCifrado.cifrar(entrada.telefono) : null,
      creadoPorUsuarioId: actor.usuarioId,
    });
    return persona;
  }
}

export class ActualizarPersona {
  constructor(
    private readonly repositorioPersonas: RepositorioPersonas,
    private readonly servicioCifrado: ServicioCifrado,
  ) {}

  async ejecutar(
    actor: ActorActual,
    id: string,
    entrada: Partial<{
      tipoDocumentoId: string | null;
      numeroDocumento: string | null;
      primerNombre: string;
      segundoNombre: string | null;
      primerApellido: string;
      segundoApellido: string | null;
      telefono: string | null;
    }>,
  ) {
    const actual = await this.repositorioPersonas.obtenerPorId(id);
    if (!actual) {
      throw new ErrorNoEncontrado("Persona no encontrada");
    }
    const datos: Record<string, unknown> = {
      actualizadoPorUsuarioId: actor.usuarioId,
    };
    if (entrada.tipoDocumentoId !== undefined) datos.tipoDocumentoId = entrada.tipoDocumentoId;
    if (entrada.primerNombre !== undefined) datos.primerNombre = entrada.primerNombre;
    if (entrada.segundoNombre !== undefined) datos.segundoNombre = entrada.segundoNombre;
    if (entrada.primerApellido !== undefined) datos.primerApellido = entrada.primerApellido;
    if (entrada.segundoApellido !== undefined) datos.segundoApellido = entrada.segundoApellido;
    if (entrada.numeroDocumento !== undefined) {
      datos.numeroDocumentoCifrado = entrada.numeroDocumento
        ? this.servicioCifrado.cifrar(entrada.numeroDocumento)
        : null;
      datos.numeroDocumentoHash = entrada.numeroDocumento
        ? this.servicioCifrado.calcularHashDocumento(entrada.numeroDocumento)
        : null;
    }
    if (entrada.telefono !== undefined) {
      datos.telefono = entrada.telefono ? this.servicioCifrado.cifrar(entrada.telefono) : null;
    }
    return this.repositorioPersonas.actualizar(id, datos);
  }
}

export class ObtenerPersona {
  constructor(private readonly repositorioPersonas: RepositorioPersonas) {}

  async ejecutar(id: string) {
    const persona = await this.repositorioPersonas.obtenerPorId(id);
    if (!persona) {
      throw new ErrorNoEncontrado("Persona no encontrada");
    }
    return persona;
  }
}

export class ListarPersonas {
  constructor(private readonly repositorioPersonas: RepositorioPersonas) {}

  ejecutar() {
    return this.repositorioPersonas.listar();
  }
}

export class BuscarProcesosVigentes {
  constructor(
    private readonly repositorioPersonas: RepositorioPersonas,
    private readonly servicioCifrado: ServicioCifrado,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual, numeroDocumento: string) {
    const hash = this.servicioCifrado.calcularHashDocumento(numeroDocumento);
    const procesos = await this.repositorioPersonas.consultarProcesosVigentes(hash);
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.BUSCAR_PERSONA,
      tipoEntidad: "personas",
      entidadId: procesos[0]?.personaId ?? null,
      datosNuevos: { coincidencias: procesos.length },
    });
    return procesos;
  }
}

export class CrearDireccion {
  constructor(private readonly repositorioPersonas: RepositorioPersonas) {}

  async ejecutar(
    actor: ActorActual,
    personaId: string,
    entrada: {
      cantonId: string | null;
      distritoId: string | null;
      barrioId: string | null;
      senas: string | null;
      esActual: boolean;
      vigenteDesde: string;
      vigenteHasta: string | null;
    },
  ) {
    const persona = await this.repositorioPersonas.obtenerPorId(personaId);
    if (!persona) {
      throw new ErrorNoEncontrado("Persona no encontrada");
    }
    if (entrada.esActual) {
      const actual = await this.repositorioPersonas.obtenerDireccionActual(personaId);
      if (actual) {
        await this.repositorioPersonas.actualizarDireccion(actual.id, {
          esActual: false,
          vigenteHasta: entrada.vigenteDesde,
          actualizadoPorUsuarioId: actor.usuarioId,
        });
      }
    }
    return this.repositorioPersonas.crearDireccion({
      personaId,
      cantonId: entrada.cantonId,
      distritoId: entrada.distritoId,
      barrioId: entrada.barrioId,
      senas: entrada.senas,
      esActual: entrada.esActual,
      vigenteDesde: entrada.vigenteDesde,
      vigenteHasta: entrada.esActual ? null : entrada.vigenteHasta,
      creadoPorUsuarioId: actor.usuarioId,
    });
  }
}

export class ListarDirecciones {
  constructor(private readonly repositorioPersonas: RepositorioPersonas) {}

  ejecutar(personaId: string) {
    return this.repositorioPersonas.listarDirecciones(personaId);
  }
}

export class ActualizarDireccion {
  constructor(private readonly repositorioPersonas: RepositorioPersonas) {}

  async ejecutar(
    actor: ActorActual,
    personaId: string,
    direccionId: string,
    entrada: Partial<{
      cantonId: string | null;
      distritoId: string | null;
      barrioId: string | null;
      senas: string | null;
      esActual: boolean;
      vigenteDesde: string;
      vigenteHasta: string | null;
    }>,
  ) {
    if (entrada.esActual) {
      const actual = await this.repositorioPersonas.obtenerDireccionActual(personaId);
      if (actual && actual.id !== direccionId) {
        await this.repositorioPersonas.actualizarDireccion(actual.id, {
          esActual: false,
          vigenteHasta: new Date().toISOString().slice(0, 10),
          actualizadoPorUsuarioId: actor.usuarioId,
        });
      }
    }
    return this.repositorioPersonas.actualizarDireccion(direccionId, {
      ...entrada,
      vigenteHasta: entrada.esActual ? null : entrada.vigenteHasta,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
  }
}
