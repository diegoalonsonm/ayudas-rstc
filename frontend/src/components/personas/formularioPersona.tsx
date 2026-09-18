"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Aviso } from "@/components/ui/marco";
import { accionActualizarPersona, accionCrearPersona } from "@/lib/acciones/personas";
import type { ItemCatalogo, Persona } from "@/lib/dominio/tipos";

const VACIO = {
  tipoDocumentoId: "",
  numeroDocumento: "",
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  telefono: "",
};

export function FormularioPersona({
  tiposDocumento,
  persona,
  disparador,
}: {
  tiposDocumento: ItemCatalogo[];
  persona?: Persona;
  disparador?: React.ReactNode;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState(() =>
    persona
      ? {
          ...VACIO,
          tipoDocumentoId: persona.tipoDocumentoId ?? "",
          primerNombre: persona.primerNombre,
          segundoNombre: persona.segundoNombre ?? "",
          primerApellido: persona.primerApellido,
          segundoApellido: persona.segundoApellido ?? "",
        }
      : VACIO,
  );

  const editando = Boolean(persona);

  async function guardar() {
    setError(null);
    setGuardando(true);
    const cuerpo = {
      tipoDocumentoId: valores.tipoDocumentoId || null,
      primerNombre: valores.primerNombre,
      segundoNombre: valores.segundoNombre || null,
      primerApellido: valores.primerApellido,
      segundoApellido: valores.segundoApellido || null,
      ...(valores.numeroDocumento ? { numeroDocumento: valores.numeroDocumento } : {}),
      ...(valores.telefono ? { telefono: valores.telefono } : {}),
    };
    const resultado = persona
      ? await accionActualizarPersona(persona.id, cuerpo)
      : await accionCrearPersona(cuerpo);
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setAbierto(false);
    if (!persona) {
      setValores(VACIO);
      router.push(`/personas/${resultado.datos.id}`);
      return;
    }
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        {disparador ?? (
          <Boton>
            <Plus />
            Registrar persona
          </Boton>
        )}
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo={editando ? "Editar persona" : "Registrar persona"}
        descripcion="El número de documento y el teléfono se cifran en el servidor; una vez guardados no vuelven a mostrarse."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Tipo de documento">
              <Seleccion
                value={valores.tipoDocumentoId}
                onChange={(evento) =>
                  setValores({ ...valores, tipoDocumentoId: evento.target.value })
                }
              >
                <option value="">Sin especificar</option>
                {tiposDocumento.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo
              etiqueta="Número de documento"
              ayuda={editando ? "Déjelo vacío para conservar el documento actual." : undefined}
            >
              <Entrada
                value={valores.numeroDocumento}
                onChange={(evento) =>
                  setValores({ ...valores, numeroDocumento: evento.target.value })
                }
              />
            </Campo>
            <Campo etiqueta="Primer nombre" requerido>
              <Entrada
                value={valores.primerNombre}
                onChange={(evento) =>
                  setValores({ ...valores, primerNombre: evento.target.value })
                }
                autoFocus
              />
            </Campo>
            <Campo etiqueta="Segundo nombre">
              <Entrada
                value={valores.segundoNombre}
                onChange={(evento) =>
                  setValores({ ...valores, segundoNombre: evento.target.value })
                }
              />
            </Campo>
            <Campo etiqueta="Primer apellido" requerido>
              <Entrada
                value={valores.primerApellido}
                onChange={(evento) =>
                  setValores({ ...valores, primerApellido: evento.target.value })
                }
              />
            </Campo>
            <Campo etiqueta="Segundo apellido">
              <Entrada
                value={valores.segundoApellido}
                onChange={(evento) =>
                  setValores({ ...valores, segundoApellido: evento.target.value })
                }
              />
            </Campo>
            <Campo
              etiqueta="Teléfono"
              className="sm:col-span-2"
              ayuda={editando ? "Déjelo vacío para conservar el teléfono actual." : undefined}
            >
              <Entrada
                value={valores.telefono}
                onChange={(evento) => setValores({ ...valores, telefono: evento.target.value })}
              />
            </Campo>
          </div>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton
              onClick={guardar}
              disabled={
                guardando || !valores.primerNombre.trim() || !valores.primerApellido.trim()
              }
            >
              {guardando ? "Guardando…" : editando ? "Guardar" : "Registrar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
