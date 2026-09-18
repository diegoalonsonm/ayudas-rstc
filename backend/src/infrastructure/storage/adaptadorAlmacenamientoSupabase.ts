import { Injectable } from "@nestjs/common";
import { ArchivoCargado, PuertoAlmacenamiento } from "../../application/ports/puertosAplicacion";
import { ErrorValidacion } from "../../domain/errors/errorDominio";
import { FabricaClienteSupabase } from "../supabase/fabricaClienteSupabase";

const BUCKET = "documentos-consentimiento";

@Injectable()
export class AdaptadorAlmacenamientoSupabase implements PuertoAlmacenamiento {
  constructor(private readonly fabrica: FabricaClienteSupabase) {}

  async subirConsentimiento(claveObjeto: string, archivo: ArchivoCargado): Promise<void> {
    const { error } = await this.fabrica.crearClienteServicio().storage.from(BUCKET).upload(claveObjeto, archivo.buffer, {
      contentType: archivo.tipoMime,
      upsert: false,
    });
    if (error) {
      throw new ErrorValidacion(error.message);
    }
  }

  async crearUrlFirmada(claveObjeto: string, segundos: number): Promise<string> {
    const { data, error } = await this.fabrica
      .crearClienteServicio()
      .storage.from(BUCKET)
      .createSignedUrl(claveObjeto, segundos);
    if (error || !data?.signedUrl) {
      throw new ErrorValidacion(error?.message ?? "No se pudo firmar la URL");
    }
    return data.signedUrl;
  }
}
