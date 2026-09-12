"use client";

import { Campo, AreaTexto, Seleccion } from "@/components/ui/campo";
import { Aviso } from "@/components/ui/marco";
import type { BorradorAsistente, CatalogosAsistente } from "./tipos";

export function PasoDireccion({
  borrador,
  catalogos,
  alCambiar,
}: {
  borrador: BorradorAsistente;
  catalogos: CatalogosAsistente;
  alCambiar: (cambio: Partial<BorradorAsistente>) => void;
}) {
  const { cantonId, distritoId, barrioId, senas } = borrador.direccion;
  const distritos = cantonId
    ? catalogos.distritos.filter((item) => item.cantonId === cantonId)
    : [];
  const barrios = distritoId
    ? catalogos.barrios.filter((item) => item.distritoId === distritoId)
    : [];

  function cambiarDireccion(cambio: Partial<BorradorAsistente["direccion"]>) {
    alCambiar({ direccion: { ...borrador.direccion, ...cambio } });
  }

  return (
    <div className="space-y-6">
      <Aviso tono="informacion">
        La dirección pertenece a la persona, no a la solicitud. Se guardará como dirección actual y
        cerrará la anterior si existía.
      </Aviso>

      <div className="grid gap-4 sm:grid-cols-3">
        <Campo etiqueta="Cantón">
          <Seleccion
            value={cantonId}
            onChange={(evento) =>
              cambiarDireccion({ cantonId: evento.target.value, distritoId: "", barrioId: "" })
            }
          >
            <option value="">Seleccione el cantón</option>
            {catalogos.cantones.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo
          etiqueta="Distrito"
          ayuda={cantonId && distritos.length === 0 ? "Este cantón no tiene distritos cargados." : undefined}
        >
          <Seleccion
            value={distritoId}
            onChange={(evento) =>
              cambiarDireccion({ distritoId: evento.target.value, barrioId: "" })
            }
            disabled={!cantonId}
          >
            <option value="">Seleccione el distrito</option>
            {distritos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo
          etiqueta="Barrio"
          ayuda={distritoId && barrios.length === 0 ? "Este distrito no tiene barrios cargados." : undefined}
        >
          <Seleccion
            value={barrioId}
            onChange={(evento) => cambiarDireccion({ barrioId: evento.target.value })}
            disabled={!distritoId}
          >
            <option value="">Seleccione el barrio</option>
            {barrios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
      </div>

      <Campo etiqueta="Señas" ayuda="Dato sensible; se guarda protegido y no se muestra en bitácoras.">
        <AreaTexto
          value={senas}
          onChange={(evento) => cambiarDireccion({ senas: evento.target.value })}
          placeholder="200 metros norte de la escuela, casa blanca de dos pisos"
        />
      </Campo>
    </div>
  );
}
