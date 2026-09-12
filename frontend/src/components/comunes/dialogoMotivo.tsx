"use client";

import * as React from "react";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo } from "@/components/ui/campo";
import { CierreDialogo, ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Aviso } from "@/components/ui/marco";
import type { Resultado } from "@/lib/acciones/resultado";

export function DialogoMotivo({
  titulo,
  descripcion,
  etiquetaMotivo = "Motivo",
  ayudaMotivo,
  textoConfirmar,
  varianteConfirmar = "primario",
  motivoObligatorio = true,
  disparador,
  alConfirmar,
}: {
  titulo: string;
  descripcion?: string;
  etiquetaMotivo?: string;
  ayudaMotivo?: string;
  textoConfirmar: string;
  varianteConfirmar?: "primario" | "peligro";
  motivoObligatorio?: boolean;
  disparador: React.ReactNode;
  alConfirmar: (motivo: string) => Promise<Resultado<unknown>>;
}) {
  const [abierto, setAbierto] = React.useState(false);
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [enviando, setEnviando] = React.useState(false);

  async function confirmar() {
    setError(null);
    setEnviando(true);
    const resultado = await alConfirmar(motivo.trim());
    setEnviando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setMotivo("");
    setAbierto(false);
  }

  const invalido = motivoObligatorio && motivo.trim().length < 3;

  return (
    <Dialogo
      open={abierto}
      onOpenChange={(valor) => {
        setAbierto(valor);
        if (!valor) {
          setError(null);
        }
      }}
    >
      <DisparadorDialogo asChild>{disparador}</DisparadorDialogo>
      <ContenidoDialogo titulo={titulo} descripcion={descripcion}>
        <div className="space-y-4">
          <Campo
            etiqueta={etiquetaMotivo}
            requerido={motivoObligatorio}
            ayuda={ayudaMotivo ?? "Queda registrado en el evento de auditoría."}
          >
            <AreaTexto
              value={motivo}
              onChange={(evento) => setMotivo(evento.target.value)}
              autoFocus
            />
          </Campo>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <CierreDialogo asChild>
              <Boton variante="contorno" disabled={enviando}>
                Cancelar
              </Boton>
            </CierreDialogo>
            <Boton variante={varianteConfirmar} onClick={confirmar} disabled={enviando || invalido}>
              {enviando ? "Guardando…" : textoConfirmar}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
