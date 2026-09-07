import { createHash, randomUUID } from "crypto";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { AccionAuditoria } from "../../../domain/enums/catalogosDominio";
import { ErrorNoAutorizado, ErrorNoEncontrado, ErrorValidacion } from "../../../domain/errors/errorDominio";
import {
  RepositorioAuditoria,
  RepositorioDocumentos,
  RepositorioSolicitudes,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioAlcance } from "../../../domain/services/servicioAlcance";
import { ArchivoCargado, PuertoAlmacenamiento } from "../../ports/puertosAplicacion";
import { RegistrarEventoAuditoria } from "../auditoria/registrarEventoAuditoria";

const MIME_PERMITIDOS = ["application/pdf", "image/jpeg", "image/png"];

export class CargarDocumentoConsentimiento {
  constructor(
    private readonly repositorioSolicitudes: RepositorioSolicitudes,
    private readonly repositorioDocumentos: RepositorioDocumentos,
    private readonly almacenamiento: PuertoAlmacenamiento,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual, solicitudId: string, archivo: ArchivoCargado, fechaFirma: string | null) {
    if (!MIME_PERMITIDOS.includes(archivo.tipoMime)) {
      throw new ErrorValidacion("Tipo de archivo no permitido");
    }
    const solicitud = await this.repositorioSolicitudes.obtenerPorId(solicitudId);
    if (!solicitud) {
      throw new ErrorNoEncontrado("Solicitud no encontrada");
    }
    const suma = createHash("sha256").update(archivo.buffer).digest("hex");
    const claveObjeto = `${solicitudId}/${randomUUID()}`;
    await this.almacenamiento.subirConsentimiento(claveObjeto, archivo);
    const documento = await this.repositorioDocumentos.crear({
      solicitudAyudaId: solicitudId,
      nombreBucket: "documentos-consentimiento",
      claveObjeto,
      nombreArchivoOriginal: archivo.nombreOriginal,
      tipoMime: archivo.tipoMime,
      tamanoBytes: archivo.tamanoBytes,
      sumaVerificacion: suma,
      fechaFirma,
      usuarioCargaId: actor.usuarioId,
      creadoPorUsuarioId: actor.usuarioId,
    });
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: AccionAuditoria.CARGAR_DOCUMENTO,
      tipoEntidad: "documentos_consentimiento",
      entidadId: documento.id,
    });
    return documento;
  }
}

export class ObtenerUrlDocumento {
  constructor(
    private readonly repositorioDocumentos: RepositorioDocumentos,
    private readonly almacenamiento: PuertoAlmacenamiento,
    private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  async ejecutar(actor: ActorActual, id: string, descargar: boolean) {
    const documento = await this.repositorioDocumentos.obtenerPorId(id);
    if (!documento || documento.eliminadoEn) {
      throw new ErrorNoEncontrado("Documento no encontrado");
    }
    const url = await this.almacenamiento.crearUrlFirmada(documento.claveObjeto, 60);
    await new RegistrarEventoAuditoria(this.repositorioAuditoria).ejecutar({
      actor,
      accion: descargar ? AccionAuditoria.DESCARGAR_DOCUMENTO : AccionAuditoria.VISUALIZAR_DOCUMENTO,
      tipoEntidad: "documentos_consentimiento",
      entidadId: id,
    });
    return { urlFirmada: url, expiraEnSegundos: 60 };
  }
}

export class ListarDocumentosConsentimiento {
  constructor(private readonly repositorioDocumentos: RepositorioDocumentos) {}

  ejecutar(solicitudId: string) {
    return this.repositorioDocumentos.listarPorSolicitud(solicitudId);
  }
}

export class GestionarCatalogo {
  constructor(
    private readonly repositorioGenerico: import("../../../domain/repositories/contratosRepositorio").RepositorioGenerico,
    private readonly servicioAlcance = new ServicioAlcance(),
  ) {}

  listar(tabla: string, filtros?: Record<string, unknown>) {
    return this.repositorioGenerico.listarActivos(tabla, filtros);
  }

  obtener(tabla: string, id: string) {
    return this.repositorioGenerico.obtenerPorId(tabla, id);
  }

  crear(actor: ActorActual, tabla: string, datos: Record<string, unknown>) {
    this.exigirAdministrador(actor);
    return this.repositorioGenerico.insertar(tabla, {
      ...datos,
      creadoPorUsuarioId: actor.usuarioId,
    });
  }

  actualizar(actor: ActorActual, tabla: string, id: string, datos: Record<string, unknown>) {
    this.exigirAdministrador(actor);
    return this.repositorioGenerico.actualizar(tabla, id, {
      ...datos,
      actualizadoPorUsuarioId: actor.usuarioId,
    });
  }

  eliminar(actor: ActorActual, tabla: string, id: string, motivo: string) {
    this.exigirAdministrador(actor);
    if (!motivo.trim()) {
      throw new ErrorValidacion("motivoEliminacion es obligatorio");
    }
    return this.repositorioGenerico.eliminarLogicamente(tabla, id, motivo, actor.usuarioId);
  }

  private exigirAdministrador(actor: ActorActual) {
    if (!this.servicioAlcance.esAdministrador(actor)) {
      throw new ErrorNoAutorizado("Solo el administrador puede modificar catálogos");
    }
  }
}

export class ListarEventosAuditoria {
  constructor(
    private readonly repositorioAuditoria: RepositorioAuditoria,
    private readonly servicioAlcance = new ServicioAlcance(),
  ) {}

  ejecutar(actor: ActorActual, filtros?: Record<string, unknown>) {
    if (!this.servicioAlcance.puedeVerAuditoria(actor)) {
      throw new ErrorNoAutorizado("No puede consultar eventos de auditoría");
    }
    return this.repositorioAuditoria.listar(filtros);
  }
}
