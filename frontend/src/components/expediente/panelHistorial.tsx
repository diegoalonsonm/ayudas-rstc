import { InsigniaEstado } from "@/components/ui/insignia";
import { CabeceraTarjeta, CuerpoTarjeta, Tarjeta, Vacio } from "@/components/ui/marco";
import type { EstadoSolicitud } from "@/lib/dominio/enums";
import { etiquetaEstado } from "@/lib/dominio/etiquetas";
import type { HistorialEstadoSolicitud } from "@/lib/dominio/tipos";
import { formatearFechaHora, textoOGuion } from "@/lib/formato";

export function PanelHistorial({ historial }: { historial: HistorialEstadoSolicitud[] }) {
  const ordenado = [...historial].sort((uno, otro) =>
    otro.ocurridoEn.localeCompare(uno.ocurridoEn),
  );

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Historial de estados"
        descripcion="Cada cambio de estado se guarda de forma inmutable con su motivo."
      />
      {ordenado.length === 0 ? (
        <Vacio mensaje="Todavía no hay cambios de estado registrados." />
      ) : (
        <CuerpoTarjeta>
          <ol className="space-y-4">
            {ordenado.map((evento) => (
              <li key={evento.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--color-primario)]" />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {evento.estadoAnterior ? (
                      <>
                        <span className="text-xs text-[var(--color-tinta-suave)]">
                          {etiquetaEstado(evento.estadoAnterior)}
                        </span>
                        <span className="text-xs text-[var(--color-tinta-suave)]">→</span>
                      </>
                    ) : (
                      <span className="text-xs text-[var(--color-tinta-suave)]">
                        Estado inicial
                      </span>
                    )}
                    <InsigniaEstado estado={evento.estadoNuevo as EstadoSolicitud} />
                    <span className="text-xs text-[var(--color-tinta-suave)]">
                      {formatearFechaHora(evento.ocurridoEn)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-tinta-suave)]">
                    Motivo: {textoOGuion(evento.motivo)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CuerpoTarjeta>
      )}
    </Tarjeta>
  );
}
