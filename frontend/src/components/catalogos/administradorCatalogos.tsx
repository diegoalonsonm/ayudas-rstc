"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DialogoMotivo } from "@/components/comunes/dialogoMotivo";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Insignia } from "@/components/ui/insignia";
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
  accionActualizarItemCatalogo,
  accionCrearItemCatalogo,
  accionEliminarItemCatalogo,
} from "@/lib/acciones/organizacion";
import { SLUGS_CATALOGO, type SlugCatalogo } from "@/lib/dominio/enums";
import { ETIQUETAS_CATALOGO } from "@/lib/dominio/etiquetas";
import type { ItemCatalogo } from "@/lib/dominio/tipos";
import { formatearMonto, siONo } from "@/lib/formato";

const CATALOGOS_SOLO_LECTURA: SlugCatalogo[] = ["roles"];

export function AdministradorCatalogos({
  catalogos,
}: {
  catalogos: Partial<Record<SlugCatalogo, ItemCatalogo[]>>;
}) {
  const [slug, setSlug] = React.useState<SlugCatalogo>("tipos-ayuda");
  const items = catalogos[slug] ?? [];
  const vigentes = items.filter((item) => !item.eliminadoEn);
  const soloLectura = CATALOGOS_SOLO_LECTURA.includes(slug);
  const router = useRouter();

  const esTipoAyuda = slug === "tipos-ayuda";
  const esDistrito = slug === "distritos";
  const esBarrio = slug === "barrios";

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Catálogos del sistema"
        descripcion="Los valores de referencia se comparten en toda la diócesis. Cambiarlos afecta todos los expedientes."
        acciones={
          soloLectura ? (
            <Insignia tono="advertencia">Solo lectura</Insignia>
          ) : (
            <FormularioItem
              slug={slug}
              titulo={`Agregar a ${ETIQUETAS_CATALOGO[slug].toLowerCase()}`}
              mostrarTipoAyuda={esTipoAyuda}
              padres={padresDe(slug, catalogos)}
              campoPadre={esDistrito ? "cantonId" : esBarrio ? "distritoId" : undefined}
              etiquetaPadre={esDistrito ? "Cantón" : esBarrio ? "Distrito" : undefined}
            />
          )
        }
      />

      <div className="flex flex-wrap items-end gap-3 border-b border-[var(--color-borde)] px-5 py-4">
        <Campo etiqueta="Catálogo" className="w-64">
          <Seleccion
            value={slug}
            onChange={(evento) => setSlug(evento.target.value as SlugCatalogo)}
          >
            {SLUGS_CATALOGO.map((valor) => (
              <option key={valor} value={valor}>
                {ETIQUETAS_CATALOGO[valor]}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <p className="text-xs text-[var(--color-tinta-suave)]">
          {vigentes.length} {vigentes.length === 1 ? "registro" : "registros"} vigentes
        </p>
      </div>

      {soloLectura ? (
        <div className="px-5 pt-4">
          <Aviso tono="advertencia">
            El catálogo de roles define la matriz de permisos del sistema. Se muestra para consulta
            y no se edita desde esta interfaz.
          </Aviso>
        </div>
      ) : null}

      {vigentes.length === 0 ? (
        <Vacio mensaje="Este catálogo no tiene registros." />
      ) : (
        <Tabla>
          <CabeceraTabla>
            <tr>
              <CeldaEncabezado>Código</CeldaEncabezado>
              <CeldaEncabezado>Nombre</CeldaEncabezado>
              <CeldaEncabezado alineacion="centro">Orden</CeldaEncabezado>
              {esTipoAyuda ? (
                <>
                  <CeldaEncabezado alineacion="centro">Requiere detalle</CeldaEncabezado>
                  <CeldaEncabezado alineacion="derecha">Monto mínimo</CeldaEncabezado>
                  <CeldaEncabezado alineacion="derecha">Monto máximo</CeldaEncabezado>
                </>
              ) : null}
              <CeldaEncabezado alineacion="derecha" />
            </tr>
          </CabeceraTabla>
          <CuerpoTabla>
            {vigentes.map((item) => (
              <FilaTabla key={item.id}>
                <Celda>
                  <code className="text-xs">{item.codigo}</code>
                </Celda>
                <Celda className="font-medium">{item.nombre}</Celda>
                <Celda alineacion="centro">{item.ordenPresentacion ?? "—"}</Celda>
                {esTipoAyuda ? (
                  <>
                    <Celda alineacion="centro">{siONo(item.requiereDetalle)}</Celda>
                    <Celda alineacion="derecha">{formatearMonto(item.montoMinimo)}</Celda>
                    <Celda alineacion="derecha">{formatearMonto(item.montoMaximo)}</Celda>
                  </>
                ) : null}
                <Celda alineacion="derecha">
                  {soloLectura ? null : (
                    <div className="flex justify-end gap-1.5">
                      <FormularioItem
                        slug={slug}
                        titulo={`Editar ${item.nombre}`}
                        item={item}
                        mostrarTipoAyuda={esTipoAyuda}
                        disparador={
                          <Boton variante="fantasma" tamano="pequeno">
                            <Pencil />
                            Editar
                          </Boton>
                        }
                      />
                      <DialogoMotivo
                        titulo={`Eliminar ${item.nombre}`}
                        descripcion="La eliminación es lógica; los expedientes que ya lo usan conservan la referencia."
                        textoConfirmar="Eliminar"
                        varianteConfirmar="peligro"
                        disparador={
                          <Boton variante="fantasma" tamano="pequeno">
                            <Trash2 />
                            Eliminar
                          </Boton>
                        }
                        alConfirmar={async (motivo) => {
                          const resultado = await accionEliminarItemCatalogo(slug, item.id, {
                            motivo,
                          });
                          if (resultado.exito) {
                            router.refresh();
                          }
                          return resultado;
                        }}
                      />
                    </div>
                  )}
                </Celda>
              </FilaTabla>
            ))}
          </CuerpoTabla>
        </Tabla>
      )}
    </Tarjeta>
  );
}

function FormularioItem({
  slug,
  titulo,
  item,
  mostrarTipoAyuda,
  padres,
  campoPadre,
  etiquetaPadre,
  disparador,
}: {
  slug: SlugCatalogo;
  titulo: string;
  item?: ItemCatalogo;
  mostrarTipoAyuda?: boolean;
  padres?: ItemCatalogo[];
  campoPadre?: "cantonId" | "distritoId";
  etiquetaPadre?: string;
  disparador?: React.ReactNode;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    codigo: item?.codigo ?? "",
    nombre: item?.nombre ?? "",
    ordenPresentacion: item?.ordenPresentacion?.toString() ?? "",
    requiereDetalle: item?.requiereDetalle ? "true" : "false",
    montoMinimo: item?.montoMinimo?.toString() ?? "",
    montoMaximo: item?.montoMaximo?.toString() ?? "",
    padreId: "",
  });

  async function guardar() {
    setError(null);
    setGuardando(true);
    const cuerpo: Record<string, unknown> = {
      codigo: valores.codigo,
      nombre: valores.nombre,
      ordenPresentacion: valores.ordenPresentacion,
    };
    if (mostrarTipoAyuda) {
      cuerpo.requiereDetalle = valores.requiereDetalle;
      cuerpo.montoMinimo = valores.montoMinimo;
      cuerpo.montoMaximo = valores.montoMaximo;
    }
    if (campoPadre && valores.padreId) {
      cuerpo[campoPadre] = valores.padreId;
    }
    const resultado = item
      ? await accionActualizarItemCatalogo(slug, item.id, cuerpo)
      : await accionCrearItemCatalogo(slug, cuerpo);
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
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
        descripcion="El código se usa en la lógica de negocio y conviene mantenerlo estable."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Código" requerido>
              <Entrada
                value={valores.codigo}
                onChange={(evento) => setValores({ ...valores, codigo: evento.target.value })}
                autoFocus
              />
            </Campo>
            <Campo etiqueta="Nombre" requerido>
              <Entrada
                value={valores.nombre}
                onChange={(evento) => setValores({ ...valores, nombre: evento.target.value })}
              />
            </Campo>
            <Campo etiqueta="Orden de presentación">
              <Entrada
                type="number"
                value={valores.ordenPresentacion}
                onChange={(evento) =>
                  setValores({ ...valores, ordenPresentacion: evento.target.value })
                }
              />
            </Campo>
            {campoPadre && padres ? (
              <Campo etiqueta={etiquetaPadre ?? "Superior"} requerido={!item}>
                <Seleccion
                  value={valores.padreId}
                  onChange={(evento) => setValores({ ...valores, padreId: evento.target.value })}
                >
                  <option value="">Seleccione</option>
                  {padres.map((padre) => (
                    <option key={padre.id} value={padre.id}>
                      {padre.nombre}
                    </option>
                  ))}
                </Seleccion>
              </Campo>
            ) : null}
          </div>

          {mostrarTipoAyuda ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo etiqueta="Requiere detalle">
                <Seleccion
                  value={valores.requiereDetalle}
                  onChange={(evento) =>
                    setValores({ ...valores, requiereDetalle: evento.target.value })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </Seleccion>
              </Campo>
              <Campo etiqueta="Monto mínimo">
                <Entrada
                  type="number"
                  value={valores.montoMinimo}
                  onChange={(evento) =>
                    setValores({ ...valores, montoMinimo: evento.target.value })
                  }
                />
              </Campo>
              <Campo etiqueta="Monto máximo">
                <Entrada
                  type="number"
                  value={valores.montoMaximo}
                  onChange={(evento) =>
                    setValores({ ...valores, montoMaximo: evento.target.value })
                  }
                />
              </Campo>
            </div>
          ) : null}

          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton
              onClick={guardar}
              disabled={guardando || !valores.codigo.trim() || !valores.nombre.trim()}
            >
              {guardando ? "Guardando…" : "Guardar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}

function padresDe(
  slug: SlugCatalogo,
  catalogos: Partial<Record<SlugCatalogo, ItemCatalogo[]>>,
): ItemCatalogo[] | undefined {
  if (slug === "distritos") {
    return catalogos.cantones;
  }
  if (slug === "barrios") {
    return catalogos.distritos;
  }
  return undefined;
}
