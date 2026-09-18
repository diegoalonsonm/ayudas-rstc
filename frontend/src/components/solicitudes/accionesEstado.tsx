"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { DialogoMotivo } from "@/components/comunes/dialogoMotivo";
import { Boton } from "@/components/ui/boton";
import { Aviso } from "@/components/ui/marco";
import {
  accionCambiarEstado,
  accionEliminarSolicitud,
  accionRestaurarSolicitud,
} from "@/lib/acciones/solicitudes";
import { EstadoSolicitud } from "@/lib/dominio/enums";
import { transicionesPermitidas } from "@/lib/dominio/estadosSolicitud";
import { ETIQUETAS_TRANSICION, etiquetaEstado } from "@/lib/dominio/etiquetas";
import {
  motivoTransicionBloqueada,
  puede,
  puedeTransitar,
} from "@/lib/autorizacion/permisos";
import { useSesion } from "@/lib/sesion/contextoSesion";

const TRANSICIONES_CON_MOTIVO: EstadoSolicitud[] = [
  EstadoSolicitud.RECHAZADA,
  EstadoSolicitud.CANCELADA,
  EstadoSolicitud.BORRADOR,
];

export function AccionesEstado({
  solicitudId,
  estado,
  eliminada,
}: {
  solicitudId: string;
  estado: EstadoSolicitud;
  eliminada: boolean;
}) {
  const sesion = useSesion();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [enviando, setEnviando] = React.useState<EstadoSolicitud | null>(null);

  const posibles = transicionesPermitidas(estado);

  async function transitar(estadoNuevo: EstadoSolicitud, motivo: string | null) {
    setError(null);
    setEnviando(estadoNuevo);
    const resultado = await accionCambiarEstado(solicitudId, estado, { estadoNuevo, motivo });
    setEnviando(null);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return resultado;
    }
    router.refresh();
    return resultado;
  }

  if (eliminada) {
    return (
      <div className="space-y-3">
        <Aviso tono="peligro" titulo="Solicitud eliminada">
          La solicitud está eliminada lógicamente. Los datos se conservan y solo se pueden volver a
          usar después de restaurarla.
        </Aviso>
        <AccionProtegida
          permitido={puede(sesion, "solicitudesRestaurar")}
          motivo="Solo un coordinador diocesano o el administrador puede restaurar una solicitud eliminada"
        >
          <DialogoMotivo
            titulo="Restaurar la solicitud"
            descripcion="Indique por qué se revierte la eliminación."
            textoConfirmar="Restaurar"
            disparador={
              <Boton variante="contorno">
                <RotateCcw />
                Restaurar
              </Boton>
            }
            alConfirmar={async (motivo) => {
              const resultado = await accionRestaurarSolicitud(solicitudId, { motivo });
              if (resultado.exito) {
                router.refresh();
              }
              return resultado;
            }}
          />
        </AccionProtegida>
        {error ? <Aviso tono="peligro">{error}</Aviso> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posibles.length === 0 ? (
        <p className="text-sm text-[var(--color-tinta-suave)]">
          {etiquetaEstado(estado)} es un estado final: no admite más transiciones.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {posibles.map((estadoNuevo) => {
            const permitido = puedeTransitar(sesion, estado, estadoNuevo);
            const pideMotivo = TRANSICIONES_CON_MOTIVO.includes(estadoNuevo);
            const etiqueta = ETIQUETAS_TRANSICION[estadoNuevo];
            const variante = estadoNuevo === EstadoSolicitud.RECHAZADA ? "peligro" : "primario";

            if (pideMotivo) {
              return (
                <AccionProtegida
                  key={estadoNuevo}
                  permitido={permitido}
                  motivo={motivoTransicionBloqueada(estadoNuevo)}
                >
                  <DialogoMotivo
                    titulo={etiqueta}
                    descripcion={`La solicitud pasará de ${etiquetaEstado(estado)} a ${etiquetaEstado(estadoNuevo)}.`}
                    textoConfirmar={etiqueta}
                    varianteConfirmar={variante === "peligro" ? "peligro" : "primario"}
                    disparador={
                      <Boton variante={variante === "peligro" ? "peligro" : "contorno"}>
                        {etiqueta}
                      </Boton>
                    }
                    alConfirmar={(motivo) => transitar(estadoNuevo, motivo)}
                  />
                </AccionProtegida>
              );
            }

            return (
              <AccionProtegida
                key={estadoNuevo}
                permitido={permitido}
                motivo={motivoTransicionBloqueada(estadoNuevo)}
              >
                <Boton
                  variante={estadoNuevo === EstadoSolicitud.PRESENTADA ? "primario" : "contorno"}
                  onClick={() => transitar(estadoNuevo, null)}
                  disabled={enviando === estadoNuevo}
                >
                  {enviando === estadoNuevo ? "Aplicando…" : etiqueta}
                </Boton>
              </AccionProtegida>
            );
          })}
        </div>
      )}

      <AccionProtegida
        permitido={puede(sesion, "solicitudesEliminar")}
        motivo="Solo un coordinador parroquial o superior puede eliminar una solicitud"
      >
        <DialogoMotivo
          titulo="Eliminar la solicitud"
          descripcion="La eliminación es lógica: los datos se conservan y la solicitud deja de contar como vigente."
          textoConfirmar="Eliminar"
          varianteConfirmar="peligro"
          disparador={
            <Boton variante="fantasma" tamano="pequeno">
              <Trash2 />
              Eliminar solicitud
            </Boton>
          }
          alConfirmar={async (motivo) => {
            const resultado = await accionEliminarSolicitud(solicitudId, { motivo });
            if (resultado.exito) {
              router.refresh();
            }
            return resultado;
          }}
        />
      </AccionProtegida>

      {error ? <Aviso tono="peligro">{error}</Aviso> : null}
    </div>
  );
}
