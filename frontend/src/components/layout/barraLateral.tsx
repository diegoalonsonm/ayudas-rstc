"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  Church,
  LayoutDashboard,
  ScrollText,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utiles";
import { navegacionPara, type ItemNavegacion } from "@/lib/autorizacion/navegacion";
import { useSesion } from "@/lib/sesion/contextoSesion";

const ICONOS = {
  panel: LayoutDashboard,
  solicitudes: ScrollText,
  personas: UserRound,
  usuarios: Users,
  organizacion: Church,
  catalogos: BookMarked,
  auditoria: ShieldCheck,
} as const;

export function BarraLateral() {
  const sesion = useSesion();
  const ruta = usePathname();
  const items = navegacionPara(sesion);

  return (
    <nav
      aria-label="Navegación principal"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--color-borde)] bg-[var(--color-superficie)] px-3 py-2 lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-3 lg:py-4"
    >
      <div className="hidden items-center gap-2 px-2 pb-4 lg:flex">
        <span className="grid size-8 place-items-center rounded-lg bg-[var(--color-primario)] text-sm font-semibold text-white">
          PS
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Ayudas RSTC</p>
          <p className="text-xs text-[var(--color-tinta-suave)]">Pastoral Social</p>
        </div>
      </div>
      {items.map((item) => (
        <Enlace key={item.href} item={item} activo={esActivo(ruta, item.href)} />
      ))}
    </nav>
  );
}

function Enlace({ item, activo }: { item: ItemNavegacion; activo: boolean }) {
  const Icono = ICONOS[item.icono];
  return (
    <Link
      href={item.href}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        activo
          ? "bg-[var(--color-primario-suave)] text-[var(--color-primario-fuerte)]"
          : "text-[var(--color-tinta-suave)] hover:bg-[var(--color-lienzo)] hover:text-[var(--color-tinta)]",
      )}
    >
      <Icono className="size-4 shrink-0" />
      {item.etiqueta}
    </Link>
  );
}

function esActivo(ruta: string, href: string): boolean {
  return ruta === href || ruta.startsWith(`${href}/`);
}
