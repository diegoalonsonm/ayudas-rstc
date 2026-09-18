"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada } from "@/components/ui/campo";
import { InsigniaEstado } from "@/components/ui/insignia";
import { Aviso, CabeceraTarjeta, CuerpoTarjeta, Tarjeta } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { accionBuscarProcesosVigentes } from "@/lib/acciones/personas";
import type { ProcesoVigentePersona } from "@/lib/dominio/tipos";

export function BuscadorDocumento() {
  const [documento, setDocumento] = React.useState("");
  const [procesos, setProcesos] = React.useState<ProcesoVigentePersona[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [buscando, setBuscando] = React.useState(false);

  async function buscar(evento: React.FormEvent) {
    evento.preventDefault();
    setError(null);
    setBuscando(true);
    const resultado = await accionBuscarProcesosVigentes({ numeroDocumento: documento });
    setBuscando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      setProcesos(null);
      return;
    }
    setProcesos(resultado.datos);
  }

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Buscar procesos vigentes por documento"
        descripcion="Esta búsqueda atraviesa todo el territorio diocesano, sin importar su alcance, pero solo devuelve el resumen del proceso vigente."
      />
      <CuerpoTarjeta className="space-y-4">
        <form onSubmit={buscar} className="flex flex-wrap items-end gap-3">
          <Campo etiqueta="Número de documento" className="min-w-56 flex-1">
            <Entrada
              value={documento}
              onChange={(evento) => setDocumento(evento.target.value)}
              placeholder="1-2345-6789"
            />
          </Campo>
          <Boton type="submit" disabled={buscando || documento.trim().length < 4}>
            <Search />
            {buscando ? "Buscando…" : "Buscar"}
          </Boton>
        </form>

        {error ? <Aviso tono="peligro">{error}</Aviso> : null}

        {procesos && procesos.length === 0 ? (
          <Aviso tono="exito">No hay procesos vigentes con ese documento.</Aviso>
        ) : null}

        {procesos && procesos.length > 0 ? (
          <>
            <Aviso tono="advertencia">
              Cada búsqueda queda registrada en la auditoría con la acción BUSCAR_PERSONA.
            </Aviso>
            <div className="marco overflow-hidden">
              <Tabla>
                <CabeceraTabla>
                  <tr>
                    <CeldaEncabezado>Solicitud</CeldaEncabezado>
                    <CeldaEncabezado>Estado</CeldaEncabezado>
                    <CeldaEncabezado>Tipo de ayuda</CeldaEncabezado>
                    <CeldaEncabezado>Parroquia</CeldaEncabezado>
                    <CeldaEncabezado>Vicaría</CeldaEncabezado>
                  </tr>
                </CabeceraTabla>
                <CuerpoTabla>
                  {procesos.map((proceso) => (
                    <FilaTabla key={`${proceso.solicitudId}-${proceso.tipoAyudaCodigo}`}>
                      <Celda className="font-medium">{proceso.numeroSolicitud}</Celda>
                      <Celda>
                        <InsigniaEstado estado={proceso.estado} />
                      </Celda>
                      <Celda>{proceso.tipoAyudaNombre}</Celda>
                      <Celda>{proceso.parroquiaNombre}</Celda>
                      <Celda>{proceso.vicariaNombre}</Celda>
                    </FilaTabla>
                  ))}
                </CuerpoTabla>
              </Tabla>
            </div>
          </>
        ) : null}
      </CuerpoTarjeta>
    </Tarjeta>
  );
}
