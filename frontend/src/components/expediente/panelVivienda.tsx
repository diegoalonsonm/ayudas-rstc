"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Seleccion } from "@/components/ui/campo";
import {
  Aviso,
  CabeceraTarjeta,
  CuerpoTarjeta,
  Dato,
  RejillaDatos,
  Tarjeta,
} from "@/components/ui/marco";
import { nombreDeCatalogo } from "@/lib/dominio/catalogos";
import { accionGuardarEvaluacionVivienda } from "@/lib/acciones/solicitudes";
import { puede } from "@/lib/autorizacion/permisos";
import type { EvaluacionVivienda, ItemCatalogo } from "@/lib/dominio/tipos";
import { formatearFechaHora, textoOGuion } from "@/lib/formato";
import { useSesion } from "@/lib/sesion/contextoSesion";

export function PanelVivienda({
  solicitudId,
  evaluacion,
  catalogos,
}: {
  solicitudId: string;
  evaluacion: EvaluacionVivienda | null;
  catalogos: {
    tiposVivienda: ItemCatalogo[];
    tiposTenencia: ItemCatalogo[];
    condicionesVivienda: ItemCatalogo[];
  };
}) {
  const sesion = useSesion();
  const router = useRouter();
  const [editando, setEditando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    tipoViviendaId: evaluacion?.tipoViviendaId ?? "",
    tipoTenenciaId: evaluacion?.tipoTenenciaId ?? "",
    condicionViviendaId: evaluacion?.condicionViviendaId ?? "",
    observaciones: evaluacion?.observaciones ?? "",
  });

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionGuardarEvaluacionVivienda(solicitudId, valores);
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setEditando(false);
    router.refresh();
  }

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Evaluación de vivienda"
        descripcion="Guardar sustituye la evaluación anterior: hay una sola vigente por solicitud."
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
              permitido={puede(sesion, "viviendaEscribir")}
              motivo="Su rol no permite registrar la evaluación de vivienda"
            >
              <Boton variante="contorno" tamano="pequeno" onClick={() => setEditando(true)}>
                {evaluacion ? "Actualizar" : "Registrar"}
              </Boton>
            </AccionProtegida>
          )
        }
      />
      <CuerpoTarjeta className="space-y-4">
        {editando ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo etiqueta="Tipo de vivienda">
                <Seleccion
                  value={valores.tipoViviendaId}
                  onChange={(evento) =>
                    setValores({ ...valores, tipoViviendaId: evento.target.value })
                  }
                >
                  <option value="">Sin especificar</option>
                  {catalogos.tiposVivienda.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </Seleccion>
              </Campo>
              <Campo etiqueta="Tenencia">
                <Seleccion
                  value={valores.tipoTenenciaId}
                  onChange={(evento) =>
                    setValores({ ...valores, tipoTenenciaId: evento.target.value })
                  }
                >
                  <option value="">Sin especificar</option>
                  {catalogos.tiposTenencia.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </Seleccion>
              </Campo>
              <Campo etiqueta="Condición">
                <Seleccion
                  value={valores.condicionViviendaId}
                  onChange={(evento) =>
                    setValores({ ...valores, condicionViviendaId: evento.target.value })
                  }
                >
                  <option value="">Sin especificar</option>
                  {catalogos.condicionesVivienda.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </Seleccion>
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
        ) : evaluacion ? (
          <>
            <RejillaDatos>
              <Dato etiqueta="Tipo de vivienda">
                {nombreDeCatalogo(catalogos.tiposVivienda, evaluacion.tipoViviendaId)}
              </Dato>
              <Dato etiqueta="Tenencia">
                {nombreDeCatalogo(catalogos.tiposTenencia, evaluacion.tipoTenenciaId)}
              </Dato>
              <Dato etiqueta="Condición">
                {nombreDeCatalogo(catalogos.condicionesVivienda, evaluacion.condicionViviendaId)}
              </Dato>
              <Dato etiqueta="Registrada">{formatearFechaHora(evaluacion.creadoEn)}</Dato>
            </RejillaDatos>
            <Dato etiqueta="Observaciones">
              <p className="whitespace-pre-line">{textoOGuion(evaluacion.observaciones)}</p>
            </Dato>
          </>
        ) : (
          <p className="text-sm text-[var(--color-tinta-suave)]">
            Este expediente no tiene evaluación de vivienda registrada.
          </p>
        )}
      </CuerpoTarjeta>
    </Tarjeta>
  );
}
