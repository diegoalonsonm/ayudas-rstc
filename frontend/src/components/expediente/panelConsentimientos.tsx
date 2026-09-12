"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Upload } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Aviso, CabeceraTarjeta, CuerpoTarjeta, Tarjeta, Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import {
  accionCargarConsentimiento,
  accionObtenerUrlDocumento,
} from "@/lib/acciones/documentos";
import { puede } from "@/lib/autorizacion/permisos";
import type { DocumentoConsentimiento } from "@/lib/dominio/tipos";
import { formatearFecha, formatearFechaHora, formatearTamano } from "@/lib/formato";
import { useSesion } from "@/lib/sesion/contextoSesion";

export function PanelConsentimientos({
  solicitudId,
  documentos,
}: {
  solicitudId: string;
  documentos: DocumentoConsentimiento[];
}) {
  const sesion = useSesion();
  const vigentes = documentos.filter((documento) => !documento.eliminadoEn);

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Documentos de consentimiento"
        descripcion="Acepta PDF, JPEG y PNG hasta 10 MB. El archivo se guarda en un bucket privado."
        acciones={
          <AccionProtegida
            permitido={puede(sesion, "documentosCargar")}
            motivo="Su rol no permite cargar documentos"
          >
            <FormularioCarga solicitudId={solicitudId} />
          </AccionProtegida>
        }
      />
      <CuerpoTarjeta className="pb-0">
        <Aviso tono="advertencia" titulo="Cada apertura queda auditada">
          Al ver o descargar un consentimiento se registra un evento de auditoría con su usuario.
          El enlace firmado vive 60 segundos y se solicita en el momento del clic.
        </Aviso>
      </CuerpoTarjeta>
      {vigentes.length === 0 ? (
        <Vacio mensaje="Este expediente no tiene consentimientos cargados." />
      ) : (
        <Tabla>
          <CabeceraTabla>
            <tr>
              <CeldaEncabezado>Archivo</CeldaEncabezado>
              <CeldaEncabezado>Firma</CeldaEncabezado>
              <CeldaEncabezado>Tamaño</CeldaEncabezado>
              <CeldaEncabezado>Cargado</CeldaEncabezado>
              <CeldaEncabezado alineacion="derecha" />
            </tr>
          </CabeceraTabla>
          <CuerpoTabla>
            {vigentes.map((documento) => (
              <FilaTabla key={documento.id}>
                <Celda className="font-medium">{documento.nombreArchivoOriginal}</Celda>
                <Celda>{formatearFecha(documento.fechaFirma)}</Celda>
                <Celda>{formatearTamano(documento.tamanoBytes)}</Celda>
                <Celda>{formatearFechaHora(documento.cargadoEn)}</Celda>
                <Celda alineacion="derecha">
                  <div className="flex justify-end gap-1.5">
                    <BotonApertura documentoId={documento.id} descargar={false} />
                    <BotonApertura documentoId={documento.id} descargar />
                  </div>
                </Celda>
              </FilaTabla>
            ))}
          </CuerpoTabla>
        </Tabla>
      )}
    </Tarjeta>
  );
}

function BotonApertura({
  documentoId,
  descargar,
}: {
  documentoId: string;
  descargar: boolean;
}) {
  const [cargando, setCargando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function abrir() {
    setError(null);
    setCargando(true);
    const resultado = await accionObtenerUrlDocumento(documentoId, descargar);
    setCargando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    window.open(resultado.datos.urlFirmada, "_blank", "noopener,noreferrer");
  }

  return (
    <span className="inline-flex flex-col items-end">
      <Boton variante="fantasma" tamano="pequeno" onClick={abrir} disabled={cargando}>
        {descargar ? <Download /> : <Eye />}
        {descargar ? "Descargar" : "Ver"}
      </Boton>
      {error ? <span className="text-xs text-[var(--color-peligro)]">{error}</span> : null}
    </span>
  );
}

function FormularioCarga({ solicitudId }: { solicitudId: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cargando, setCargando] = React.useState(false);
  const referencia = React.useRef<HTMLFormElement>(null);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setCargando(true);
    const datos = new FormData(evento.currentTarget);
    const resultado = await accionCargarConsentimiento(solicitudId, datos);
    setCargando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    referencia.current?.reset();
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton variante="contorno" tamano="pequeno">
          <Upload />
          Cargar consentimiento
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Cargar consentimiento firmado"
        descripcion="El backend valida el tipo de archivo y calcula la suma de verificación."
      >
        <form ref={referencia} onSubmit={enviar} className="space-y-4">
          <Campo etiqueta="Archivo" requerido ayuda="PDF, JPEG o PNG, hasta 10 MB.">
            <input
              type="file"
              name="archivo"
              accept="application/pdf,image/jpeg,image/png"
              required
              className="w-full rounded-lg border border-[var(--color-borde)] bg-[var(--color-superficie)] px-3 py-1.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-primario-suave)] file:px-3 file:py-1.5 file:text-sm file:text-[var(--color-primario-fuerte)]"
            />
          </Campo>
          <Campo etiqueta="Fecha de firma">
            <Entrada type="date" name="fechaFirma" />
          </Campo>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton
              type="button"
              variante="contorno"
              onClick={() => setAbierto(false)}
              disabled={cargando}
            >
              Cancelar
            </Boton>
            <Boton type="submit" disabled={cargando}>
              {cargando ? "Cargando…" : "Cargar"}
            </Boton>
          </div>
        </form>
      </ContenidoDialogo>
    </Dialogo>
  );
}
