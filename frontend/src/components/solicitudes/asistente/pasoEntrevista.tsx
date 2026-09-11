"use client";

import * as React from "react";
import { Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { Aviso } from "@/components/ui/marco";
import { parroquiasAccesibles, vicariasAccesibles } from "@/lib/autorizacion/alcance";
import { useSesion } from "@/lib/sesion/contextoSesion";
import type { BorradorAsistente, OrganizacionAsistente } from "./tipos";

export function PasoEntrevista({
  borrador,
  organizacion,
  alCambiar,
}: {
  borrador: BorradorAsistente;
  organizacion: OrganizacionAsistente;
  alCambiar: (cambio: Partial<BorradorAsistente>) => void;
}) {
  const sesion = useSesion();

  const vicarias = React.useMemo(
    () => vicariasAccesibles(sesion, organizacion.vicarias, organizacion.parroquias),
    [sesion, organizacion],
  );
  const parroquias = React.useMemo(
    () => parroquiasAccesibles(sesion, organizacion.parroquias, organizacion.vicarias),
    [sesion, organizacion],
  );
  const parroquiasDeVicaria = borrador.vicariaId
    ? parroquias.filter((parroquia) => parroquia.vicariaId === borrador.vicariaId)
    : parroquias;

  React.useEffect(() => {
    if (borrador.vicariaId || parroquias.length === 0) {
      return;
    }
    if (vicarias.length === 1) {
      alCambiar({ vicariaId: vicarias[0].id });
    }
  }, [borrador.vicariaId, vicarias, parroquias.length, alCambiar]);

  React.useEffect(() => {
    if (borrador.parroquiaReceptoraId || parroquiasDeVicaria.length !== 1) {
      return;
    }
    alCambiar({ parroquiaReceptoraId: parroquiasDeVicaria[0].id });
  }, [borrador.parroquiaReceptoraId, parroquiasDeVicaria, alCambiar]);

  if (parroquias.length === 0) {
    return (
      <Aviso tono="peligro" titulo="Sin parroquias en su alcance">
        Su asignación vigente no incluye ninguna parroquia activa, así que no puede registrar
        solicitudes. Solicite a un administrador que revise su alcance territorial.
      </Aviso>
    );
  }

  return (
    <div className="space-y-6">
      <Aviso tono="informacion">
        Los selectores solo muestran la vicaría y las parroquias que su alcance permite. La vicaría
        no se guarda en la solicitud: se deduce de la parroquia receptora.
      </Aviso>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Vicaría" requerido>
          <Seleccion
            value={borrador.vicariaId}
            onChange={(evento) =>
              alCambiar({ vicariaId: evento.target.value, parroquiaReceptoraId: "" })
            }
          >
            <option value="">Seleccione la vicaría</option>
            {vicarias.map((vicaria) => (
              <option key={vicaria.id} value={vicaria.id}>
                {vicaria.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo
          etiqueta="Parroquia de"
          requerido
          ayuda="Parroquia que recibe y administra la solicitud."
        >
          <Seleccion
            value={borrador.parroquiaReceptoraId}
            onChange={(evento) => alCambiar({ parroquiaReceptoraId: evento.target.value })}
            disabled={!borrador.vicariaId && vicarias.length > 1}
          >
            <option value="">Seleccione la parroquia</option>
            {parroquiasDeVicaria.map((parroquia) => (
              <option key={parroquia.id} value={parroquia.id}>
                {parroquia.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo etiqueta="Sector oficial" ayuda="Texto abierto; no se valida contra un catálogo.">
          <Entrada
            value={borrador.sectorOficial}
            onChange={(evento) => alCambiar({ sectorOficial: evento.target.value })}
          />
        </Campo>
        <Campo etiqueta="Fecha de entrevista">
          <Entrada
            type="date"
            value={borrador.fechaEntrevista}
            onChange={(evento) => alCambiar({ fechaEntrevista: evento.target.value })}
          />
        </Campo>
        <Campo etiqueta="Fecha de visita">
          <Entrada
            type="date"
            value={borrador.fechaVisita}
            onChange={(evento) => alCambiar({ fechaVisita: evento.target.value })}
          />
        </Campo>
      </div>

      <Campo etiqueta="Observaciones">
        <textarea
          className="min-h-24 w-full rounded-lg border border-[var(--color-borde)] bg-[var(--color-superficie)] px-3 py-2 text-sm"
          value={borrador.observaciones}
          onChange={(evento) => alCambiar({ observaciones: evento.target.value })}
        />
      </Campo>
    </div>
  );
}
