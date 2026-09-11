"use client";

import { AreaTexto, Campo, Casilla, Entrada, Seleccion } from "@/components/ui/campo";
import { Aviso } from "@/components/ui/marco";
import { cn } from "@/lib/utiles";
import type { AyudaBorrador, BorradorAsistente, CatalogosAsistente } from "./tipos";

export function PasoViviendaAyuda({
  borrador,
  catalogos,
  codigosBloqueados,
  alCambiar,
}: {
  borrador: BorradorAsistente;
  catalogos: CatalogosAsistente;
  codigosBloqueados: string[];
  alCambiar: (cambio: Partial<BorradorAsistente>) => void;
}) {
  function cambiarVivienda(cambio: Partial<BorradorAsistente["vivienda"]>) {
    alCambiar({ vivienda: { ...borrador.vivienda, ...cambio } });
  }

  function alternarAyuda(tipoAyudaId: string, marcado: boolean) {
    const restantes = borrador.ayudas.filter((ayuda) => ayuda.tipoAyudaId !== tipoAyudaId);
    alCambiar({
      ayudas: marcado ? [...restantes, { tipoAyudaId, detalle: "" }] : restantes,
    });
  }

  function cambiarDetalle(tipoAyudaId: string, detalle: string) {
    alCambiar({
      ayudas: borrador.ayudas.map((ayuda) =>
        ayuda.tipoAyudaId === tipoAyudaId ? { ...ayuda, detalle } : ayuda,
      ),
    });
  }

  const seleccionadas = new Map(borrador.ayudas.map((ayuda) => [ayuda.tipoAyudaId, ayuda]));

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Datos de la vivienda</h3>
          <p className="text-xs text-[var(--color-tinta-suave)]">
            Cada grupo admite una sola opción, igual que en la ficha impresa.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo etiqueta="Tipo">
            <Seleccion
              value={borrador.vivienda.tipoViviendaId}
              onChange={(evento) => cambiarVivienda({ tipoViviendaId: evento.target.value })}
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
              value={borrador.vivienda.tipoTenenciaId}
              onChange={(evento) => cambiarVivienda({ tipoTenenciaId: evento.target.value })}
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
              value={borrador.vivienda.condicionViviendaId}
              onChange={(evento) => cambiarVivienda({ condicionViviendaId: evento.target.value })}
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
        <Campo etiqueta="Observaciones de la vivienda">
          <AreaTexto
            value={borrador.vivienda.observaciones}
            onChange={(evento) => cambiarVivienda({ observaciones: evento.target.value })}
          />
        </Campo>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Ayuda que solicita</h3>
          <p className="text-xs text-[var(--color-tinta-suave)]">
            Debe marcar al menos una necesidad. Los tipos con detalle obligatorio lo piden al
            marcarse.
          </p>
        </div>

        {codigosBloqueados.length > 0 ? (
          <Aviso tono="advertencia" titulo="Tipos de ayuda bloqueados">
            La persona ya tiene un proceso vigente para{" "}
            {codigosBloqueados.join(", ")}. La base de datos rechazaría una segunda solicitud del
            mismo tipo, así que esas opciones quedan deshabilitadas.
          </Aviso>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          {catalogos.tiposAyuda.map((item) => {
            const bloqueado = codigosBloqueados.includes(item.codigo);
            const seleccion = seleccionadas.get(item.id);
            const marcado = Boolean(seleccion);
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border px-3 py-2.5",
                  marcado
                    ? "border-[var(--color-primario)] bg-[var(--color-primario-suave)]"
                    : "border-[var(--color-borde)] bg-[var(--color-superficie)]",
                  bloqueado && "opacity-60",
                )}
              >
                <label className="flex items-start gap-2.5">
                  <Casilla
                    className="mt-0.5"
                    checked={marcado}
                    disabled={bloqueado}
                    onChange={(evento) => alternarAyuda(item.id, evento.target.checked)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.nombre}</span>
                    {bloqueado ? (
                      <span className="block text-xs text-[var(--color-aviso)]">
                        Ya tiene un proceso vigente de este tipo
                      </span>
                    ) : item.requiereDetalle ? (
                      <span className="block text-xs text-[var(--color-tinta-suave)]">
                        Requiere detalle
                      </span>
                    ) : null}
                  </span>
                </label>
                {marcado ? (
                  <Entrada
                    className="mt-2"
                    value={seleccion?.detalle ?? ""}
                    onChange={(evento) => cambiarDetalle(item.id, evento.target.value)}
                    placeholder={item.requiereDetalle ? "Detalle obligatorio" : "Detalle opcional"}
                    aria-label={`Detalle de ${item.nombre}`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function ayudasIncompletas(
  ayudas: AyudaBorrador[],
  tiposAyuda: CatalogosAsistente["tiposAyuda"],
): string[] {
  const porId = new Map(tiposAyuda.map((item) => [item.id, item]));
  return ayudas
    .filter((ayuda) => porId.get(ayuda.tipoAyudaId)?.requiereDetalle && !ayuda.detalle.trim())
    .map((ayuda) => porId.get(ayuda.tipoAyudaId)?.nombre ?? ayuda.tipoAyudaId);
}
