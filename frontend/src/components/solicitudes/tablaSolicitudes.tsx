"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Entrada, Seleccion } from "@/components/ui/campo";
import { InsigniaEstado } from "@/components/ui/insignia";
import { Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { Paginacion, paginar, TAMANO_PAGINA } from "@/components/comunes/paginacion";
import { ESTADOS_SOLICITUD, type EstadoSolicitud } from "@/lib/dominio/enums";
import { etiquetaEstado } from "@/lib/dominio/etiquetas";
import { verColumnaParroquia, verColumnaVicaria } from "@/lib/autorizacion/permisos";
import { useNombresOrganizacion, useSesion } from "@/lib/sesion/contextoSesion";
import type { SolicitudAyuda } from "@/lib/dominio/tipos";
import { formatearFecha, nombreCompletoPersona } from "@/lib/formato";

export type FilaSolicitud = SolicitudAyuda & {
  nombreSolicitante?: string | null;
};

export function TablaSolicitudes({
  solicitudes,
  vicariaPorParroquia,
  personas,
}: {
  solicitudes: SolicitudAyuda[];
  vicariaPorParroquia: Record<string, string>;
  personas: Record<
    string,
    { primerNombre: string; segundoNombre: string | null; primerApellido: string; segundoApellido: string | null }
  >;
}) {
  const sesion = useSesion();
  const nombres = useNombresOrganizacion();
  const [texto, setTexto] = React.useState("");
  const [estado, setEstado] = React.useState<EstadoSolicitud | "TODOS">("TODOS");
  const [incluirEliminadas, setIncluirEliminadas] = React.useState(false);
  const [pagina, setPagina] = React.useState(1);

  const mostrarParroquia = verColumnaParroquia(sesion);
  const mostrarVicaria = verColumnaVicaria(sesion);

  const filtradas = React.useMemo(() => {
    const consulta = texto.trim().toLowerCase();
    return solicitudes.filter((solicitud) => {
      if (!incluirEliminadas && solicitud.eliminadoEn) {
        return false;
      }
      if (estado !== "TODOS" && solicitud.estado !== estado) {
        return false;
      }
      if (!consulta) {
        return true;
      }
      const persona = personas[solicitud.personaSolicitanteId];
      const solicitante = persona ? nombreCompletoPersona(persona) : "";
      const parroquia = nombres.parroquias[solicitud.parroquiaReceptoraId] ?? "";
      return [solicitud.numeroSolicitud, solicitante, parroquia, solicitud.sectorOficial ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(consulta);
    });
  }, [solicitudes, texto, estado, incluirEliminadas, personas, nombres.parroquias]);

  React.useEffect(() => {
    setPagina(1);
  }, [texto, estado, incluirEliminadas]);

  const visibles = paginar(filtradas, pagina);
  const columnas = 5 + (mostrarParroquia ? 1 : 0) + (mostrarVicaria ? 1 : 0);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 border-b border-[var(--color-borde)] px-5 py-4">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-tinta-suave)]" />
          <Entrada
            className="pl-9"
            placeholder="Buscar por número, solicitante o sector"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            aria-label="Buscar solicitudes"
          />
        </div>
        <Seleccion
          className="w-48"
          value={estado}
          onChange={(evento) => setEstado(evento.target.value as EstadoSolicitud | "TODOS")}
          aria-label="Filtrar por estado"
        >
          <option value="TODOS">Todos los estados</option>
          {ESTADOS_SOLICITUD.map((valor) => (
            <option key={valor} value={valor}>
              {etiquetaEstado(valor)}
            </option>
          ))}
        </Seleccion>
        <label className="flex items-center gap-2 text-xs text-[var(--color-tinta-suave)]">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-primario)]"
            checked={incluirEliminadas}
            onChange={(evento) => setIncluirEliminadas(evento.target.checked)}
          />
          Incluir eliminadas
        </label>
      </div>

      {filtradas.length === 0 ? (
        <Vacio mensaje="Ninguna solicitud coincide con los filtros aplicados." />
      ) : (
        <>
          <Tabla>
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Número</CeldaEncabezado>
                <CeldaEncabezado>Solicitante</CeldaEncabezado>
                <CeldaEncabezado>Estado</CeldaEncabezado>
                {mostrarVicaria ? <CeldaEncabezado>Vicaría</CeldaEncabezado> : null}
                {mostrarParroquia ? <CeldaEncabezado>Parroquia</CeldaEncabezado> : null}
                <CeldaEncabezado>Entrevista</CeldaEncabezado>
                <CeldaEncabezado alineacion="derecha">Registrada</CeldaEncabezado>
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {visibles.map((solicitud) => {
                const persona = personas[solicitud.personaSolicitanteId];
                const vicariaId = vicariaPorParroquia[solicitud.parroquiaReceptoraId];
                return (
                  <FilaTabla key={solicitud.id}>
                    <Celda>
                      <Link
                        href={`/solicitudes/${solicitud.id}`}
                        className="font-medium text-[var(--color-primario-fuerte)] hover:underline"
                      >
                        {solicitud.numeroSolicitud}
                      </Link>
                      {solicitud.eliminadoEn ? (
                        <span className="ml-2 text-xs text-[var(--color-peligro)]">eliminada</span>
                      ) : null}
                    </Celda>
                    <Celda>{persona ? nombreCompletoPersona(persona) : "—"}</Celda>
                    <Celda>
                      <InsigniaEstado estado={solicitud.estado} />
                    </Celda>
                    {mostrarVicaria ? (
                      <Celda>{vicariaId ? (nombres.vicarias[vicariaId] ?? "—") : "—"}</Celda>
                    ) : null}
                    {mostrarParroquia ? (
                      <Celda>{nombres.parroquias[solicitud.parroquiaReceptoraId] ?? "—"}</Celda>
                    ) : null}
                    <Celda>{formatearFecha(solicitud.fechaEntrevista)}</Celda>
                    <Celda alineacion="derecha">{formatearFecha(solicitud.creadoEn)}</Celda>
                  </FilaTabla>
                );
              })}
              {visibles.length === 0 ? (
                <FilaTabla>
                  <Celda colSpan={columnas} alineacion="centro">
                    Sin resultados en esta página.
                  </Celda>
                </FilaTabla>
              ) : null}
            </CuerpoTabla>
          </Tabla>
          <Paginacion
            pagina={pagina}
            total={filtradas.length}
            tamano={TAMANO_PAGINA}
            alCambiar={setPagina}
          />
        </>
      )}
    </div>
  );
}
