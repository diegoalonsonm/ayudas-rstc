import { cookies } from "next/headers";

export const COOKIE_TOKEN_ACCESO = "rstcTokenAcceso";
export const COOKIE_TOKEN_RENOVACION = "rstcTokenRenovacion";
export const COOKIE_VENCE_EN = "rstcVenceEn";

const DIAS_RENOVACION = 30;
const MARGEN_RENOVACION_SEGUNDOS = 120;

export type TokensSesion = {
  tokenAcceso: string;
  tokenRenovacion: string;
  expiraEn: number;
};

export async function leerTokens(): Promise<{
  tokenAcceso: string | null;
  tokenRenovacion: string | null;
  venceEn: number | null;
}> {
  const almacen = await cookies();
  const venceEnTexto = almacen.get(COOKIE_VENCE_EN)?.value;
  return {
    tokenAcceso: almacen.get(COOKIE_TOKEN_ACCESO)?.value ?? null,
    tokenRenovacion: almacen.get(COOKIE_TOKEN_RENOVACION)?.value ?? null,
    venceEn: venceEnTexto ? Number(venceEnTexto) : null,
  };
}

export async function guardarTokens(tokens: TokensSesion): Promise<void> {
  const almacen = await cookies();
  const opcionesBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  almacen.set(COOKIE_TOKEN_ACCESO, tokens.tokenAcceso, {
    ...opcionesBase,
    maxAge: tokens.expiraEn,
  });
  almacen.set(COOKIE_TOKEN_RENOVACION, tokens.tokenRenovacion, {
    ...opcionesBase,
    maxAge: DIAS_RENOVACION * 24 * 60 * 60,
  });
  almacen.set(COOKIE_VENCE_EN, String(Date.now() + tokens.expiraEn * 1000), {
    ...opcionesBase,
    httpOnly: false,
    maxAge: DIAS_RENOVACION * 24 * 60 * 60,
  });
}

export async function borrarTokens(): Promise<void> {
  const almacen = await cookies();
  almacen.delete(COOKIE_TOKEN_ACCESO);
  almacen.delete(COOKIE_TOKEN_RENOVACION);
  almacen.delete(COOKIE_VENCE_EN);
}

export function tokenEstaPorVencer(venceEn: number | null): boolean {
  if (!venceEn) {
    return false;
  }
  return venceEn - Date.now() < MARGEN_RENOVACION_SEGUNDOS * 1000;
}
