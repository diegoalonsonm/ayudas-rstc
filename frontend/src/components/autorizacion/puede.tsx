"use client";

import * as React from "react";
import { useSesion } from "@/lib/sesion/contextoSesion";
import { puede, type Permiso } from "@/lib/autorizacion/permisos";

export function Puede({
  accion,
  alternativa = null,
  children,
}: {
  accion: Permiso;
  alternativa?: React.ReactNode;
  children: React.ReactNode;
}) {
  const sesion = useSesion();
  if (!puede(sesion, accion)) {
    return <>{alternativa}</>;
  }
  return <>{children}</>;
}

export function SiRol({
  roles,
  alternativa = null,
  children,
}: {
  roles: readonly string[];
  alternativa?: React.ReactNode;
  children: React.ReactNode;
}) {
  const sesion = useSesion();
  if (!sesion || !roles.includes(sesion.rolCodigo)) {
    return <>{alternativa}</>;
  }
  return <>{children}</>;
}
