import { solicitar } from "../clienteServidor";
import type { SlugCatalogo } from "../../dominio/enums";
import { ordenarCatalogo } from "../../dominio/catalogos";
import type { ItemCatalogo } from "../../dominio/tipos";

export async function listarCatalogo(slug: SlugCatalogo): Promise<ItemCatalogo[]> {
  const items = await solicitar<ItemCatalogo[]>(`/catalogos/${slug}`);
  return ordenarCatalogo(items);
}

export async function listarCatalogos<T extends SlugCatalogo>(
  slugs: readonly T[],
): Promise<Record<T, ItemCatalogo[]>> {
  const resultados = await Promise.all(slugs.map((slug) => listarCatalogo(slug)));
  const salida = {} as Record<T, ItemCatalogo[]>;
  slugs.forEach((slug, indice) => {
    salida[slug] = resultados[indice];
  });
  return salida;
}

export async function crearItemCatalogo(
  slug: SlugCatalogo,
  cuerpo: Record<string, unknown>,
): Promise<ItemCatalogo> {
  return await solicitar<ItemCatalogo>(`/catalogos/${slug}`, { metodo: "POST", cuerpo });
}

export async function actualizarItemCatalogo(
  slug: SlugCatalogo,
  id: string,
  cuerpo: Record<string, unknown>,
): Promise<ItemCatalogo> {
  return await solicitar<ItemCatalogo>(`/catalogos/${slug}/${id}`, { metodo: "PATCH", cuerpo });
}

export async function eliminarItemCatalogo(
  slug: SlugCatalogo,
  id: string,
  motivo: string,
): Promise<unknown> {
  return await solicitar(`/catalogos/${slug}/${id}`, { metodo: "DELETE", cuerpo: { motivo } });
}
