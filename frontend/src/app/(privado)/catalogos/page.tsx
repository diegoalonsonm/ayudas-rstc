import { AdministradorCatalogos } from "@/components/catalogos/administradorCatalogos";
import { Aviso, EncabezadoPagina } from "@/components/ui/marco";
import { listarCatalogo } from "@/lib/api/recursos/catalogos";
import { SLUGS_CATALOGO, type SlugCatalogo } from "@/lib/dominio/enums";
import type { ItemCatalogo } from "@/lib/dominio/tipos";
import { exigirPermiso } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogos — Ayudas RSTC",
};

export default async function PaginaCatalogos() {
  await exigirPermiso("catalogosEscribir");

  const entradas = await Promise.all(
    SLUGS_CATALOGO.map(async (slug) => [slug, await catalogoSeguro(slug)] as const),
  );
  const catalogos = Object.fromEntries(entradas) as Partial<Record<SlugCatalogo, ItemCatalogo[]>>;

  return (
    <>
      <EncabezadoPagina
        titulo="Catálogos"
        descripcion="Valores de referencia que alimentan los formularios de solicitud, vivienda, grupo familiar y direcciones."
      />
      <Aviso tono="informacion">
        Los rangos de ingreso, tipos de vivienda, tenencia y condición reproducen las opciones de
        la ficha impresa. Editar un código puede romper reglas de negocio que dependan de él.
      </Aviso>
      <AdministradorCatalogos catalogos={catalogos} />
    </>
  );
}

async function catalogoSeguro(slug: SlugCatalogo): Promise<ItemCatalogo[]> {
  try {
    return await listarCatalogo(slug);
  } catch {
    return [];
  }
}
