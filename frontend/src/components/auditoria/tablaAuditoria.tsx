"use client";

import * as React from "react";
import { Paginacion, paginar } from "@/components/comunes/paginacion";
import { Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Insignia } from "@/components/ui/insignia";
import { Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { ResultadoAuditoria } from "@/lib/dominio/enums";
import { etiquetaAccionAuditoria, etiquetaRol } from "@/lib/dominio/etiquetas";
import type { EventoAuditoria } from "@/lib/dominio/tipos";
import { formatearFechaHora, textoOGuion } from "@/lib/formato";

export function TablaAuditoria({ eventos }: { eventos: EventoAuditoria[] }) {
  const [accion, setAccion] = React.useState("TODAS");
  const [entidad, setEntidad] = React.useState("TODAS");
  const [resultado, setResultado] = React.useState("TODOS");
  const [desde, setDesde] = React.useState("");
  const [hasta, setHasta] = React.useState("");
  const [pagina, setPagina] = React.useState(1);

  const acciones = React.useMemo(
    () => [...new Set(eventos.map((evento) => evento.accion))].sort(),
    [eventos],
  );
  const entidades = React.useMemo(
    () => [...new Set(eventos.map((evento) => evento.tipoEntidad))].sort(),
    [eventos],
  );

  const filtrados = React.useMemo(
    () =>
      eventos.filter((evento) => {
        if (accion !== "TODAS" && evento.accion !== accion) {
          return false;
        }
        if (entidad !== "TODAS" && evento.tipoEntidad !== entidad) {
          return false;
        }
        if (resultado !== "TODOS" && evento.resultado !== resultado) {
          return false;
        }
        const fecha = evento.ocurridoEn.slice(0, 10);
        if (desde && fecha < desde) {
          return false;
        }
        if (hasta && fecha > hasta) {
          return false;
        }
        return true;
      }),
    [eventos, accion, entidad, resultado, desde, hasta],
  );

  React.useEffect(() => {
    setPagina(1);
  }, [accion, entidad, resultado, desde, hasta]);

  const visibles = paginar(filtrados, pagina);

  return (
    <div>
      <div className="grid gap-3 border-b border-[var(--color-borde)] px-5 py-4 sm:grid-cols-2 lg:grid-cols-5">
        <Campo etiqueta="Acción">
          <Seleccion value={accion} onChange={(evento) => setAccion(evento.target.value)}>
            <option value="TODAS">Todas</option>
            {acciones.map((valor) => (
              <option key={valor} value={valor}>
                {etiquetaAccionAuditoria(valor)}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo etiqueta="Entidad">
          <Seleccion value={entidad} onChange={(evento) => setEntidad(evento.target.value)}>
            <option value="TODAS">Todas</option>
            {entidades.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo etiqueta="Resultado">
          <Seleccion value={resultado} onChange={(evento) => setResultado(evento.target.value)}>
            <option value="TODOS">Todos</option>
            <option value={ResultadoAuditoria.EXITOSO}>Exitoso</option>
            <option value={ResultadoAuditoria.FALLIDO}>Fallido</option>
          </Seleccion>
        </Campo>
        <Campo etiqueta="Desde">
          <Entrada type="date" value={desde} onChange={(evento) => setDesde(evento.target.value)} />
        </Campo>
        <Campo etiqueta="Hasta">
          <Entrada type="date" value={hasta} onChange={(evento) => setHasta(evento.target.value)} />
        </Campo>
      </div>

      {filtrados.length === 0 ? (
        <Vacio mensaje="Ningún evento coincide con los filtros aplicados." />
      ) : (
        <>
          <Tabla>
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Fecha y hora</CeldaEncabezado>
                <CeldaEncabezado>Acción</CeldaEncabezado>
                <CeldaEncabezado>Entidad</CeldaEncabezado>
                <CeldaEncabezado>Rol</CeldaEncabezado>
                <CeldaEncabezado alineacion="centro">Resultado</CeldaEncabezado>
                <CeldaEncabezado>Motivo</CeldaEncabezado>
                <CeldaEncabezado alineacion="derecha" />
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {visibles.map((evento) => (
                <FilaTabla key={evento.id}>
                  <Celda className="whitespace-nowrap">
                    {formatearFechaHora(evento.ocurridoEn)}
                  </Celda>
                  <Celda className="font-medium">{etiquetaAccionAuditoria(evento.accion)}</Celda>
                  <Celda>{evento.tipoEntidad}</Celda>
                  <Celda>{evento.rolCodigo ? etiquetaRol(evento.rolCodigo) : "—"}</Celda>
                  <Celda alineacion="centro">
                    {evento.resultado === ResultadoAuditoria.EXITOSO ? (
                      <Insignia tono="exito">Exitoso</Insignia>
                    ) : (
                      <Insignia tono="peligro">Fallido</Insignia>
                    )}
                  </Celda>
                  <Celda className="max-w-56 truncate">{textoOGuion(evento.motivo)}</Celda>
                  <Celda alineacion="derecha">
                    <DetalleEvento evento={evento} />
                  </Celda>
                </FilaTabla>
              ))}
            </CuerpoTabla>
          </Tabla>
          <Paginacion pagina={pagina} total={filtrados.length} alCambiar={setPagina} />
        </>
      )}
    </div>
  );
}

function DetalleEvento({ evento }: { evento: EventoAuditoria }) {
  return (
    <Dialogo>
      <DisparadorDialogo asChild>
        <button className="text-xs font-medium text-[var(--color-primario-fuerte)] hover:underline">
          Ver detalle
        </button>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo={etiquetaAccionAuditoria(evento.accion)}
        descripcion={formatearFechaHora(evento.ocurridoEn)}
      >
        <dl className="space-y-3 text-sm">
          <Linea etiqueta="Entidad">{evento.tipoEntidad}</Linea>
          <Linea etiqueta="Identificador de entidad">
            <code className="text-xs">{textoOGuion(evento.entidadId)}</code>
          </Linea>
          <Linea etiqueta="Usuario">
            <code className="text-xs">{textoOGuion(evento.usuarioId)}</code>
          </Linea>
          <Linea etiqueta="Tipo de actor">{evento.tipoActor}</Linea>
          <Linea etiqueta="Origen">{textoOGuion(evento.origen)}</Linea>
          <Linea etiqueta="Código de error">{textoOGuion(evento.codigoError)}</Linea>
          <Linea etiqueta="Motivo">{textoOGuion(evento.motivo)}</Linea>
          <Linea etiqueta="Campos modificados">
            {evento.camposModificados?.length ? evento.camposModificados.join(", ") : "—"}
          </Linea>
          <Linea etiqueta="Dirección IP">{textoOGuion(evento.direccionIp)}</Linea>
          <Linea etiqueta="Identificador de petición">
            <code className="text-xs">{textoOGuion(evento.identificadorSolicitud)}</code>
          </Linea>
        </dl>
      </ContenidoDialogo>
    </Dialogo>
  );
}

function Linea({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <dt className="w-48 shrink-0 text-xs uppercase tracking-wide text-[var(--color-tinta-suave)]">
        {etiqueta}
      </dt>
      <dd className="min-w-0 flex-1 break-words">{children}</dd>
    </div>
  );
}
