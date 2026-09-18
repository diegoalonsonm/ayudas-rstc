import { ErrorApi, mensajeDeError } from "../api/errorApi";

export type Resultado<T = void> =
  | { exito: true; datos: T }
  | { exito: false; mensaje: string; codigo?: string };

export function correcto<T>(datos: T): Resultado<T> {
  return { exito: true, datos };
}

export function fallido(mensaje: string, codigo?: string): Resultado<never> {
  return { exito: false, mensaje, codigo };
}

export async function intentar<T>(operacion: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return correcto(await operacion());
  } catch (error) {
    if (error instanceof ErrorApi) {
      return fallido(error.message, error.codigo);
    }
    return fallido(mensajeDeError(error));
  }
}
