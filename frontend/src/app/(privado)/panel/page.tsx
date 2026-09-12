import Link from "next/link";
import { CodigoRol, EstadoSolicitud } from "@/lib/dominio/enums";
import { etiquetaRol } from "@/lib/dominio/etiquetas";
import { listarSolicitudes } from "@/lib/api/recursos/solicitudes";
import { puede } from "@/lib/autorizacion/permisos";
import { nombresDeOrganizacion, organizacionSegura, sesionActual } from "@/lib/sesion/servidor";
import { Boton } from "@/components/ui/boton";
import { InsigniaEstado } from "@/components/ui/insignia";
import {
  Aviso,
  CabeceraTarjeta,
  CuerpoTarjeta,
  EncabezadoPagina,
  Tarjeta,
  Vacio,
} from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { ErrorApi } from "@/lib/api/errorApi";
import type { SolicitudAyuda } from "@/lib/dominio/tipos";
import { formatearFecha } from "@/lib/formato";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel — Ayudas RSTC",
};

export default async function PaginaPanel() {
  const sesion = await sesionActual();
  const organizacion = await organizacionSegura();
  const nombres = nombresDeOrganizacion(organizacion);

  let solicitudes: SolicitudAyuda[] = [];
  let errorListado: string | null = null;
  try {
    solicitudes = await listarSolicitudes();
  } catch (error) {
    errorListado = error instanceof ErrorApi ? error.message : "No se pudo cargar el listado";
  }

  const activas = solicitudes.filter((solicitud) => !solicitud.eliminadoEn);
  const porEstado = contarPorEstado(activas);
  const vicariaPorParroquia = new Map(
    organizacion.parroquias.map((parroquia) => [parroquia.id, parroquia.vicariaId]),
  );

  const esMultiParroquia =
    sesion.rolCodigo === CodigoRol.COORDINADOR_VICARIAL ||
    sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO ||
    sesion.rolCodigo === CodigoRol.ADMINISTRADOR;
  const agrupaPorVicaria =
    sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO ||
    sesion.rolCodigo === CodigoRol.ADMINISTRADOR;

  return (
    <>
      <EncabezadoPagina
        titulo="Panel"
        descripcion={`Resumen de lo que ${etiquetaRol(sesion.rolCodigo).toLowerCase()} puede ver en su alcance territorial.`}
        acciones={
          puede(sesion, "solicitudesCrear") ? (
            <Boton comoHijo>
              <Link href="/solicitudes/nueva">Nueva solicitud</Link>
            </Boton>
          ) : null
        }
      />

      {errorListado ? <Aviso tono="peligro">{errorListado}</Aviso> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador titulo="Solicitudes visibles" valor={activas.length} />
        <Indicador
          titulo="Borradores"
          valor={porEstado[EstadoSolicitud.BORRADOR] ?? 0}
          nota="Pendientes de presentar"
        />
        <Indicador
          titulo="Por revisar"
          valor={
            (porEstado[EstadoSolicitud.PRESENTADA] ?? 0) +
            (porEstado[EstadoSolicitud.EN_REVISION] ?? 0)
          }
          nota="Presentadas y en revisión"
        />
        <Indicador
          titulo="En ejecución"
          valor={
            (porEstado[EstadoSolicitud.APROBADA] ?? 0) + (porEstado[EstadoSolicitud.ACTIVA] ?? 0)
          }
          nota="Aprobadas y activas"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Tarjeta>
          <CabeceraTarjeta
            titulo="Distribución por estado"
            descripcion="Solo cuenta las solicitudes que su rol y alcance permiten ver."
          />
          <CuerpoTarjeta className="space-y-2 px-5">
            {activas.length === 0 ? (
              <p className="py-4 text-sm text-[var(--color-tinta-suave)]">
                Todavía no hay solicitudes en su alcance.
              </p>
            ) : (
              Object.values(EstadoSolicitud)
                .filter((estado) => (porEstado[estado] ?? 0) > 0)
                .map((estado) => (
                  <div key={estado} className="flex items-center justify-between gap-3 py-1">
                    <InsigniaEstado estado={estado} />
                    <span className="text-sm font-medium tabular-nums">{porEstado[estado]}</span>
                  </div>
                ))
            )}
          </CuerpoTarjeta>
        </Tarjeta>

        {esMultiParroquia ? (
          <Tarjeta>
            <CabeceraTarjeta
              titulo={agrupaPorVicaria ? "Solicitudes por vicaría" : "Solicitudes por parroquia"}
              descripcion={
                agrupaPorVicaria
                  ? "Agrupado por vicaría porque su alcance cubre varias."
                  : "Agrupado por parroquia de su vicaría."
              }
            />
            {(() => {
              const grupos = agrupaPorVicaria
                ? agrupar(activas, (solicitud) => {
                    const vicariaId = vicariaPorParroquia.get(solicitud.parroquiaReceptoraId);
                    return vicariaId ? (nombres.vicarias[vicariaId] ?? "Sin vicaría") : "Sin vicaría";
                  })
                : agrupar(
                    activas,
                    (solicitud) =>
                      nombres.parroquias[solicitud.parroquiaReceptoraId] ?? "Sin parroquia",
                  );
              if (grupos.length === 0) {
                return <Vacio mensaje="Sin solicitudes para agrupar." />;
              }
              return (
                <CuerpoTarjeta className="space-y-2 px-5">
                  {grupos.map(([nombre, cantidad]) => (
                    <div key={nombre} className="flex items-center justify-between gap-3 py-1">
                      <span className="truncate text-sm">{nombre}</span>
                      <span className="text-sm font-medium tabular-nums">{cantidad}</span>
                    </div>
                  ))}
                </CuerpoTarjeta>
              );
            })()}
          </Tarjeta>
        ) : (
          <Tarjeta>
            <CabeceraTarjeta
              titulo="Su parroquia"
              descripcion="Su alcance cubre una sola parroquia, así que el listado no se agrupa."
            />
            <CuerpoTarjeta className="space-y-3">
              <p className="text-sm">
                {sesion.parroquiaId
                  ? (nombres.parroquias[sesion.parroquiaId] ?? "Parroquia asignada")
                  : "Sin parroquia asignada"}
              </p>
              <p className="text-xs text-[var(--color-tinta-suave)]">
                Todas las solicitudes que ve pertenecen a esta parroquia.
              </p>
            </CuerpoTarjeta>
          </Tarjeta>
        )}
      </div>

      <Tarjeta>
        <CabeceraTarjeta
          titulo="Últimas solicitudes"
          descripcion="Las diez más recientes de su alcance."
          acciones={
            <Boton comoHijo variante="contorno" tamano="pequeno">
              <Link href="/solicitudes">Ver todas</Link>
            </Boton>
          }
        />
        {activas.length === 0 ? (
          <Vacio
            mensaje="No hay solicitudes registradas en su alcance."
            accion={
              puede(sesion, "solicitudesCrear") ? (
                <Boton comoHijo variante="contorno" tamano="pequeno">
                  <Link href="/solicitudes/nueva">Registrar la primera</Link>
                </Boton>
              ) : null
            }
          />
        ) : (
          <Tabla>
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Número</CeldaEncabezado>
                <CeldaEncabezado>Estado</CeldaEncabezado>
                {esMultiParroquia ? <CeldaEncabezado>Parroquia</CeldaEncabezado> : null}
                <CeldaEncabezado>Entrevista</CeldaEncabezado>
                <CeldaEncabezado alineacion="derecha">Registrada</CeldaEncabezado>
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {activas.slice(0, 10).map((solicitud) => (
                <FilaTabla key={solicitud.id}>
                  <Celda>
                    <Link
                      href={`/solicitudes/${solicitud.id}`}
                      className="font-medium text-[var(--color-primario-fuerte)] hover:underline"
                    >
                      {solicitud.numeroSolicitud}
                    </Link>
                  </Celda>
                  <Celda>
                    <InsigniaEstado estado={solicitud.estado} />
                  </Celda>
                  {esMultiParroquia ? (
                    <Celda>{nombres.parroquias[solicitud.parroquiaReceptoraId] ?? "—"}</Celda>
                  ) : null}
                  <Celda>{formatearFecha(solicitud.fechaEntrevista)}</Celda>
                  <Celda alineacion="derecha">{formatearFecha(solicitud.creadoEn)}</Celda>
                </FilaTabla>
              ))}
            </CuerpoTabla>
          </Tabla>
        )}
      </Tarjeta>

      {sesion.rolCodigo === CodigoRol.ADMINISTRADOR ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <AccesoRapido
            href="/organizacion"
            titulo="Organización"
            descripcion="Diócesis, vicarías y parroquias"
          />
          <AccesoRapido
            href="/catalogos"
            titulo="Catálogos"
            descripcion="Valores de referencia del sistema"
          />
          <AccesoRapido
            href="/auditoria"
            titulo="Auditoría"
            descripcion="Últimos eventos registrados"
          />
        </div>
      ) : null}

      {sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <AccesoRapido
            href="/auditoria"
            titulo="Auditoría"
            descripcion="Últimos eventos registrados"
          />
          <AccesoRapido
            href="/usuarios"
            titulo="Usuarios"
            descripcion="Alta de coordinadores vicariales"
          />
        </div>
      ) : null}
    </>
  );
}

