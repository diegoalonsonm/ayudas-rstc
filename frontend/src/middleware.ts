import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_TOKEN_ACCESO, COOKIE_TOKEN_RENOVACION } from "@/lib/sesion/cookies";

const RUTAS_PUBLICAS = ["/ingreso"];

export function middleware(peticion: NextRequest) {
  const { pathname, search } = peticion.nextUrl;
  const tieneSesion =
    Boolean(peticion.cookies.get(COOKIE_TOKEN_ACCESO)?.value) ||
    Boolean(peticion.cookies.get(COOKIE_TOKEN_RENOVACION)?.value);

  if (RUTAS_PUBLICAS.includes(pathname)) {
    if (tieneSesion) {
      return NextResponse.redirect(new URL("/panel", peticion.url));
    }
    return NextResponse.next();
  }

  if (!tieneSesion) {
    const destino = new URL("/ingreso", peticion.url);
    if (pathname !== "/") {
      destino.searchParams.set("volverA", `${pathname}${search}`);
    }
    return NextResponse.redirect(destino);
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/panel", peticion.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
