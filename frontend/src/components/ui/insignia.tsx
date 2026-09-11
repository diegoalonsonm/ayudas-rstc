import * as React from "react";
import { cn } from "@/lib/utiles";
import { EstadoSolicitud } from "@/lib/dominio/enums";
import { etiquetaEstado } from "@/lib/dominio/etiquetas";

const TONOS = {
  neutro: "bg-[var(--color-lienzo)] text-[var(--color-tinta-suave)]",
  informacion: "bg-[var(--color-primario-suave)] text-[var(--color-primario-fuerte)]",
  exito: "bg-[var(--color-exito-suave)] text-[color-mix(in_oklch,var(--color-exito),black_20%)]",
  advertencia: "bg-[var(--color-aviso-suave)] text-[color-mix(in_oklch,var(--color-aviso),black_25%)]",
  peligro: "bg-[var(--color-peligro-suave)] text-[color-mix(in_oklch,var(--color-peligro),black_15%)]",
} as const;

export type TonoInsignia = keyof typeof TONOS;

export function Insignia({
  tono = "neutro",
  className,
  children,
}: {
  tono?: TonoInsignia;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

const TONO_POR_ESTADO: Record<EstadoSolicitud, TonoInsignia> = {
  [EstadoSolicitud.BORRADOR]: "neutro",
  [EstadoSolicitud.PRESENTADA]: "informacion",
  [EstadoSolicitud.EN_REVISION]: "advertencia",
  [EstadoSolicitud.APROBADA]: "exito",
  [EstadoSolicitud.ACTIVA]: "exito",
  [EstadoSolicitud.RECHAZADA]: "peligro",
  [EstadoSolicitud.FINALIZADA]: "neutro",
  [EstadoSolicitud.CANCELADA]: "peligro",
};

export function InsigniaEstado({ estado }: { estado: EstadoSolicitud }) {
  return <Insignia tono={TONO_POR_ESTADO[estado] ?? "neutro"}>{etiquetaEstado(estado)}</Insignia>;
}
