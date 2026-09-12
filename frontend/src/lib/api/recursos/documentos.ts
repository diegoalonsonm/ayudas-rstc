import { solicitar } from "../clienteServidor";
import type { DocumentoConsentimiento, UrlDocumento } from "../../dominio/tipos";

export async function cargarDocumentoConsentimiento(
  solicitudId: string,
  formulario: FormData,
  fechaFirma: string | null,
): Promise<DocumentoConsentimiento> {
  return await solicitar<DocumentoConsentimiento>(
    `/solicitudes-ayuda/${solicitudId}/documentos-consentimiento`,
    {
      metodo: "POST",
      formulario,
      parametros: { fechaFirma: fechaFirma ?? undefined },
    },
  );
}

export async function obtenerUrlDocumento(
  documentoId: string,
  descargar: boolean,
): Promise<UrlDocumento> {
  return await solicitar<UrlDocumento>(`/documentos-consentimiento/${documentoId}/url`, {
    parametros: { descargar: descargar ? "true" : undefined },
    revalidar: false,
  });
}