function Indicador({
  titulo,
  valor,
  nota,
}: {
  titulo: string;
  valor: number;
  nota?: string;
}) {
  return (
    <Tarjeta>
      <CuerpoTarjeta className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-[var(--color-tinta-suave)]">{titulo}</p>
        <p className="text-2xl font-semibold tabular-nums">{valor}</p>
        {nota ? <p className="text-xs text-[var(--color-tinta-suave)]">{nota}</p> : null}
      </CuerpoTarjeta>
    </Tarjeta>
  );
}

function AccesoRapido({
  href,
  titulo,
  descripcion,
}: {
  href: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <Link
      href={href}
      className="marco block px-5 py-4 transition-colors hover:bg-[var(--color-lienzo)]"
    >
      <p className="text-sm font-semibold">{titulo}</p>
      <p className="mt-0.5 text-xs text-[var(--color-tinta-suave)]">{descripcion}</p>
    </Link>
  );
}

function contarPorEstado(solicitudes: SolicitudAyuda[]): Partial<Record<EstadoSolicitud, number>> {
  const conteo: Partial<Record<EstadoSolicitud, number>> = {};
  for (const solicitud of solicitudes) {
    conteo[solicitud.estado] = (conteo[solicitud.estado] ?? 0) + 1;
  }
  return conteo;
}

function agrupar(
  solicitudes: SolicitudAyuda[],
  clave: (solicitud: SolicitudAyuda) => string,
): Array<[string, number]> {
  const conteo = new Map<string, number>();
  for (const solicitud of solicitudes) {
    const nombre = clave(solicitud);
    conteo.set(nombre, (conteo.get(nombre) ?? 0) + 1);
  }
  return [...conteo.entries()].sort((uno, otro) => otro[1] - uno[1]);
}
