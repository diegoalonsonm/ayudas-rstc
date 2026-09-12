"use client";

import * as React from "react";
import { Search, UserCheck } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { Aviso, Dato, RejillaDatos } from "@/components/ui/marco";
import { InsigniaEstado } from "@/components/ui/insignia";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { accionBuscarProcesosVigentes, accionCrearPersona } from "@/lib/acciones/personas";
import type { ProcesoVigentePersona } from "@/lib/dominio/tipos";
import { nombreCompletoPersona } from "@/lib/formato";
import type { BorradorAsistente, CatalogosAsistente } from "./tipos";

export function PasoSolicitante({
  borrador,
  catalogos,
  procesos,
  alCambiar,
  alCambiarProcesos,
}: {
  borrador: BorradorAsistente;
  catalogos: CatalogosAsistente;
  procesos: ProcesoVigentePersona[] | null;
  alCambiar: (cambio: Partial<BorradorAsistente>) => void;
  alCambiarProcesos: (procesos: ProcesoVigentePersona[] | null) => void;
}) {
  const [documento, setDocumento] = React.useState(borrador.documentoBuscado);
  const [buscando, setBuscando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [creando, setCreando] = React.useState(false);
  const [nueva, setNueva] = React.useState({
    tipoDocumentoId: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    telefono: "",
  });

  async function buscar() {
    setError(null);
    setBuscando(true);
    const resultado = await accionBuscarProcesosVigentes({ numeroDocumento: documento });
    setBuscando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    alCambiarProcesos(resultado.datos);
    alCambiar({ documentoBuscado: documento });
  }

  async function registrar() {
    setError(null);
    setCreando(true);
    const resultado = await accionCrearPersona({
      tipoDocumentoId: nueva.tipoDocumentoId || null,
      numeroDocumento: documento || null,
      primerNombre: nueva.primerNombre,
      segundoNombre: nueva.segundoNombre || null,
      primerApellido: nueva.primerApellido,
      segundoApellido: nueva.segundoApellido || null,
      telefono: nueva.telefono || null,
    });
    setCreando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    alCambiar({ personaId: resultado.datos.id, personaResumen: resultado.datos });
  }

  const personaIdDeProcesos = procesos?.[0]?.personaId ?? null;

  return (
    <div className="space-y-6">
      <Aviso tono="informacion" titulo="Primero verifique si la persona ya tiene procesos vigentes">
        La búsqueda compara el documento contra toda la diócesis y devuelve solo los datos mínimos
        del proceso vigente, sin el expediente completo. Así se detecta a tiempo una ayuda
        duplicada del mismo tipo.
      </Aviso>

      <div className="flex flex-wrap items-end gap-3">
        <Campo etiqueta="Número de documento" className="min-w-56 flex-1">
          <Entrada
            value={documento}
            onChange={(evento) => setDocumento(evento.target.value)}
            placeholder="1-2345-6789"
          />
        </Campo>
        <Boton onClick={buscar} disabled={buscando || documento.trim().length < 4}>
          <Search />
          {buscando ? "Buscando…" : "Buscar"}
        </Boton>
      </div>

      {error ? <Aviso tono="peligro">{error}</Aviso> : null}

      {procesos && procesos.length > 0 ? (
        <div className="space-y-3">
          <Aviso tono="advertencia" titulo="Esta persona ya tiene procesos vigentes">
            Los tipos de ayuda de la lista quedarán bloqueados en el último paso. Puede continuar
            con necesidades distintas.
          </Aviso>
          <Tabla>
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Solicitud</CeldaEncabezado>
                <CeldaEncabezado>Estado</CeldaEncabezado>
                <CeldaEncabezado>Tipo de ayuda</CeldaEncabezado>
                <CeldaEncabezado>Parroquia</CeldaEncabezado>
                <CeldaEncabezado>Vicaría</CeldaEncabezado>
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {procesos.map((proceso) => (
                <FilaTabla key={`${proceso.solicitudId}-${proceso.tipoAyudaCodigo}`}>
                  <Celda>{proceso.numeroSolicitud}</Celda>
                  <Celda>
                    <InsigniaEstado estado={proceso.estado} />
                  </Celda>
                  <Celda>{proceso.tipoAyudaNombre}</Celda>
                  <Celda>{proceso.parroquiaNombre}</Celda>
                  <Celda>{proceso.vicariaNombre}</Celda>
                </FilaTabla>
              ))}
            </CuerpoTabla>
          </Tabla>
          {!borrador.personaId && personaIdDeProcesos ? (
            <Boton
              variante="contorno"
              onClick={() => alCambiar({ personaId: personaIdDeProcesos })}
            >
              <UserCheck />
              Usar esta persona como solicitante
            </Boton>
          ) : null}
        </div>
      ) : null}

      {procesos && procesos.length === 0 ? (
        <Aviso tono="exito">
          No hay procesos vigentes con ese documento. Puede registrar a la persona y continuar.
        </Aviso>
      ) : null}

      {borrador.personaId ? (
        <div className="marco px-5 py-4">
          <p className="mb-3 text-sm font-semibold">Solicitante seleccionado</p>
          {borrador.personaResumen ? (
            <RejillaDatos>
              <Dato etiqueta="Nombre">{nombreCompletoPersona(borrador.personaResumen)}</Dato>
              <Dato etiqueta="Documento">
                {borrador.personaResumen.numeroDocumentoHash
                  ? "Registrado (cifrado en el servidor)"
                  : "Sin documento"}
              </Dato>
              <Dato etiqueta="Identificador">
                <code className="text-xs">{borrador.personaId}</code>
              </Dato>
            </RejillaDatos>
          ) : (
            <p className="text-sm text-[var(--color-tinta-suave)]">
              Persona existente con identificador <code className="text-xs">{borrador.personaId}</code>.
            </p>
          )}
          <Boton
            variante="fantasma"
            tamano="pequeno"
            className="mt-3"
            onClick={() => alCambiar({ personaId: null, personaResumen: null })}
          >
            Cambiar solicitante
          </Boton>
        </div>
      ) : (
        <div className="marco space-y-4 px-5 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Registrar a la persona solicitante</p>
            <p className="text-xs text-[var(--color-tinta-suave)]">
              El documento y el teléfono se cifran en el servidor y no vuelven a mostrarse.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Tipo de documento">
              <Seleccion
                value={nueva.tipoDocumentoId}
                onChange={(evento) =>
                  setNueva({ ...nueva, tipoDocumentoId: evento.target.value })
                }
              >
                <option value="">Sin especificar</option>
                {catalogos.tiposDocumento.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Teléfono">
              <Entrada
                value={nueva.telefono}
                onChange={(evento) => setNueva({ ...nueva, telefono: evento.target.value })}
              />
            </Campo>
            <Campo etiqueta="Primer nombre" requerido>
              <Entrada
                value={nueva.primerNombre}
                onChange={(evento) => setNueva({ ...nueva, primerNombre: evento.target.value })}
              />
            </Campo>
            <Campo etiqueta="Segundo nombre">
              <Entrada
                value={nueva.segundoNombre}
                onChange={(evento) => setNueva({ ...nueva, segundoNombre: evento.target.value })}
              />
            </Campo>
            <Campo etiqueta="Primer apellido" requerido>
              <Entrada
                value={nueva.primerApellido}
                onChange={(evento) => setNueva({ ...nueva, primerApellido: evento.target.value })}
              />
            </Campo>
            <Campo etiqueta="Segundo apellido">
              <Entrada
                value={nueva.segundoApellido}
                onChange={(evento) =>
                  setNueva({ ...nueva, segundoApellido: evento.target.value })
                }
              />
            </Campo>
          </div>
          <Boton
            onClick={registrar}
            disabled={
              creando || !nueva.primerNombre.trim() || !nueva.primerApellido.trim()
            }
          >
            {creando ? "Registrando…" : "Registrar y continuar"}
          </Boton>
        </div>
      )}
    </div>
  );
}
