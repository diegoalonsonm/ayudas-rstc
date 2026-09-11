import { puede, type Permiso } from "./permisos";
import type { Sesion } from "../dominio/tipos";

export type ItemNavegacion = {
  href: string;
  etiqueta: string;
  icono:
    | "panel"
    | "solicitudes"
    | "personas"
    | "usuarios"
    | "organizacion"
    | "catalogos"
    | "auditoria";
  permiso?: Permiso;
};

const ITEMS: ItemNavegacion[] = [
  { href: "/panel", etiqueta: "Panel", icono: "panel" },
  {
    href: "/solicitudes",
    etiqueta: "Solicitudes",
    icono: "solicitudes",
    permiso: "solicitudesVer",
  },
  { href: "/personas", etiqueta: "Personas", icono: "personas", permiso: "personasVer" },
  { href: "/usuarios", etiqueta: "Usuarios", icono: "usuarios" },
  {
    href: "/organizacion",
    etiqueta: "Organización",
    icono: "organizacion",
    permiso: "organizacionEscribir",
  },
  {
    href: "/catalogos",
    etiqueta: "Catálogos",
    icono: "catalogos",
    permiso: "catalogosEscribir",
  },
  { href: "/auditoria", etiqueta: "Auditoría", icono: "auditoria", permiso: "auditoriaVer" },
];

export function navegacionPara(sesion: Sesion | null): ItemNavegacion[] {
  if (!sesion) {
    return [];
  }
  return ITEMS.filter((item) => !item.permiso || puede(sesion, item.permiso));
}

const RUTAS_PROTEGIDAS: Array<{ prefijo: string; permiso: Permiso }> = [
  { prefijo: "/organizacion", permiso: "organizacionEscribir" },
  { prefijo: "/catalogos", permiso: "catalogosEscribir" },
  { prefijo: "/auditoria", permiso: "auditoriaVer" },
];

export function permisoDeRuta(ruta: string): Permiso | null {
  return RUTAS_PROTEGIDAS.find((entrada) => ruta.startsWith(entrada.prefijo))?.permiso ?? null;
}
