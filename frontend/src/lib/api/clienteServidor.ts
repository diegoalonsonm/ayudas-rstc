import "server-only";
import { ErrorApi, CodigoError, normalizarError } from "./errorApi";
import {
  borrarTokens,
  guardarTokens,
  leerTokens,
  tokenEstaPorVencer,
  type TokensSesion,
} from "../sesion/cookies";

export type OpcionesSolicitud = {
  metodo?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  cuerpo?: unknown;
  formulario?: FormData;
  parametros?: Record<string, string | undefined>;
  sinAutenticacion?: boolean;
  revalidar?: number | false;
  etiquetas?: string[];
};

function leerVariableEntorno(nombre: string): string | undefined {
  const valor = process.env[nombre];
  if (!valor) {
    return undefined;
  }
  const limpio = valor.trim();
  return limpio.length > 0 ? limpio : undefined;
}

export function urlBaseApi(): string {
  const explicita = leerVariableEntorno("URL_API_BACKEND");
  if (explicita) {
    return explicita.replace(/\/$/, "");
  }
  const servicio = leerVariableEntorno("URL_SERVICIO_BACKEND");
  if (servicio) {
    return `${servicio.replace(/\/$/, "")}/api/v1`;
  }
  throw new ErrorApi(
    "Falta la variable URL_API_BACKEND; copie frontend/.env.example a frontend/.env",
    CodigoError.INTERNO,
    500,
  );
}

export async function solicitar<T>(ruta: string, opciones: OpcionesSolicitud = {}): Promise<T> {
  const tokenInicial = opciones.sinAutenticacion ? null : await tokenVigente();
  const primera = await ejecutar(ruta, opciones, tokenInicial);
  if (primera.status !== 401 || opciones.sinAutenticacion) {
    return await interpretar<T>(primera);
  }
  const renovado = await renovarTokens();
  if (!renovado) {
    await olvidarSesion();
    throw new ErrorApi("La sesión expiró; vuelva a ingresar", CodigoError.NO_AUTENTICADO, 401);
  }
  const segunda = await ejecutar(ruta, opciones, renovado.tokenAcceso);
  return await interpretar<T>(segunda);
}

export async function haySesionEnCookies(): Promise<boolean> {
  const { tokenAcceso, tokenRenovacion } = await leerTokens();
  return Boolean(tokenAcceso ?? tokenRenovacion);
}

export async function olvidarSesion(): Promise<void> {
  try {
    await borrarTokens();
  } catch {
    return;
  }
}

export async function iniciarSesionApi(
  correo: string,
  contrasena: string,
): Promise<{ tokens: TokensSesion; datos: unknown }> {
  const respuesta = await ejecutar(
    "/auth/sesiones",
    { metodo: "POST", cuerpo: { correo, contrasena }, sinAutenticacion: true },
    null,
  );
  const datos = await interpretar<{
    tokenAcceso: string;
    tokenRenovacion: string;
    expiraEn: number;
  }>(respuesta);
  return {
    tokens: {
      tokenAcceso: datos.tokenAcceso,
      tokenRenovacion: datos.tokenRenovacion,
      expiraEn: datos.expiraEn,
    },
    datos,
  };
}

export async function cerrarSesionApi(): Promise<void> {
  const token = await tokenVigente();
  if (!token) {
    return;
  }
  try {
    await ejecutar("/auth/sesiones", { metodo: "DELETE" }, token);
  } catch {
    return;
  }
}

export async function obtenerTokenVigente(): Promise<string | null> {
  return await tokenVigente();
}

export async function renovarSesionApi(): Promise<TokensSesion | null> {
  return await renovarTokens();
}

async function tokenVigente(): Promise<string | null> {
  const { tokenAcceso, tokenRenovacion, venceEn } = await leerTokens();
  if (tokenAcceso && !tokenEstaPorVencer(venceEn)) {
    return tokenAcceso;
  }
  if (!tokenRenovacion) {
    return tokenAcceso;
  }
  const renovado = await renovarTokens();
  return renovado?.tokenAcceso ?? tokenAcceso;
}

async function renovarTokens(): Promise<TokensSesion | null> {
  const { tokenRenovacion } = await leerTokens();
  if (!tokenRenovacion) {
    return null;
  }
  const respuesta = await ejecutar(
    "/auth/sesiones/renovacion",
    { metodo: "POST", cuerpo: { tokenRenovacion }, sinAutenticacion: true },
    null,
  );
  if (!respuesta.ok) {
    return null;
  }
  const datos = (await respuesta.json()) as TokensSesion;
  if (!datos?.tokenAcceso) {
    return null;
  }
  await persistirTokens(datos);
  return datos;
}

async function persistirTokens(tokens: TokensSesion): Promise<void> {
  try {
    await guardarTokens(tokens);
  } catch {
    return;
  }
}

async function ejecutar(
  ruta: string,
  opciones: OpcionesSolicitud,
  token: string | null,
): Promise<Response> {
  const cabeceras = new Headers();
  if (token) {
    cabeceras.set("Authorization", `Bearer ${token}`);
  }
  let cuerpo: BodyInit | undefined;
  if (opciones.formulario) {
    cuerpo = opciones.formulario;
  } else if (opciones.cuerpo !== undefined) {
    cabeceras.set("Content-Type", "application/json");
    cuerpo = JSON.stringify(opciones.cuerpo);
  }
  const metodo = opciones.metodo ?? "GET";
  const cache =
    metodo === "GET" && opciones.revalidar !== false
      ? { next: { revalidate: opciones.revalidar ?? 0, tags: opciones.etiquetas } }
      : { cache: "no-store" as const };

  const destino = construirUrl(ruta, opciones.parametros);
  try {
    return await fetch(destino, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo,
      ...cache,
    });
  } catch (error) {
    if (error instanceof ErrorApi) {
      throw error;
    }
    throw new ErrorApi(
      "No se pudo contactar la API; verifique que el backend esté en ejecución",
      CodigoError.RED,
      503,
    );
  }
}

function construirUrl(ruta: string, parametros?: Record<string, string | undefined>): string {
  const url = new URL(`${urlBaseApi()}${ruta.startsWith("/") ? ruta : `/${ruta}`}`);
  for (const [clave, valor] of Object.entries(parametros ?? {})) {
    if (valor !== undefined && valor !== "") {
      url.searchParams.set(clave, valor);
    }
  }
  return url.toString();
}

async function interpretar<T>(respuesta: Response): Promise<T> {
  const texto = await respuesta.text();
  const datos = texto ? seguroJson(texto) : null;
  if (!respuesta.ok) {
    throw normalizarError(respuesta.status, datos);
  }
  return datos as T;
}

function seguroJson(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return { mensaje: texto };
  }
}
