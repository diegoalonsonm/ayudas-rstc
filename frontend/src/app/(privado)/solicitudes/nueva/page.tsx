import { AsistenteSolicitud } from "@/components/solicitudes/asistente/asistenteSolicitud";
import { EncabezadoPagina } from "@/components/ui/marco";
import { listarCatalogos } from "@/lib/api/recursos/catalogos";
import { exigirPermiso, organizacionSegura } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva solicitud — Ayudas RSTC",
};

export default async function PaginaNuevaSolicitud() {
  await exigirPermiso("solicitudesCrear");
  const organizacion = await organizacionSegura();
  const catalogos = await listarCatalogos([
    "tipos-documento",
    "sexos",
    "grados-academicos",
    "parentescos",
    "rangos-ingreso",
    "tipos-vivienda",
    "tipos-tenencia",
    "condiciones-vivienda",
    "tipos-ayuda",
    "cantones",
    "distritos",
    "barrios",
  ]);

  return (
    <>
      <EncabezadoPagina
        titulo="Nueva solicitud de ayuda"
        descripcion="El asistente sigue el orden de la ficha de registro de datos de solicitantes para asistencia social. Se guarda como borrador y puede completarse después desde el expediente."
      />
      <AsistenteSolicitud
        catalogos={{
          tiposDocumento: catalogos["tipos-documento"],
          sexos: catalogos.sexos,
          gradosAcademicos: catalogos["grados-academicos"],
          parentescos: catalogos.parentescos,
          rangosIngreso: catalogos["rangos-ingreso"],
          tiposVivienda: catalogos["tipos-vivienda"],
          tiposTenencia: catalogos["tipos-tenencia"],
          condicionesVivienda: catalogos["condiciones-vivienda"],
          tiposAyuda: catalogos["tipos-ayuda"],
          cantones: catalogos.cantones,
          distritos: catalogos.distritos,
          barrios: catalogos.barrios,
        }}
        organizacion={{
          vicarias: organizacion.vicarias,
          parroquias: organizacion.parroquias,
        }}
      />
    </>
  );
}
