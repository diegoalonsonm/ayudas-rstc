"use client";

import * as React from "react";
import * as Primitiva from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utiles";

export const Dialogo = Primitiva.Root;
export const DisparadorDialogo = Primitiva.Trigger;
export const CierreDialogo = Primitiva.Close;

export function ContenidoDialogo({
  titulo,
  descripcion,
  className,
  children,
}: {
  titulo: string;
  descripcion?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Primitiva.Portal>
      <Primitiva.Overlay className="fixed inset-0 z-50 bg-black/35" />
      <Primitiva.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(38rem,calc(100vw-2rem))] max-h-[calc(100vh-4rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[var(--color-borde)] bg-[var(--color-superficie)] shadow-xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-borde)] px-5 py-4">
          <div className="space-y-1">
            <Primitiva.Title className="text-sm font-semibold text-[var(--color-tinta)]">
              {titulo}
            </Primitiva.Title>
            {descripcion ? (
              <Primitiva.Description className="text-xs text-[var(--color-tinta-suave)]">
                {descripcion}
              </Primitiva.Description>
            ) : null}
          </div>
          <Primitiva.Close
            className="rounded-md p-1 text-[var(--color-tinta-suave)] hover:bg-[var(--color-lienzo)]"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </Primitiva.Close>
        </div>
        <div className="px-5 py-4">{children}</div>
      </Primitiva.Content>
    </Primitiva.Portal>
  );
}
