import { Inject, Injectable, Scope } from "@nestjs/common";
import { DocumentoConsentimiento } from "../../domain/entities/tiposDominio";
import { RepositorioDocumentos } from "../../domain/repositories/contratosRepositorio";
import { RepositorioGenericoSupabase } from "./repositorioGenericoSupabase";

@Injectable({ scope: Scope.REQUEST })
export class RepositorioDocumentosSupabase implements RepositorioDocumentos {
  constructor(@Inject(RepositorioGenericoSupabase) private readonly base: RepositorioGenericoSupabase) {}

  crear(datos: Record<string, unknown>): Promise<DocumentoConsentimiento> {
    return this.base.insertar<DocumentoConsentimiento>("documentos_consentimiento", datos);
  }

  listarPorSolicitud(solicitudId: string): Promise<DocumentoConsentimiento[]> {
    return this.base.listarActivos<DocumentoConsentimiento>("documentos_consentimiento", {
      solicitudAyudaId: solicitudId,
    });
  }

  obtenerPorId(id: string): Promise<DocumentoConsentimiento | null> {
    return this.base.obtenerPorId<DocumentoConsentimiento>("documentos_consentimiento", id);
  }

  actualizar(id: string, datos: Record<string, unknown>): Promise<DocumentoConsentimiento> {
    return this.base.actualizar<DocumentoConsentimiento>("documentos_consentimiento", id, datos);
  }
}
