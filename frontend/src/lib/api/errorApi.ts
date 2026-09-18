export const CodigoError = {
  NO_AUTENTICADO: "NO_AUTENTICADO",
  NO_AUTORIZADO: "NO_AUTORIZADO",
  NO_ENCONTRADO: "NO_ENCONTRADO",
  CONFLICTO: "CONFLICTO",
  VALIDACION: "VALIDACION",
  HTTP: "HTTP",
  INTERNO: "INTERNO",
  RED: "RED",
} as const;

export type CodigoError = (typeof CodigoError)[keyof typeof CodigoError];

export class ErrorApi extends Error {
  readonly codigo: CodigoError;
  readonly estado: number;

  constructor(mensaje: string, codigo: CodigoError, estado: number) {
    super(mensaje);
    this.name = "ErrorApi";
    this.codigo = codigo;
    this.estado = estado;
  }

  get esSesionInvalida(): boolean {
    return this.codigo === CodigoError.NO_AUTENTICADO;
  }

  get esFaltaDePermiso(): boolean {
    return this.codigo === CodigoError.NO_AUTORIZADO;
  }
}

export function normalizarError(estado: number, cuerpo: unknown): ErrorApi {
  const datos = (cuerpo ?? {}) as { codigo?: string; mensaje?: string; message?: string };
  const codigo = reconocerCodigo(datos.codigo, estado);
  const mensaje = datos.mensaje ?? datos.message ?? mensajePorEstado(estado);
  return new ErrorApi(mensaje, codigo, estado);
}

export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorApi) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado";
}

function reconocerCodigo(codigo: string | undefined, estado: number): CodigoError {
  if (codigo && codigo in CodigoError) {
    return codigo as CodigoError;
  }
  return codigoPorEstado(estado);
}

function codigoPorEstado(estado: number): CodigoError {
  if (estado === 401) return CodigoError.NO_AUTENTICADO;
  if (estado === 403) return CodigoError.NO_AUTORIZADO;
  if (estado === 404) return CodigoError.NO_ENCONTRADO;
  if (estado === 409) return CodigoError.CONFLICTO;
  if (estado === 422) return CodigoError.VALIDACION;
  if (estado === 400) return CodigoError.HTTP;
  return CodigoError.INTERNO;
}

function mensajePorEstado(estado: number): string {
  if (estado === 401) return "La sesión no es válida o expiró";
  if (estado === 403) return "Su rol no permite esta operación";
  if (estado === 404) return "El recurso no existe o está fuera de su alcance";
  if (estado === 409) return "La operación entra en conflicto con datos existentes";
  if (estado === 422) return "Los datos enviados no son válidos";
  if (estado === 400) return "La solicitud contiene campos no aceptados";
  return "Error interno del servidor";
}
