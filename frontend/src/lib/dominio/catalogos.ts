import type { ItemCatalogo } from "./tipos";

export function ordenarCatalogo(items: ItemCatalogo[]): ItemCatalogo[] {
  return [...items].sort((uno, otro) => {
    const ordenUno = uno.ordenPresentacion ?? Number.MAX_SAFE_INTEGER;
    const ordenOtro = otro.ordenPresentacion ?? Number.MAX_SAFE_INTEGER;
    if (ordenUno !== ordenOtro) {
      return ordenUno - ordenOtro;
    }
    return uno.nombre.localeCompare(otro.nombre, "es");
  });
}

export function indexarPorId(items: ItemCatalogo[]): Map<string, ItemCatalogo> {
  return new Map(items.map((item) => [item.id, item]));
}

export function nombreDeCatalogo(items: ItemCatalogo[], id: string | null | undefined): string {
  if (!id) {
    return "—";
  }
  return items.find((item) => item.id === id)?.nombre ?? "—";
}
