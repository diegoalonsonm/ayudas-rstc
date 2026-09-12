"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import { cerrarSesionNavegador } from "@/lib/api/clienteNavegador";
import { describirAlcance } from "@/lib/autorizacion/alcance";
import { etiquetaRol } from "@/lib/dominio/etiquetas";
import { useNombresOrganizacion, useSesion } from "@/lib/sesion/contextoSesion";

export function Encabezado() {
  const sesion = useSesion();
  const nombres = useNombresOrganizacion();
  const router = useRouter();
  const [saliendo, setSaliendo] = React.useState(false);

  const alcance = describirAlcance(
    {
      diocesisId: sesion.diocesisId,
      vicariaId: sesion.vicariaId,
      parroquiaId: sesion.parroquiaId,
    },
    {
      diocesis: new Map(Object.entries(nombres.diocesis)),
      vicarias: new Map(Object.entries(nombres.vicarias)),
      parroquias: new Map(Object.entries(nombres.parroquias)),
    },
  );

  async function salir() {
    setSaliendo(true);
    await cerrarSesionNavegador();
    router.replace("/ingreso");
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-borde)] bg-[var(--color-superficie)] px-5 py-3">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-semibold text-[var(--color-tinta)]">
          {sesion.nombreCompleto}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Insignia tono="informacion">{etiquetaRol(sesion.rolCodigo)}</Insignia>
          <span className="text-xs text-[var(--color-tinta-suave)]">{alcance}</span>
        </div>
      </div>
      <Boton variante="contorno" tamano="pequeno" onClick={salir} disabled={saliendo}>
        <LogOut />
        {saliendo ? "Saliendo…" : "Cerrar sesión"}
      </Boton>
    </header>
  );
}
