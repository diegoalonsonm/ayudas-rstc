"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Entrada } from "@/components/ui/campo";
import {
  Aviso,
  CabeceraTarjeta,
  CuerpoTarjeta,
  Dato,
  RejillaDatos,
  Tarjeta,
} from "@/components/ui/marco";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { accionActualizarSolicitud } from "@/lib/acciones/solicitudes";
import { puedeEditarSolicitud } from "@/lib/autorizacion/permisos";
import type { EstadoSolicitud } from "@/lib/dominio/enums";
import { esSolicitudEditable } from "@/lib/dominio/estadosSolicitud";
import type { Direccion, ItemCatalogo, Persona, SolicitudAyuda } from "@/lib/dominio/tipos";
import { formatearFecha, nombreCompletoPersona, textoOGuion } from "@/lib/formato";
import { useNombresOrganizacion, useSesion } from "@/lib/sesion/contextoSesion";

export function PanelResumen({
  solicitud,
  persona,
  direccion,
  catalogos,
  vicariaId,
}: {
  solicitud: SolicitudAyuda;
  persona: Persona;
  direccion: Direccion | null;
  catalogos: { cantones: ItemCatalogo[]; distritos: ItemCatalogo[]; barrios: ItemCatalogo[] };
  vicariaId: string | null;
}) {
  const sesion = useSesion();
  const nombres = useNombresOrganizacion();
  const router = useRouter();
  const editable = puedeEditarSolicitud(sesion, solicitud.estado as EstadoSolicitud);

  const [editando, setEditando] = React.useState(false);
  const [valores, setValores] = React.useState({
    sectorOficial: solicitud.sectorOficial ?? "",
    fechaEntrevista: solicitud.fechaEntrevista ?? "",
    fechaVisita: solicitud.fechaVisita ?? "",
    observaciones: solicitud.observaciones ?? "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionActualizarSolicitud(
      solicitud.id,
      solicitud.estado as EstadoSolicitud,
      {
        sectorOficial: valores.sectorOficial,
        fechaEntrevista: valores.fechaEntrevista,
        fechaVisita: valores.fechaVisita,
        observaciones: valores.observaciones,
      },
    );
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setEditando(false);
    router.refresh();
  }

  const nombreCanton = catalogos.cantones.find((item) => item.id === direccion?.cantonId)?.nombre;
  const nombreDistrito = catalogos.distritos.find(
    (item) => item.id === direccion?.distritoId,
  )?.nombre;
  const nombreBarrio = catalogos.barrios.find((item) => item.id === direccion?.barrioId)?.nombre;

  return (
    <div className="space-y-6">
      <Tarjeta>
        <CabeceraTarjeta
          titulo="Persona solicitante"
          descripcion="El documento y el teléfono se cifran al guardarse y el backend nunca los devuelve descifrados."
          acciones={
            <Boton comoHijo variante="contorno" tamano="pequeno">
              <Link href={`/personas/${persona.id}`}>Ver ficha</Link>
            </Boton>
          }
        />
        <CuerpoTarjeta>
          <RejillaDatos>
            <Dato etiqueta="Nombre completo">{nombreCompletoPersona(persona)}</Dato>
            <Dato etiqueta="Documento">
              {persona.numeroDocumentoHash ? "Documento registrado" : "Sin documento"}
            </Dato>
            <Dato etiqueta="Teléfono">
              {persona.telefono ? "Teléfono registrado" : "Sin teléfono"}
            </Dato>
          </RejillaDatos>
        </CuerpoTarjeta>
      </Tarjeta>

      <Tarjeta>
        <CabeceraTarjeta
          titulo="Entrevista y parroquia"
          descripcion={
            editable
              ? "Solo el sector, las fechas y las observaciones son editables; la persona y la parroquia quedan fijas."
              : `El estado ${solicitud.estado} ya no admite edición de estos campos.`
          }
          acciones={
            editando ? (
              <>
                <Boton variante="contorno" tamano="pequeno" onClick={() => setEditando(false)}>
                  Cancelar
                </Boton>
                <Boton tamano="pequeno" onClick={guardar} disabled={guardando}>
                  {guardando ? "Guardando…" : "Guardar"}
                </Boton>
              </>
            ) : (
              <AccionProtegida
                permitido={editable}
                motivo={
                  esSolicitudEditable(solicitud.estado as EstadoSolicitud)
                    ? "Su rol no permite editar esta solicitud"
                    : "La solicitud solo se edita en borrador, presentada o en revisión"
                }
              >
                <Boton variante="contorno" tamano="pequeno" onClick={() => setEditando(true)}>
                  Editar
                </Boton>
              </AccionProtegida>
            )
          }
        />
        <CuerpoTarjeta className="space-y-4">
          {editando ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Campo etiqueta="Sector oficial">
                  <Entrada
                    value={valores.sectorOficial}
                    onChange={(evento) =>
                      setValores({ ...valores, sectorOficial: evento.target.value })
                    }
                  />
                </Campo>
                <Campo etiqueta="Fecha de entrevista">
                  <Entrada
                    type="date"
                    value={valores.fechaEntrevista}
                    onChange={(evento) =>
                      setValores({ ...valores, fechaEntrevista: evento.target.value })
                    }
                  />
                </Campo>
                <Campo etiqueta="Fecha de visita">
                  <Entrada
                    type="date"
                    value={valores.fechaVisita}
                    onChange={(evento) =>
                      setValores({ ...valores, fechaVisita: evento.target.value })
                    }
                  />
                </Campo>
              </div>
              <Campo etiqueta="Observaciones">
                <AreaTexto
                  value={valores.observaciones}
                  onChange={(evento) =>
                    setValores({ ...valores, observaciones: evento.target.value })
                  }
                />
              </Campo>
              {error ? <Aviso tono="peligro">{error}</Aviso> : null}
            </>
          ) : (
            <>
              <RejillaDatos>
                <Dato etiqueta="Parroquia receptora">
                  {nombres.parroquias[solicitud.parroquiaReceptoraId] ?? "—"}
                </Dato>
                <Dato etiqueta="Vicaría">
                  {vicariaId ? (nombres.vicarias[vicariaId] ?? "—") : "—"}
                </Dato>
                <Dato etiqueta="Sector oficial">{textoOGuion(solicitud.sectorOficial)}</Dato>
                <Dato etiqueta="Fecha de entrevista">
                  {formatearFecha(solicitud.fechaEntrevista)}
                </Dato>
                <Dato etiqueta="Fecha de visita">{formatearFecha(solicitud.fechaVisita)}</Dato>
                <Dato etiqueta="Presentada">{formatearFecha(solicitud.presentadaEn)}</Dato>
              </RejillaDatos>
              <Dato etiqueta="Observaciones">
                <p className="whitespace-pre-line">{textoOGuion(solicitud.observaciones)}</p>
              </Dato>
            </>
          )}
        </CuerpoTarjeta>
      </Tarjeta>

      <Tarjeta>
        <CabeceraTarjeta
          titulo="Dirección actual"
          descripcion="Pertenece a la persona y se administra desde su ficha."
          acciones={
            <Boton comoHijo variante="contorno" tamano="pequeno">
              <Link href={`/personas/${persona.id}`}>Administrar direcciones</Link>
            </Boton>
          }
        />
        <CuerpoTarjeta>
          {direccion ? (
            <RejillaDatos>
              <Dato etiqueta="Cantón">{textoOGuion(nombreCanton)}</Dato>
              <Dato etiqueta="Distrito">{textoOGuion(nombreDistrito)}</Dato>
              <Dato etiqueta="Barrio">{textoOGuion(nombreBarrio)}</Dato>
              <Dato etiqueta="Señas" className="sm:col-span-2 lg:col-span-3">
                <p className="whitespace-pre-line">{textoOGuion(direccion.senas)}</p>
              </Dato>
              <Dato etiqueta="Vigente desde">{formatearFecha(direccion.vigenteDesde)}</Dato>
            </RejillaDatos>
          ) : (
            <p className="text-sm text-[var(--color-tinta-suave)]">
              La persona no tiene una dirección actual registrada.
            </p>
          )}
        </CuerpoTarjeta>
      </Tarjeta>
    </div>
  );
}
