"use client";

import * as React from "react";
import * as Primitiva from "@radix-ui/react-tabs";
import { cn } from "@/lib/utiles";

export const Pestanas = Primitiva.Root;

export function ListaPestanas({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Primitiva.List
      className={cn(
        "flex w-full gap-1 overflow-x-auto border-b border-[var(--color-borde)]",
        className,
      )}
    >
      {children}
    </Primitiva.List>
  );
}

export function Pestana({ valor, children }: { valor: string; children: React.ReactNode }) {
  return (
    <Primitiva.Trigger
      value={valor}
      className="-mb-px whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm font-medium text-[var(--color-tinta-suave)] transition-colors hover:text-[var(--color-tinta)] data-[state=active]:border-[var(--color-primario)] data-[state=active]:text-[var(--color-primario-fuerte)]"
    >
      {children}
    </Primitiva.Trigger>
  );
}

export function PanelPestana({
  valor,
  className,
  children,
}: {
  valor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Primitiva.Content value={valor} className={cn("pt-5", className)}>
      {children}
    </Primitiva.Content>
  );
}
