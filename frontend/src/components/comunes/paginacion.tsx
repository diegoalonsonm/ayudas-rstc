"use client";

import { Boton } from "@/components/ui/boton";

export const TAMANO_PAGINA = 20;

export function paginar<T>(items: T[], pagina: number, tamano = TAMANO_PAGINA): T[] {
  const inicio = (pagina - 1) * tamano;
  return items.slice(inicio, inicio + tamano);
}

export function totalPaginas(total: number, tamano = TAMANO_PAGINA): number {
  return Math.max(1, Math.ceil(total / tamano));
}

export function Paginacion({
  pagina,
  total,
  tamano = TAMANO_PAGINA,
  alCambiar,
}: {
  pagina: number;
  total: number;
  tamano?: number;
  alCambiar: (pagina: number) => void;
}) {
  const paginas = totalPaginas(total, tamano);
  if (paginas <= 1) {
    return null;
  }
  const desde = (pagina - 1) * tamano + 1;
  const hasta = Math.min(pagina * tamano, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-borde)] px-5 py-3">
      <p className="text-xs text-[var(--color-tinta-suave)]">
        {desde}–{hasta} de {total}
      </p>
      <div className="flex items-center gap-2">
        <Boton
          variante="contorno"
          tamano="pequeno"
          onClick={() => alCambiar(pagina - 1)}
          disabled={pagina <= 1}
        >
          Anterior
        </Boton>
        <span className="text-xs text-[var(--color-tinta-suave)]">
          Página {pagina} de {paginas}
        </span>
        <Boton
          variante="contorno"
          tamano="pequeno"
          onClick={() => alCambiar(pagina + 1)}
          disabled={pagina >= paginas}
        >
          Siguiente
        </Boton>
      </div>
    </div>
  );
}
