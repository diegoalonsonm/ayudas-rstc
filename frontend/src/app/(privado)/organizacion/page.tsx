import { PanelNivel } from "@/components/organizacion/panelNivel";
import { Aviso, EncabezadoPagina } from "@/components/ui/marco";
import { exigirPermiso, organizacionSegura } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Organización — Ayudas RSTC",
};

export default async function PaginaOrganizacion() {
  await exigirPermiso("organizacionEscribir");
  const organizacion = await organizacionSegura();

  return (
    <>
      <EncabezadoPagina
        titulo="Estructura territorial"
        descripcion="Diócesis, vicarías y parroquias. El backend genera los códigos en cascada, por ejemplo D01-V01-P001."
      />

      <Aviso tono="advertencia" titulo="Los cambios aquí redefinen el alcance de todos los roles">
        Eliminar una vicaría o una parroquia deja fuera de alcance a los usuarios asignados a ella
        y oculta sus expedientes. La eliminación es lógica y exige motivo.
      </Aviso>

      <PanelNivel
        nivel="diocesis"
        titulo="Diócesis"
        descripcion="Nivel superior de la jerarquía territorial."
        entidades={organizacion.diocesis.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          codigo: item.codigo,
          creadoEn: item.creadoEn,
          eliminadoEn: item.eliminadoEn,
        }))}
      />

      <PanelNivel
        nivel="vicarias"
        titulo="Vicarías"
        descripcion="Agrupan parroquias dentro de una diócesis."
        etiquetaPadre="Diócesis"
        campoPadre="diocesisId"
        padres={organizacion.diocesis.map((item) => ({ id: item.id, nombre: item.nombre }))}
        entidades={organizacion.vicarias.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          codigo: item.codigo,
          creadoEn: item.creadoEn,
          eliminadoEn: item.eliminadoEn,
          padreId: item.diocesisId,
        }))}
      />

      <PanelNivel
        nivel="parroquias"
        titulo="Parroquias"
        descripcion="Unidad que recibe y administra las solicitudes de ayuda."
        conScroll
        etiquetaPadre="Vicaría"
        campoPadre="vicariaId"
        padres={organizacion.vicarias.map((item) => ({ id: item.id, nombre: item.nombre }))}
        entidades={organizacion.parroquias.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          codigo: item.codigo,
          creadoEn: item.creadoEn,
          eliminadoEn: item.eliminadoEn,
          padreId: item.vicariaId,
        }))}
      />
    </>
  );
}
