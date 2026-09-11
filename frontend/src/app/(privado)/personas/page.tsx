import { BuscadorDocumento } from "@/components/personas/buscadorDocumento";
import { FormularioPersona } from "@/components/personas/formularioPersona";
import { TablaPersonas } from "@/components/personas/tablaPersonas";
import { Puede } from "@/components/autorizacion/puede";
import { Aviso, EncabezadoPagina, Tarjeta } from "@/components/ui/marco";
import { ErrorApi } from "@/lib/api/errorApi";
import { listarCatalogo } from "@/lib/api/recursos/catalogos";
import { listarPersonas } from "@/lib/api/recursos/personas";
import type { ItemCatalogo, Persona } from "@/lib/dominio/tipos";
import { exigirPermiso } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personas — Ayudas RSTC",
};

export default async function PaginaPersonas() {
  await exigirPermiso("personasVer");

  let personas: Persona[] = [];
  let error: string | null = null;
  try {
    personas = await listarPersonas();
  } catch (problema) {
    error = problema instanceof ErrorApi ? problema.message : "No se pudo cargar el listado";
  }
  const tiposDocumento = await catalogoSeguro();

  return (
    <>
      <EncabezadoPagina
        titulo="Personas"
        descripcion="Solo aparecen las personas vinculadas a expedientes de su alcance territorial. El administrador ve todas."
        acciones={
          <Puede accion="personasCrear">
            <FormularioPersona tiposDocumento={tiposDocumento} />
          </Puede>
        }
      />
      {error ? <Aviso tono="peligro">{error}</Aviso> : null}
      <BuscadorDocumento />
      <Tarjeta>
        <TablaPersonas personas={personas} />
      </Tarjeta>
    </>
  );
}

async function catalogoSeguro(): Promise<ItemCatalogo[]> {
  try {
    return await listarCatalogo("tipos-documento");
  } catch {
    return [];
  }
}
