import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AccionesEstado } from "@/components/solicitudes/accionesEstado";
import { PanelAyudas } from "@/components/expediente/panelAyudas";
import { PanelConsentimientos } from "@/components/expediente/panelConsentimientos";
import { PanelGrupoFamiliar } from "@/components/expediente/panelGrupoFamiliar";
import { PanelHistorial } from "@/components/expediente/panelHistorial";
import { PanelPlan, type PlanConDetalles } from "@/components/expediente/panelPlan";
import { PanelResumen } from "@/components/expediente/panelResumen";
import { PanelVivienda } from "@/components/expediente/panelVivienda";
import { PestanasExpediente } from "@/components/expediente/pestanasExpediente";
import { Boton } from "@/components/ui/boton";
import { InsigniaEstado } from "@/components/ui/insignia";
import {
  Aviso,
  CabeceraTarjeta,
  CuerpoTarjeta,
  EncabezadoPagina,
  Tarjeta,
} from "@/components/ui/marco";
import { ErrorApi } from "@/lib/api/errorApi";
import { listarCatalogos } from "@/lib/api/recursos/catalogos";
import { listarDetallesConEntregas } from "@/lib/api/recursos/planes";
import { obtenerExpediente } from "@/lib/api/recursos/solicitudes";
import type { EstadoSolicitud } from "@/lib/dominio/enums";
import { exigirPermiso, organizacionSegura } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export default async function PaginaExpediente({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ avisos?: string }>;
}) {
  await exigirPermiso("solicitudesVer");
  const { id } = await params;
  const { avisos } = await searchParams;

  let expediente;
  try {
    expediente = await obtenerExpediente(id);
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) {
      notFound();
    }
    throw error;
  }

  const organizacion = await organizacionSegura();
  const catalogos = await listarCatalogos([
    "sexos",
    "tipos-documento",
    "grados-academicos",
    "rangos-ingreso",
    "parentescos",
    "tipos-vivienda",
    "tipos-tenencia",
    "condiciones-vivienda",
    "tipos-ayuda",
    "cantones",
    "distritos",
    "barrios",
  ]);

  const planes: PlanConDetalles[] = await Promise.all(
    expediente.planes.map(async (plan) => ({
      ...plan,
      detalles: await detallesSeguros(plan.id),
    })),
  );

  const vicariaId =
    organizacion.parroquias.find(
      (parroquia) => parroquia.id === expediente.solicitud.parroquiaReceptoraId,
    )?.vicariaId ?? null;

  const estado = expediente.solicitud.estado as EstadoSolicitud;

  return (
    <>
      <div>
        <Boton comoHijo variante="fantasma" tamano="pequeno" className="mb-3 -ml-2">
          <Link href="/solicitudes">
            <ArrowLeft />
            Volver al listado
          </Link>
        </Boton>
        <EncabezadoPagina
          titulo={`Solicitud ${expediente.solicitud.numeroSolicitud}`}
          descripcion={
            <span className="inline-flex items-center gap-2">
              <InsigniaEstado estado={estado} />
              {expediente.solicitud.eliminadoEn ? (
                <span className="text-xs text-[var(--color-peligro)]">
                  eliminada: {expediente.solicitud.motivoEliminacion}
                </span>
              ) : null}
            </span>
          }
        />
      </div>

      {avisos ? (
        <Aviso tono="advertencia" titulo="El registro se guardó con observaciones">
          {avisos}
        </Aviso>
      ) : null}

      <Tarjeta>
        <CabeceraTarjeta
          titulo="Acciones sobre el expediente"
          descripcion="Las opciones se cruzan con la máquina de estados y con la matriz de permisos de su rol."
        />
        <CuerpoTarjeta>
          <AccionesEstado
            solicitudId={expediente.solicitud.id}
            estado={estado}
            eliminada={Boolean(expediente.solicitud.eliminadoEn)}
          />
        </CuerpoTarjeta>
      </Tarjeta>

      <PestanasExpediente
        cantidades={{
          integrantes: expediente.integrantes.filter((item) => !item.eliminadoEn).length,
          ayudas: expediente.ayudasSolicitadas.filter((item) => !item.eliminadoEn).length,
          planes: planes.filter((item) => !item.eliminadoEn).length,
          documentos: expediente.documentos.filter((item) => !item.eliminadoEn).length,
        }}
        resumen={
          <PanelResumen
            solicitud={expediente.solicitud}
            persona={expediente.persona}
            direccion={expediente.direccionActual}
            vicariaId={vicariaId}
            catalogos={{
              cantones: catalogos.cantones,
              distritos: catalogos.distritos,
              barrios: catalogos.barrios,
            }}
          />
        }
        grupoFamiliar={
          <PanelGrupoFamiliar
            solicitudId={expediente.solicitud.id}
            integrantes={expediente.integrantes}
            catalogos={{
              sexos: catalogos.sexos,
              tiposDocumento: catalogos["tipos-documento"],
              gradosAcademicos: catalogos["grados-academicos"],
              rangosIngreso: catalogos["rangos-ingreso"],
              parentescos: catalogos.parentescos,
            }}
          />
        }
        vivienda={
          <PanelVivienda
            solicitudId={expediente.solicitud.id}
            evaluacion={expediente.evaluacionVivienda}
            catalogos={{
              tiposVivienda: catalogos["tipos-vivienda"],
              tiposTenencia: catalogos["tipos-tenencia"],
              condicionesVivienda: catalogos["condiciones-vivienda"],
            }}
          />
        }
        ayudas={
          <PanelAyudas
            solicitudId={expediente.solicitud.id}
            ayudas={expediente.ayudasSolicitadas}
            tiposAyuda={catalogos["tipos-ayuda"]}
          />
        }
        plan={
          <PanelPlan
            solicitudId={expediente.solicitud.id}
            estado={estado}
            planes={planes}
            tiposAyuda={catalogos["tipos-ayuda"]}
          />
        }
        consentimientos={
          <PanelConsentimientos
            solicitudId={expediente.solicitud.id}
            documentos={expediente.documentos}
          />
        }
        historial={<PanelHistorial historial={expediente.historialEstados} />}
      />
    </>
  );
}

async function detallesSeguros(planId: string) {
  try {
    return await listarDetallesConEntregas(planId);
  } catch {
    return [];
  }
}
