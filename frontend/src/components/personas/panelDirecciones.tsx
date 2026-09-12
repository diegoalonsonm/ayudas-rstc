"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Casilla, Entrada, Seleccion } from "@/components/ui/campo";
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
import { nombreDeCatalogo } from "@/lib/dominio/catalogos";
import { accionCrearDireccion } from "@/lib/acciones/personas";
import { puede } from "@/lib/autorizacion/permisos";
import type { Direccion, ItemCatalogo } from "@/lib/dominio/tipos";
import { fechaDeHoy, formatearFecha, textoOGuion } from "@/lib/formato";
import { useSesion } from "@/lib/sesion/contextoSesion";

type CatalogosDireccion = {
  cantones: ItemCatalogo[];
  distritos: ItemCatalogo[];
  barrios: ItemCatalogo[];
};

export function PanelDirecciones({
  personaId,
  direcciones,
  catalogos,
}: {
  personaId: string;
  direcciones: Direccion[];
  catalogos: CatalogosDireccion;
}) {
  const sesion = useSesion();
  const vigentes = [...direcciones]
    .filter((direccion) => !direccion.eliminadoEn)
    .sort((uno, otro) => otro.vigenteDesde.localeCompare(uno.vigenteDesde));

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Direcciones"
        descripcion="Registrar una dirección como actual cierra automáticamente la anterior."
        acciones={
          <AccionProtegida
            permitido={puede(sesion, "direccionesEscribir")}
            motivo="Su rol no permite registrar direcciones"
          >
            <FormularioDireccion personaId={personaId} catalogos={catalogos} />
          </AccionProtegida>
        }
      />
      {vigentes.length === 0 ? (
        <Vacio mensaje="Esta persona no tiene direcciones registradas." />
      ) : (
        <Tabla>
          <CabeceraTabla>
            <tr>
              <CeldaEncabezado>Cantón</CeldaEncabezado>
              <CeldaEncabezado>Distrito</CeldaEncabezado>
              <CeldaEncabezado>Barrio</CeldaEncabezado>
              <CeldaEncabezado>Señas</CeldaEncabezado>
              <CeldaEncabezado>Vigencia</CeldaEncabezado>
              <CeldaEncabezado alineacion="centro">Actual</CeldaEncabezado>
            </tr>
          </CabeceraTabla>
          <CuerpoTabla>
            {vigentes.map((direccion) => (
              <FilaTabla key={direccion.id}>
                <Celda>{nombreDeCatalogo(catalogos.cantones, direccion.cantonId)}</Celda>
                <Celda>{nombreDeCatalogo(catalogos.distritos, direccion.distritoId)}</Celda>
                <Celda>{nombreDeCatalogo(catalogos.barrios, direccion.barrioId)}</Celda>
                <Celda className="max-w-72 truncate">{textoOGuion(direccion.senas)}</Celda>
                <Celda>
                  {formatearFecha(direccion.vigenteDesde)}
                  {direccion.vigenteHasta ? ` — ${formatearFecha(direccion.vigenteHasta)}` : ""}
                </Celda>
                <Celda alineacion="centro">
                  {direccion.esActual ? <Insignia tono="exito">Actual</Insignia> : null}
                </Celda>
              </FilaTabla>
            ))}
          </CuerpoTabla>
        </Tabla>
      )}
    </Tarjeta>
  );
}

function FormularioDireccion({
  personaId,
  catalogos,
}: {
  personaId: string;
  catalogos: CatalogosDireccion;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    cantonId: "",
    distritoId: "",
    barrioId: "",
    senas: "",
    esActual: true,
    vigenteDesde: fechaDeHoy(),
  });

  const distritos = valores.cantonId
    ? catalogos.distritos.filter((item) => item.cantonId === valores.cantonId)
    : [];
  const barrios = valores.distritoId
    ? catalogos.barrios.filter((item) => item.distritoId === valores.distritoId)
    : [];

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionCrearDireccion(personaId, {
      cantonId: valores.cantonId,
      distritoId: valores.distritoId,
      barrioId: valores.barrioId,
      senas: valores.senas,
      esActual: valores.esActual,
      vigenteDesde: valores.vigenteDesde,
      vigenteHasta: null,
    });
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setValores({
      cantonId: "",
      distritoId: "",
      barrioId: "",
      senas: "",
      esActual: true,
      vigenteDesde: fechaDeHoy(),
    });
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton variante="contorno" tamano="pequeno">
          <Plus />
          Agregar dirección
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Agregar dirección"
        descripcion="Las señas son un dato sensible y no se muestran en las bitácoras de auditoría."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Campo etiqueta="Cantón">
              <Seleccion
                value={valores.cantonId}
                onChange={(evento) =>
                  setValores({
                    ...valores,
                    cantonId: evento.target.value,
                    distritoId: "",
                    barrioId: "",
                  })
                }
              >
                <option value="">Seleccione</option>
                {catalogos.cantones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Distrito">
              <Seleccion
                value={valores.distritoId}
                onChange={(evento) =>
                  setValores({ ...valores, distritoId: evento.target.value, barrioId: "" })
                }
                disabled={!valores.cantonId}
              >
                <option value="">Seleccione</option>
                {distritos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Barrio">
              <Seleccion
                value={valores.barrioId}
                onChange={(evento) => setValores({ ...valores, barrioId: evento.target.value })}
                disabled={!valores.distritoId}
              >
                <option value="">Seleccione</option>
                {barrios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
          </div>
          <Campo etiqueta="Señas">
            <AreaTexto
              value={valores.senas}
              onChange={(evento) => setValores({ ...valores, senas: evento.target.value })}
            />
          </Campo>
          <Campo etiqueta="Vigente desde" requerido>
            <Entrada
              type="date"
              value={valores.vigenteDesde}
              onChange={(evento) => setValores({ ...valores, vigenteDesde: evento.target.value })}
            />
          </Campo>
          <label className="flex items-center gap-2 text-sm">
            <Casilla
              checked={valores.esActual}
              onChange={(evento) => setValores({ ...valores, esActual: evento.target.checked })}
            />
            Marcar como dirección actual
          </label>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton onClick={guardar} disabled={guardando || !valores.vigenteDesde}>
              {guardando ? "Guardando…" : "Agregar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
