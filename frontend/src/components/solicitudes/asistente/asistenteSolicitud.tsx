"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Aviso, CabeceraTarjeta, CuerpoTarjeta, Tarjeta } from "@/components/ui/marco";
import { accionCompletarAsistente } from "@/lib/acciones/asistente";
import { EstadoSolicitud } from "@/lib/dominio/enums";
import type { ProcesoVigentePersona } from "@/lib/dominio/tipos";
import { fechaDeHoy } from "@/lib/formato";
import { IndicadorPasos, PASOS } from "./pasos";
import { PasoDireccion } from "./pasoDireccion";
import { PasoEntrevista } from "./pasoEntrevista";
import { PasoGrupoFamiliar } from "./pasoGrupoFamiliar";
import { PasoSolicitante } from "./pasoSolicitante";
import { ayudasIncompletas, PasoViviendaAyuda } from "./pasoViviendaAyuda";
import { borradorInicial, type BorradorAsistente, type CatalogosAsistente, type OrganizacionAsistente } from "./tipos";

export function AsistenteSolicitud({
  catalogos,
  organizacion,
}: {
  catalogos: CatalogosAsistente;
  organizacion: OrganizacionAsistente;
}) {
  const router = useRouter();
  const [paso, setPaso] = React.useState(0);
  const [borrador, setBorrador] = React.useState<BorradorAsistente>(() =>
    borradorInicial(fechaDeHoy()),
  );
  const [procesos, setProcesos] = React.useState<ProcesoVigentePersona[] | null>(null);
  const [enviando, setEnviando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const cambiar = React.useCallback((cambio: Partial<BorradorAsistente>) => {
    setBorrador((previo) => ({ ...previo, ...cambio }));
  }, []);

  const codigosBloqueados = React.useMemo(
    () => [...new Set((procesos ?? []).map((proceso) => proceso.tipoAyudaCodigo))],
    [procesos],
  );

  const detallesFaltantes = ayudasIncompletas(borrador.ayudas, catalogos.tiposAyuda);

  const bloqueoDelPaso = validarPaso(paso, borrador, detallesFaltantes);

  async function enviar() {
    setError(null);
    setEnviando(true);
    const resultado = await accionCompletarAsistente({
      solicitud: {
        personaSolicitanteId: borrador.personaId,
        parroquiaReceptoraId: borrador.parroquiaReceptoraId,
        sectorOficial: borrador.sectorOficial,
        fechaEntrevista: borrador.fechaEntrevista,
        fechaVisita: borrador.fechaVisita,
        observaciones: borrador.observaciones,
        tiposAyuda: borrador.ayudas.map((ayuda) => ayuda.tipoAyudaId),
        detalles: borrador.ayudas.map((ayuda) => ayuda.detalle),
        estado: EstadoSolicitud.BORRADOR,
      },
      direccion: tieneDireccion(borrador)
        ? {
            cantonId: borrador.direccion.cantonId,
            distritoId: borrador.direccion.distritoId,
            barrioId: borrador.direccion.barrioId,
            senas: borrador.direccion.senas,
            esActual: true,
            vigenteDesde: borrador.fechaEntrevista || fechaDeHoy(),
            vigenteHasta: null,
          }
        : null,
      integrantes: borrador.integrantes
        .filter((integrante) => integrante.nombreCompleto.trim())
        .map((integrante) => ({
          nombreCompleto: integrante.nombreCompleto,
          sexoId: integrante.sexoId,
          ocupacion: integrante.ocupacion,
          tipoDocumentoId: integrante.tipoDocumentoId,
          numeroDocumento: integrante.numeroDocumento,
          gradoAcademicoId: integrante.gradoAcademicoId,
          rangoIngresoId: integrante.rangoIngresoId,
          cuentaConSeguro: integrante.cuentaConSeguro,
          parentescoId: integrante.parentescoId,
        })),
      vivienda: tieneVivienda(borrador)
        ? {
            tipoViviendaId: borrador.vivienda.tipoViviendaId,
            tipoTenenciaId: borrador.vivienda.tipoTenenciaId,
            condicionViviendaId: borrador.vivienda.condicionViviendaId,
            observaciones: borrador.vivienda.observaciones,
          }
        : null,
    });
    setEnviando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    const parametros = resultado.datos.advertencias.length
      ? `?avisos=${encodeURIComponent(resultado.datos.advertencias.join(" · "))}`
      : "";
    router.push(`/solicitudes/${resultado.datos.solicitudId}${parametros}`);
  }

  return (
    <div className="space-y-5">
      <IndicadorPasos actual={paso} />

      <Tarjeta>
        <CabeceraTarjeta
          titulo={`Paso ${paso + 1} de ${PASOS.length}: ${PASOS[paso].titulo}`}
          descripcion={PASOS[paso].descripcion}
        />
        <CuerpoTarjeta>
          {paso === 0 ? (
            <PasoSolicitante
              borrador={borrador}
              catalogos={catalogos}
              procesos={procesos}
              alCambiar={cambiar}
              alCambiarProcesos={setProcesos}
            />
          ) : null}
          {paso === 1 ? (
            <PasoEntrevista
              borrador={borrador}
              organizacion={organizacion}
              alCambiar={cambiar}
            />
          ) : null}
          {paso === 2 ? (
            <PasoDireccion borrador={borrador} catalogos={catalogos} alCambiar={cambiar} />
          ) : null}
          {paso === 3 ? (
            <PasoGrupoFamiliar borrador={borrador} catalogos={catalogos} alCambiar={cambiar} />
          ) : null}
          {paso === 4 ? (
            <PasoViviendaAyuda
              borrador={borrador}
              catalogos={catalogos}
              codigosBloqueados={codigosBloqueados}
              alCambiar={cambiar}
            />
          ) : null}
        </CuerpoTarjeta>
      </Tarjeta>

      {error ? <Aviso tono="peligro">{error}</Aviso> : null}
      {bloqueoDelPaso ? <Aviso tono="advertencia">{bloqueoDelPaso}</Aviso> : null}

      <div className="flex items-center justify-between gap-3">
        <Boton
          variante="contorno"
          onClick={() => setPaso((actual) => Math.max(0, actual - 1))}
          disabled={paso === 0 || enviando}
        >
          <ArrowLeft />
          Anterior
        </Boton>
        {paso < PASOS.length - 1 ? (
          <Boton
            onClick={() => setPaso((actual) => actual + 1)}
            disabled={Boolean(bloqueoDelPaso)}
          >
            Siguiente
            <ArrowRight />
          </Boton>
        ) : (
          <Boton onClick={enviar} disabled={enviando || Boolean(bloqueoDelPaso)}>
            <Check />
            {enviando ? "Guardando…" : "Guardar como borrador"}
          </Boton>
        )}
      </div>
    </div>
  );
}

function validarPaso(
  paso: number,
  borrador: BorradorAsistente,
  detallesFaltantes: string[],
): string | null {
  if (paso === 0 && !borrador.personaId) {
    return "Seleccione o registre a la persona solicitante para continuar.";
  }
  if (paso === 1 && !borrador.parroquiaReceptoraId) {
    return "Seleccione la parroquia receptora para continuar.";
  }
  if (paso === 3) {
    const sinNombre = borrador.integrantes.some(
      (integrante) => !integrante.nombreCompleto.trim(),
    );
    if (sinNombre) {
      return "Cada integrante necesita un nombre completo, o quítelo de la tabla.";
    }
  }
  if (paso === 4) {
    if (borrador.ayudas.length === 0) {
      return "Marque al menos un tipo de ayuda solicitada.";
    }
    if (detallesFaltantes.length > 0) {
      return `Complete el detalle obligatorio de: ${detallesFaltantes.join(", ")}.`;
    }
  }
  return null;
}

function tieneDireccion(borrador: BorradorAsistente): boolean {
  const { cantonId, distritoId, barrioId, senas } = borrador.direccion;
  return Boolean(cantonId || distritoId || barrioId || senas.trim());
}

function tieneVivienda(borrador: BorradorAsistente): boolean {
  const { tipoViviendaId, tipoTenenciaId, condicionViviendaId, observaciones } = borrador.vivienda;
  return Boolean(tipoViviendaId || tipoTenenciaId || condicionViviendaId || observaciones.trim());
}
