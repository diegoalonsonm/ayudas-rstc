"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utiles";

export const PASOS = [
  { titulo: "Solicitante", descripcion: "Persona y documento" },
  { titulo: "Entrevista", descripcion: "Fechas y parroquia" },
  { titulo: "Dirección", descripcion: "Cantón, distrito y barrio" },
  { titulo: "Grupo familiar", descripcion: "Integrantes de convivencia" },
  { titulo: "Vivienda y ayuda", descripcion: "Condición y necesidades" },
] as const;

export function IndicadorPasos({ actual }: { actual: number }) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Pasos del registro">
      {PASOS.map((paso, indice) => {
        const completado = indice < actual;
        const activo = indice === actual;
        return (
          <li
            key={paso.titulo}
            aria-current={activo ? "step" : undefined}
            className={cn(
              "flex min-w-40 flex-1 items-center gap-2.5 rounded-lg border px-3 py-2",
              activo
                ? "border-[var(--color-primario)] bg-[var(--color-primario-suave)]"
                : "border-[var(--color-borde)] bg-[var(--color-superficie)]",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold",
                completado
                  ? "bg-[var(--color-exito)] text-white"
                  : activo
                    ? "bg-[var(--color-primario)] text-white"
                    : "bg-[var(--color-lienzo)] text-[var(--color-tinta-suave)]",
              )}
            >
              {completado ? <Check className="size-3.5" /> : indice + 1}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-xs font-semibold">{paso.titulo}</span>
              <span className="block truncate text-[11px] text-[var(--color-tinta-suave)]">
                {paso.descripcion}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
