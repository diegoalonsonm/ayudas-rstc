import * as React from "react";
import { cn } from "@/lib/utiles";

export function Tarjeta({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("marco", className)}>{children}</section>;
}

export function CabeceraTarjeta({
  titulo,
  descripcion,
  acciones,
  className,
}: {
  titulo: React.ReactNode;
  descripcion?: React.ReactNode;
  acciones?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-borde)] px-5 py-4",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-[var(--color-tinta)]">{titulo}</h2>
        {descripcion ? (
          <p className="text-xs text-[var(--color-tinta-suave)]">{descripcion}</p>
        ) : null}
      </div>
      {acciones ? <div className="flex items-center gap-2">{acciones}</div> : null}
    </header>
  );
}

export function CuerpoTarjeta({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

export function EncabezadoPagina({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string;
  descripcion?: React.ReactNode;
  acciones?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-tinta)]">{titulo}</h1>
        {descripcion ? (
          <p className="max-w-2xl text-sm text-[var(--color-tinta-suave)]">{descripcion}</p>
        ) : null}
      </div>
      {acciones ? <div className="flex items-center gap-2">{acciones}</div> : null}
    </div>
  );
}

export function Aviso({
  tono = "informacion",
  titulo,
  children,
}: {
  tono?: "informacion" | "advertencia" | "peligro" | "exito";
  titulo?: string;
  children: React.ReactNode;
}) {
  const tonos = {
    informacion: "bg-[var(--color-primario-suave)] text-[var(--color-primario-fuerte)]",
    advertencia: "bg-[var(--color-aviso-suave)] text-[color-mix(in_oklch,var(--color-aviso),black_25%)]",
    peligro: "bg-[var(--color-peligro-suave)] text-[color-mix(in_oklch,var(--color-peligro),black_15%)]",
    exito: "bg-[var(--color-exito-suave)] text-[color-mix(in_oklch,var(--color-exito),black_20%)]",
  } as const;
  return (
    <div className={cn("rounded-lg px-4 py-3 text-sm", tonos[tono])}>
      {titulo ? <p className="font-semibold">{titulo}</p> : null}
      <div className={cn(titulo && "mt-0.5")}>{children}</div>
    </div>
  );
}

export function Vacio({ mensaje, accion }: { mensaje: string; accion?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
      <p className="text-sm text-[var(--color-tinta-suave)]">{mensaje}</p>
      {accion}
    </div>
  );
}

export function Dato({
  etiqueta,
  children,
  className,
}: {
  etiqueta: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <dt className="text-xs uppercase tracking-wide text-[var(--color-tinta-suave)]">{etiqueta}</dt>
      <dd className="text-sm text-[var(--color-tinta)]">{children}</dd>
    </div>
  );
}

export function RejillaDatos({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <dl className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>{children}</dl>
  );
}
