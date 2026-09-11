import { TablaAuditoria } from "@/components/auditoria/tablaAuditoria";
import { Aviso, EncabezadoPagina, Tarjeta } from "@/components/ui/marco";
import { ErrorApi } from "@/lib/api/errorApi";
import { LIMITE_EVENTOS_BACKEND, listarEventosAuditoria } from "@/lib/api/recursos/auditoria";
import { CodigoRol } from "@/lib/dominio/enums";
import type { EventoAuditoria } from "@/lib/dominio/tipos";
import { exigirPermiso } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Auditoría — Ayudas RSTC",
};

export default async function PaginaAuditoria() {
  const sesion = await exigirPermiso("auditoriaVer");

  let eventos: EventoAuditoria[] = [];
  let error: string | null = null;
  try {
    eventos = await listarEventosAuditoria();
  } catch (problema) {
    error = problema instanceof ErrorApi ? problema.message : "No se pudieron cargar los eventos";
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Auditoría"
        descripcion={
          sesion.rolCodigo === CodigoRol.ADMINISTRADOR
            ? "Bitácora inmutable de todo el sistema."
            : "Bitácora de los eventos de su diócesis."
        }
      />

      <Aviso tono="informacion" titulo="El backend devuelve los últimos eventos, no el historial completo">
        La consulta trae como máximo {LIMITE_EVENTOS_BACKEND} eventos, ordenados del más reciente
        al más antiguo, y los filtros de esta vista se aplican sobre ese conjunto. Para una
        investigación histórica hace falta un endpoint con paginación y filtros en el servidor.
      </Aviso>

      {error ? <Aviso tono="peligro">{error}</Aviso> : null}

      <Tarjeta>
        <TablaAuditoria eventos={eventos} />
      </Tarjeta>
    </>
  );
}
