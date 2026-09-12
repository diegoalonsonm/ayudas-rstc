"use client";

import * as React from "react";
import type { Sesion } from "../dominio/tipos";

export type NombresOrganizacion = {
  diocesis: Record<string, string>;
  vicarias: Record<string, string>;
  parroquias: Record<string, string>;
};

type ValorContexto = {
  sesion: Sesion;
  nombres: NombresOrganizacion;
};

const Contexto = React.createContext<ValorContexto | null>(null);

export function ProveedorSesion({
  sesion,
  nombres,
  children,
}: {
  sesion: Sesion;
  nombres: NombresOrganizacion;
  children: React.ReactNode;
}) {
  const valor = React.useMemo(() => ({ sesion, nombres }), [sesion, nombres]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion(): Sesion {
  const valor = React.useContext(Contexto);
  if (!valor) {
    throw new Error("useSesion requiere ProveedorSesion");
  }
  return valor.sesion;
}

export function useNombresOrganizacion(): NombresOrganizacion {
  const valor = React.useContext(Contexto);
  if (!valor) {
    throw new Error("useNombresOrganizacion requiere ProveedorSesion");
  }
  return valor.nombres;
}
