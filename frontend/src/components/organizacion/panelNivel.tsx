"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DialogoMotivo } from "@/components/comunes/dialogoMotivo";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Aviso, CabeceraTarjeta, Tarjeta, Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import {
  accionActualizarOrganizacion,
  accionCrearOrganizacion,
  accionEliminarOrganizacion,
  type NivelOrganizacion,
} from "@/lib/acciones/organizacion";
import { formatearFecha } from "@/lib/formato";

export type EntidadTerritorial = {
  id: string;
  nombre: string;
  codigo: string;
  creadoEn: string;
  eliminadoEn: string | null;
  padreId?: string | null;
};

export function PanelNivel({
  nivel,
  titulo,
  descripcion,
  etiquetaPadre,
  campoPadre,
  entidades,
  padres,
  conScroll = false,
}: {
  nivel: NivelOrganizacion;
  titulo: string;
  descripcion: string;
  etiquetaPadre?: string;
  campoPadre?: "diocesisId" | "vicariaId";
  entidades: EntidadTerritorial[];
  padres?: Array<{ id: string; nombre: string }>;
  conScroll?: boolean;
}) {
  const router = useRouter();
  const vigentes = entidades.filter((entidad) => !entidad.eliminadoEn);
  const nombresPadre = new Map((padres ?? []).map((padre) => [padre.id, padre.nombre]));

  return (
    <Tarjeta className={conScroll ? "overflow-hidden" : undefined}>
      <CabeceraTarjeta
        titulo={titulo}
        descripcion={descripcion}
        acciones={
          <FormularioNivel
            nivel={nivel}
            titulo={`Agregar ${titulo.toLowerCase()}`}
            etiquetaPadre={etiquetaPadre}
            campoPadre={campoPadre}
            padres={padres}
          />
        }
      />
      {vigentes.length === 0 ? (
        <Vacio mensaje={`No hay registros de ${titulo.toLowerCase()}.`} />
      ) : (
        <Tabla
          classNameContenedor={
            conScroll
              ? "max-h-[min(22rem,55vh)] overflow-auto overscroll-contain"
              : undefined
          }
          tabIndex={conScroll ? 0 : undefined}
          role={conScroll ? "region" : undefined}
          aria-label={conScroll ? `Listado de ${titulo.toLowerCase()}` : undefined}
        >
          <CabeceraTabla
            className={
              conScroll
                ? "[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-[var(--color-lienzo)]"
                : undefined
            }
          >
            <tr>
              <CeldaEncabezado>Código</CeldaEncabezado>
              <CeldaEncabezado>Nombre</CeldaEncabezado>
              {etiquetaPadre ? <CeldaEncabezado>{etiquetaPadre}</CeldaEncabezado> : null}
              <CeldaEncabezado>Creada</CeldaEncabezado>
              <CeldaEncabezado alineacion="derecha" />
            </tr>
          </CabeceraTabla>
          <CuerpoTabla>
            {vigentes.map((entidad) => (
              <FilaTabla key={entidad.id}>
                <Celda>
                  <code className="text-xs">{entidad.codigo}</code>
                </Celda>
                <Celda className="font-medium">{entidad.nombre}</Celda>
                {etiquetaPadre ? (
                  <Celda>{nombresPadre.get(entidad.padreId ?? "") ?? "—"}</Celda>
                ) : null}
                <Celda>{formatearFecha(entidad.creadoEn)}</Celda>
                <Celda alineacion="derecha">
                  <div className="flex justify-end gap-1.5">
                    <FormularioNivel
                      nivel={nivel}
                      titulo={`Editar ${entidad.nombre}`}
                      entidadId={entidad.id}
                      nombreInicial={entidad.nombre}
                      disparador={
                        <Boton variante="fantasma" tamano="pequeno">
                          <Pencil />
                          Editar
                        </Boton>
                      }
                    />
                    <DialogoMotivo
                      titulo={`Eliminar ${entidad.nombre}`}
                      descripcion="La eliminación es lógica: el registro se conserva marcado como eliminado."
                      textoConfirmar="Eliminar"
                      varianteConfirmar="peligro"
                      disparador={
                        <Boton variante="fantasma" tamano="pequeno">
                          <Trash2 />
                          Eliminar
                        </Boton>
                      }
                      alConfirmar={async (motivo) => {
                        const resultado = await accionEliminarOrganizacion(nivel, entidad.id, {
                          motivo,
                        });
                        if (resultado.exito) {
                          router.refresh();
                        }
                        return resultado;
                      }}
                    />
                  </div>
                </Celda>
              </FilaTabla>
            ))}
          </CuerpoTabla>
        </Tabla>
      )}
    </Tarjeta>
  );
}

function FormularioNivel({
  nivel,
  titulo,
  etiquetaPadre,
  campoPadre,
  padres,
  entidadId,
  nombreInicial,
  disparador,
}: {
  nivel: NivelOrganizacion;
  titulo: string;
  etiquetaPadre?: string;
  campoPadre?: "diocesisId" | "vicariaId";
  padres?: Array<{ id: string; nombre: string }>;
  entidadId?: string;
  nombreInicial?: string;
  disparador?: React.ReactNode;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [nombre, setNombre] = React.useState(nombreInicial ?? "");
  const [padreId, setPadreId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);

  async function guardar() {
    setError(null);
    setGuardando(true);
    const cuerpo: Record<string, unknown> = { nombre };
    if (campoPadre && padreId) {
      cuerpo[campoPadre] = padreId;
    }
    const resultado = entidadId
      ? await accionActualizarOrganizacion(nivel, entidadId, { nombre })
      : await accionCrearOrganizacion(nivel, cuerpo);
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    if (!entidadId) {
      setNombre("");
      setPadreId("");
    }
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        {disparador ?? (
          <Boton variante="contorno" tamano="pequeno">
            <Plus />
            Agregar
          </Boton>
        )}
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo={titulo}
        descripcion="El código territorial lo genera el backend automáticamente."
      >
        <div className="space-y-4">
          <Campo etiqueta="Nombre" requerido>
            <Entrada
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              autoFocus
            />
          </Campo>
          {!entidadId && etiquetaPadre && padres ? (
            <Campo etiqueta={etiquetaPadre} requerido>
              <Seleccion value={padreId} onChange={(evento) => setPadreId(evento.target.value)}>
                <option value="">Seleccione</option>
                {padres.map((padre) => (
                  <option key={padre.id} value={padre.id}>
                    {padre.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
          ) : null}
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton
              onClick={guardar}
              disabled={
                guardando || !nombre.trim() || (!entidadId && Boolean(campoPadre) && !padreId)
              }
            >
              {guardando ? "Guardando…" : "Guardar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
