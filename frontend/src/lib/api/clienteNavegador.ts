import { normalizarError, ErrorApi, CodigoError } from "./errorApi";

const BASE_PROXY = "/api/proxy";

export type OpcionesNavegador = {
  metodo?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  cuerpo?: unknown;
  formulario?: FormData;
  parametros?: Record<string, string | undefined>;
};

export async function pedir<T>(ruta: string, opciones: OpcionesNavegador = {}): Promise<T> {
  const cabeceras = new Headers();
  let cuerpo: BodyInit | undefined;
  if (opciones.formulario) {
    cuerpo = opciones.formulario;
  } else if (opciones.cuerpo !== undefined) {
    cabeceras.set("Content-Type", "application/json");
    cuerpo = JSON.stringify(opciones.cuerpo);
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(construirUrl(ruta, opciones.parametros), {
      method: opciones.metodo ?? "GET",
      headers: cabeceras,
      body: cuerpo,
      cache: "no-store",
    });
  } catch {
    throw new ErrorApi("No se pudo contactar el servidor", CodigoError.RED, 503);
  }

  const texto = await respuesta.text();
  const datos = texto ? seguroJson(texto) : null;
  if (!respuesta.ok) {
    const error = normalizarError(respuesta.status, datos);
    if (error.esSesionInvalida && typeof window !== "undefined") {
      window.location.href = "/ingreso";
    }
    throw error;
  }
  return datos as T;
}

export async function cerrarSesionNavegador(): Promise<void> {
  await fetch("/api/sesion", { method: "DELETE" });
}

function construirUrl(ruta: string, parametros?: Record<string, string | undefined>): string {
  const limpia = ruta.startsWith("/") ? ruta : `/${ruta}`;
  const consulta = new URLSearchParams();
  for (const [clave, valor] of Object.entries(parametros ?? {})) {
    if (valor !== undefined && valor !== "") {
      consulta.set(clave, valor);
    }
  }
  const cadena = consulta.toString();
  return `${BASE_PROXY}${limpia}${cadena ? `?${cadena}` : ""}`;
}

function seguroJson(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return { mensaje: texto };
  }
}
