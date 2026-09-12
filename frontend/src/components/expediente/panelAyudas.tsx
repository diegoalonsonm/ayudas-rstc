"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
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
import { accionAgregarAyuda, accionEliminarAyuda } from "@/lib/acciones/solicitudes";
import { puede } from "@/lib/autorizacion/permisos";
import type { AyudaSolicitada, ItemCatalogo } from "@/lib/dominio/tipos";
import { formatearFecha, textoOGuion } from "@/lib/formato";
import { useSesion } from "@/lib/sesion/contextoSesion";

export function PanelAyudas({
  solicitudId,
  ayudas,
  tiposAyuda,
}: {
  solicitudId: string;
  ayudas: AyudaSolicitada[];
  tiposAyuda: ItemCatalogo[];
}) {
  const sesion = useSesion();
  const router = useRouter();
  const vigentes = ayudas.filter((ayuda) => !ayuda.eliminadoEn);
  const yaSolicitados = new Set(vigentes.map((ayuda) => ayuda.tipoAyudaId));
  const disponibles = tiposAyuda.filter((tipo) => !yaSolicitados.has(tipo.id));

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Ayuda solicitada"
        descripcion="No puede repetirse un tipo de ayuda dentro del mismo expediente."
        acciones={
          <AccionProtegida
            permitido={puede(sesion, "ayudasAgregar") && disponibles.length > 0}
            motivo={
              disponibles.length === 0
                ? "Ya se registraron todos los tipos de ayuda del catálogo"
                : "Su rol no permite agregar tipos de ayuda"
            }
          >
            <FormularioAyuda solicitudId={solicitudId} disponibles={disponibles} />
          </AccionProtegida>
        }
      />
      {vigentes.length === 0 ? (
        <Vacio mensaje="Este expediente no tiene tipos de ayuda registrados." />
      ) : (
        <Tabla>
          <CabeceraTabla>
            <tr>
              <CeldaEncabezado>Tipo de ayuda</CeldaEncabezado>
              <CeldaEncabezado>Detalle</CeldaEncabezado>
              <CeldaEncabezado>Registrado</CeldaEncabezado>
              <CeldaEncabezado alineacion="derecha" />
            </tr>
          </CabeceraTabla>
          <CuerpoTabla>
            {vigentes.map((ayuda) => {
              const tipo = tiposAyuda.find((item) => item.id === ayuda.tipoAyudaId);
              return (
                <FilaTabla key={ayuda.id}>
                  <Celda className="font-medium">{tipo?.nombre ?? ayuda.tipoAyudaId}</Celda>
                  <Celda>{textoOGuion(ayuda.detalle)}</Celda>
                  <Celda>{formatearFecha(ayuda.creadoEn)}</Celda>
                  <Celda alineacion="derecha">
                    <AccionProtegida
                      permitido={puede(sesion, "ayudasEliminar")}
                      motivo="Solo un coordinador parroquial o superior puede quitar un tipo de ayuda"
                    >
                      <DialogoMotivo
                        titulo={`Quitar ${tipo?.nombre ?? "el tipo de ayuda"}`}
                        descripcion="La eliminación es lógica y queda registrada con su motivo."
                        textoConfirmar="Quitar"
                        varianteConfirmar="peligro"
                        disparador={
                          <Boton variante="fantasma" tamano="pequeno">
                            <X />
                            Quitar
                          </Boton>
                        }
                        alConfirmar={async (motivo) => {
                          const resultado = await accionEliminarAyuda(solicitudId, ayuda.id, {
                            motivo,
                          });
                          if (resultado.exito) {
                            router.refresh();
                          }
                          return resultado;
                        }}
                      />
                    </AccionProtegida>
                  </Celda>
                </FilaTabla>
              );
            })}
          </CuerpoTabla>
        </Tabla>
      )}
    </Tarjeta>
  );
}

function FormularioAyuda({
  solicitudId,
  disponibles,
}: {
  solicitudId: string;
  disponibles: ItemCatalogo[];
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [tipoAyudaId, setTipoAyudaId] = React.useState("");
  const [detalle, setDetalle] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);

  const tipo = disponibles.find((item) => item.id === tipoAyudaId);
  const faltaDetalle = Boolean(tipo?.requiereDetalle) && !detalle.trim();

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionAgregarAyuda(solicitudId, { tipoAyudaId, detalle });
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setTipoAyudaId("");
    setDetalle("");
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton variante="contorno" tamano="pequeno">
          <Plus />
          Agregar tipo de ayuda
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Agregar tipo de ayuda"
        descripcion="Si la persona tiene otro proceso vigente con el mismo tipo, el backend rechazará el registro."
      >
        <div className="space-y-4">
          <Campo etiqueta="Tipo de ayuda" requerido>
            <Seleccion
              value={tipoAyudaId}
              onChange={(evento) => setTipoAyudaId(evento.target.value)}
              autoFocus
            >
              <option value="">Seleccione el tipo</option>
              {disponibles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </Seleccion>
          </Campo>
          <Campo
            etiqueta="Detalle"
            requerido={Boolean(tipo?.requiereDetalle)}
            ayuda={tipo?.requiereDetalle ? "Este tipo de ayuda requiere detalle." : undefined}
          >
            <Entrada value={detalle} onChange={(evento) => setDetalle(evento.target.value)} />
          </Campo>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton onClick={guardar} disabled={guardando || !tipoAyudaId || faltaDetalle}>
              {guardando ? "Guardando…" : "Agregar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
