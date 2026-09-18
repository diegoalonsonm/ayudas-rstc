"use server";

import { revalidatePath } from "next/cache";
import {
  cargarDocumentoConsentimiento,
  obtenerUrlDocumento,
} from "../api/recursos/documentos";
import { puede } from "../autorizacion/permisos";
import { MIMES_CONSENTIMIENTO } from "../dominio/enums";
import type { DocumentoConsentimiento } from "../dominio/tipos";
import { sesionActual } from "../sesion/servidor";
import { fallido, intentar, type Resultado } from "./resultado";

const TAMANO_MAXIMO_BYTES = 10 * 1024 * 1024;

export async function accionCargarConsentimiento(
  solicitudId: string,
  formulario: FormData,
): Promise<Resultado<DocumentoConsentimiento>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "documentosCargar")) {
    return fallido("Su rol no permite cargar documentos de consentimiento");
  }
  const archivo = formulario.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return fallido("Seleccione el archivo del consentimiento firmado");
  }
  if (!MIMES_CONSENTIMIENTO.includes(archivo.type as (typeof MIMES_CONSENTIMIENTO)[number])) {
    return fallido("El backend solo acepta archivos PDF, JPEG o PNG");
  }
  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    return fallido("El archivo supera los 10 MB permitidos");
  }
  const fechaFirmaValor = formulario.get("fechaFirma");
  const fechaFirma =
    typeof fechaFirmaValor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fechaFirmaValor)
      ? fechaFirmaValor
      : null;

  const carga = new FormData();
  carga.set("archivo", archivo, archivo.name);

  const resultado = await intentar(() =>
    cargarDocumentoConsentimiento(solicitudId, carga, fechaFirma),
  );
  if (resultado.exito) {
    revalidatePath(`/solicitudes/${solicitudId}`);
  }
  return resultado;
}

export async function accionObtenerUrlDocumento(
  documentoId: string,
  descargar: boolean,
): Promise<Resultado<{ urlFirmada: string; expiraEnSegundos: number }>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "documentosVer")) {
    return fallido("Su rol no permite abrir documentos de consentimiento");
  }
  return await intentar(() => obtenerUrlDocumento(documentoId, descargar));
}
