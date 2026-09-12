import * as React from "react";
import { cn } from "@/lib/utiles";

export function Tabla({
  className,
  classNameContenedor,
  children,
  ...contenedorProps
}: {
  className?: string;
  classNameContenedor?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"div">, "className" | "children">) {
  return (
    <div className={cn("w-full overflow-x-auto", classNameContenedor)} {...contenedorProps}>
      <table className={cn("w-full border-collapse text-sm", className)}>{children}</table>
    </div>
  );
}

export function CabeceraTabla({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <thead
      className={cn(
        "border-b border-[var(--color-borde)] bg-[var(--color-lienzo)] text-xs uppercase tracking-wide text-[var(--color-tinta-suave)]",
        className,
      )}
    >
      {children}
    </thead>
  );
}

export function CuerpoTabla({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[var(--color-borde)]">{children}</tbody>;
}

export function FilaTabla({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <tr className={cn("hover:bg-[var(--color-lienzo)]", className)}>{children}</tr>;
}

export function CeldaEncabezado({
  className,
  children,
  alineacion = "izquierda",
}: {
  className?: string;
  children?: React.ReactNode;
  alineacion?: "izquierda" | "derecha" | "centro";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-2.5 font-medium",
        alineacion === "derecha" && "text-right",
        alineacion === "centro" && "text-center",
        alineacion === "izquierda" && "text-left",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Celda({
  className,
  children,
  alineacion = "izquierda",
  colSpan,
}: {
  className?: string;
  children?: React.ReactNode;
  alineacion?: "izquierda" | "derecha" | "centro";
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-4 py-2.5 align-middle",
        alineacion === "derecha" && "text-right",
        alineacion === "centro" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  );
}
