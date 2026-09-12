"use client";

import * as React from "react";
import { Campo, Seleccion } from "@/components/ui/campo";
import { nivelRequerido, type Alcance } from "@/lib/autorizacion/alcance";
import { CodigoRol } from "@/lib/dominio/enums";
import type { Diocesis, Parroquia, Vicaria } from "@/lib/dominio/tipos";

export function SelectorAlcance({
  rolCodigo,
  alcance,
  opciones,
  alCambiar,
}: {
  rolCodigo: CodigoRol;
  alcance: Alcance;
  opciones: { diocesis: Diocesis[]; vicarias: Vicaria[]; parroquias: Parroquia[] };
  alCambiar: (alcance: Alcance) => void;
}) {
  const nivel = nivelRequerido(rolCodigo);
  const vacio: Alcance = { diocesisId: null, vicariaId: null, parroquiaId: null };

  if (nivel === "parroquia") {
    return (
      <SelectorParroquia
        alcance={alcance}
        opciones={opciones}
        vacio={vacio}
        alCambiar={alCambiar}
      />
    );
  }

  if (nivel === "vicaria") {
    return (
      <Campo
        etiqueta="Vicaría"
        requerido
        ayuda="El rol vicarial no admite parroquia ni diócesis."
      >
        <Seleccion
          value={alcance.vicariaId ?? ""}
          onChange={(evento) => alCambiar({ ...vacio, vicariaId: evento.target.value || null })}
        >
          <option value="">Seleccione la vicaría</option>
          {opciones.vicarias.map((vicaria) => (
            <option key={vicaria.id} value={vicaria.id}>
              {vicaria.nombre}
            </option>
          ))}
        </Seleccion>
      </Campo>
    );
  }

  if (nivel === "diocesis") {
    return (
      <Campo
        etiqueta="Diócesis"
        requerido
        ayuda="El rol diocesano no admite vicaría ni parroquia."
      >
        <Seleccion
          value={alcance.diocesisId ?? ""}
          onChange={(evento) => alCambiar({ ...vacio, diocesisId: evento.target.value || null })}
        >
          <option value="">Seleccione la diócesis</option>
          {opciones.diocesis.map((diocesis) => (
            <option key={diocesis.id} value={diocesis.id}>
              {diocesis.nombre}
            </option>
          ))}
        </Seleccion>
      </Campo>
    );
  }

  return (
    <Campo
      etiqueta="Alcance del administrador"
      ayuda="El administrador ve todo. Si asigna un nivel, será a lo sumo uno."
    >
      <Seleccion
        value={alcance.diocesisId ?? ""}
        onChange={(evento) => alCambiar({ ...vacio, diocesisId: evento.target.value || null })}
      >
        <option value="">Sin alcance territorial</option>
        {opciones.diocesis.map((diocesis) => (
          <option key={diocesis.id} value={diocesis.id}>
            Diócesis {diocesis.nombre}
          </option>
        ))}
      </Seleccion>
    </Campo>
  );
}

function SelectorParroquia({
  alcance,
  opciones,
  vacio,
  alCambiar,
}: {
  alcance: Alcance;
  opciones: { diocesis: Diocesis[]; vicarias: Vicaria[]; parroquias: Parroquia[] };
  vacio: Alcance;
  alCambiar: (alcance: Alcance) => void;
}) {
  const vicariaDeParroquia = opciones.parroquias.find(
    (parroquia) => parroquia.id === alcance.parroquiaId,
  )?.vicariaId;
  const [filtroVicariaId, setFiltroVicariaId] = React.useState(
    vicariaDeParroquia ?? (opciones.vicarias.length === 1 ? opciones.vicarias[0].id : ""),
  );

  React.useEffect(() => {
    if (vicariaDeParroquia && vicariaDeParroquia !== filtroVicariaId) {
      setFiltroVicariaId(vicariaDeParroquia);
    }
  }, [vicariaDeParroquia, filtroVicariaId]);

  const parroquiasFiltradas = opciones.parroquias.filter(
    (parroquia) => !filtroVicariaId || parroquia.vicariaId === filtroVicariaId,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo etiqueta="Vicaría" ayuda="Solo sirve para filtrar la lista de parroquias.">
        <Seleccion
          value={filtroVicariaId}
          onChange={(evento) => {
            const vicariaId = evento.target.value;
            setFiltroVicariaId(vicariaId);
            const primeras = opciones.parroquias.filter(
              (parroquia) => parroquia.vicariaId === vicariaId,
            );
            alCambiar({
              ...vacio,
              parroquiaId: primeras.length === 1 ? primeras[0].id : null,
            });
          }}
        >
          <option value="">Seleccione la vicaría</option>
          {opciones.vicarias.map((vicaria) => (
            <option key={vicaria.id} value={vicaria.id}>
              {vicaria.nombre}
            </option>
          ))}
        </Seleccion>
      </Campo>
      <Campo etiqueta="Parroquia" requerido>
        <Seleccion
          value={alcance.parroquiaId ?? ""}
          onChange={(evento) =>
            alCambiar({ ...vacio, parroquiaId: evento.target.value || null })
          }
        >
          <option value="">Seleccione la parroquia</option>
          {parroquiasFiltradas.map((parroquia) => (
            <option key={parroquia.id} value={parroquia.id}>
              {parroquia.nombre}
            </option>
          ))}
        </Seleccion>
      </Campo>
    </div>
  );
}
