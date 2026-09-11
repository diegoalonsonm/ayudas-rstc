import { NextResponse } from "next/server";
import {
  obtenerTokenVigente,
  olvidarSesion,
  renovarSesionApi,
  urlBaseApi,
} from "@/lib/api/clienteServidor";

type Contexto = { params: Promise<{ ruta: string[] }> };

const CABECERAS_A_REENVIAR = ["content-type", "accept"];

export async function GET(peticion: Request, contexto: Contexto) {
  return await reenviar(peticion, contexto);
}

export async function POST(peticion: Request, contexto: Contexto) {
  return await reenviar(peticion, contexto);
}

export async function PATCH(peticion: Request, contexto: Contexto) {
  return await reenviar(peticion, contexto);
}

export async function PUT(peticion: Request, contexto: Contexto) {
  return await reenviar(peticion, contexto);
}

export async function DELETE(peticion: Request, contexto: Contexto) {
  return await reenviar(peticion, contexto);
}

async function reenviar(peticion: Request, contexto: Contexto): Promise<Response> {
  const { ruta } = await contexto.params;
  const destino = construirDestino(peticion, ruta);
  const cuerpo =
    peticion.method === "GET" || peticion.method === "HEAD"
      ? undefined
      : await peticion.arrayBuffer();

  const token = await obtenerTokenVigente();
  if (!token) {
    return NextResponse.json(
      { codigo: "NO_AUTENTICADO", mensaje: "La sesión expiró; vuelva a ingresar" },
      { status: 401 },
    );
  }

  let respuesta = await llamar(destino, peticion, cuerpo, token);
  if (respuesta.status === 401) {
    const renovado = await renovarSesionApi();
    if (!renovado) {
      await olvidarSesion();
      return NextResponse.json(
        { codigo: "NO_AUTENTICADO", mensaje: "La sesión expiró; vuelva a ingresar" },
        { status: 401 },
      );
    }
    respuesta = await llamar(destino, peticion, cuerpo, renovado.tokenAcceso);
  }

  const salida = new Headers();
  const tipo = respuesta.headers.get("content-type");
  if (tipo) {
    salida.set("content-type", tipo);
  }
  salida.set("cache-control", "no-store");
  return new NextResponse(respuesta.body, { status: respuesta.status, headers: salida });
}

function construirDestino(peticion: Request, ruta: string[]): string {
  const consulta = new URL(peticion.url).search;
  const segmentos = ruta.map((segmento) => encodeURIComponent(segmento)).join("/");
  return `${urlBaseApi()}/${segmentos}${consulta}`;
}

async function llamar(
  destino: string,
  peticion: Request,
  cuerpo: ArrayBuffer | undefined,
  token: string,
): Promise<Response> {
  const cabeceras = new Headers();
  for (const nombre of CABECERAS_A_REENVIAR) {
    const valor = peticion.headers.get(nombre);
    if (valor) {
      cabeceras.set(nombre, valor);
    }
  }
  cabeceras.set("Authorization", `Bearer ${token}`);
  try {
    return await fetch(destino, {
      method: peticion.method,
      headers: cabeceras,
      body: cuerpo,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { codigo: "RED", mensaje: "No se pudo contactar la API" },
      { status: 503 },
    );
  }
}
