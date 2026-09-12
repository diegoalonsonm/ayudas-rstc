import { CodigoRol } from "../dominio/enums";
import type { Diocesis, Parroquia, Sesion, Vicaria } from "../dominio/tipos";

export type Alcance = {
  diocesisId: string | null;
  vicariaId: string | null;
  parroquiaId: string | null;
};

export type NivelAlcance = "diocesis" | "vicaria" | "parroquia" | "ninguno";

export function nivelRequerido(rolCodigo: CodigoRol): NivelAlcance {
  if (
    rolCodigo === CodigoRol.PERSONAL_PASTORAL ||
    rolCodigo === CodigoRol.COORDINADOR_PARROQUIAL
  ) {
    return "parroquia";
  }
  if (rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
    return "vicaria";
  }
  if (rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
    return "diocesis";
  }
  return "ninguno";
}

export function validarFormaDeAlcance(rolCodigo: CodigoRol, alcance: Alcance): string | null {
  if (
    rolCodigo === CodigoRol.PERSONAL_PASTORAL ||
    rolCodigo === CodigoRol.COORDINADOR_PARROQUIAL
  ) {
    if (!alcance.parroquiaId || alcance.vicariaId || alcance.diocesisId) {
      return `El rol ${rolCodigo} requiere una parroquia y no admite vicaría ni diócesis`;
    }
    return null;
  }
  if (rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
    if (!alcance.vicariaId || alcance.parroquiaId || alcance.diocesisId) {
      return "El rol COORDINADOR_VICARIAL requiere una vicaría y no admite parroquia ni diócesis";
    }
    return null;
  }
  if (rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
    if (!alcance.diocesisId || alcance.vicariaId || alcance.parroquiaId) {
      return "El rol COORDINADOR_DIOCESANO requiere una diócesis y no admite vicaría ni parroquia";
    }
    return null;
  }
  if (rolCodigo === CodigoRol.ADMINISTRADOR) {
    const niveles = [alcance.diocesisId, alcance.vicariaId, alcance.parroquiaId].filter(Boolean);
    if (niveles.length > 1) {
      return "El rol ADMINISTRADOR admite a lo sumo un nivel de alcance territorial";
    }
    return null;
  }
  return `Rol no contemplado: ${rolCodigo}`;
}

export function parroquiaEstaEnAlcance(
  sesion: Sesion,
  parroquia: Parroquia,
  vicaria: Vicaria | undefined,
): boolean {
  if (sesion.rolCodigo === CodigoRol.ADMINISTRADOR) {
    return true;
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
    return Boolean(vicaria) && sesion.diocesisId === vicaria?.diocesisId;
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
    return sesion.vicariaId === parroquia.vicariaId;
  }
  return sesion.parroquiaId === parroquia.id;
}

export function parroquiasAccesibles(
  sesion: Sesion,
  parroquias: Parroquia[],
  vicarias: Vicaria[],
): Parroquia[] {
  const porId = new Map(vicarias.map((vicaria) => [vicaria.id, vicaria]));
  return parroquias.filter((parroquia) =>
    parroquiaEstaEnAlcance(sesion, parroquia, porId.get(parroquia.vicariaId)),
  );
}

export function vicariasAccesibles(
  sesion: Sesion,
  vicarias: Vicaria[],
  parroquias: Parroquia[],
): Vicaria[] {
  if (sesion.rolCodigo === CodigoRol.ADMINISTRADOR) {
    return vicarias;
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
    return vicarias.filter((vicaria) => vicaria.diocesisId === sesion.diocesisId);
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
    return vicarias.filter((vicaria) => vicaria.id === sesion.vicariaId);
  }
  const propia = parroquias.find((parroquia) => parroquia.id === sesion.parroquiaId);
  return vicarias.filter((vicaria) => vicaria.id === propia?.vicariaId);
}

export function parroquiasParaCrearUsuario(
  sesion: Sesion,
  parroquias: Parroquia[],
  vicarias: Vicaria[],
): Parroquia[] {
  if (sesion.rolCodigo === CodigoRol.ADMINISTRADOR) {
    return parroquias;
  }
  if (
    sesion.rolCodigo === CodigoRol.PERSONAL_PASTORAL ||
    sesion.rolCodigo === CodigoRol.COORDINADOR_PARROQUIAL
  ) {
    return parroquias.filter((parroquia) => parroquia.id === sesion.parroquiaId);
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
    return parroquias.filter((parroquia) => parroquia.vicariaId === sesion.vicariaId);
  }
  return parroquiasAccesibles(sesion, parroquias, vicarias);
}

export function diocesisParaCrearUsuario(sesion: Sesion, diocesis: Diocesis[]): Diocesis[] {
  if (sesion.rolCodigo === CodigoRol.ADMINISTRADOR) {
    return diocesis;
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
    return diocesis.filter((item) => item.id === sesion.diocesisId);
  }
  return [];
}

export function vicariasParaCrearUsuario(sesion: Sesion, vicarias: Vicaria[]): Vicaria[] {
  if (sesion.rolCodigo === CodigoRol.ADMINISTRADOR) {
    return vicarias;
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_DIOCESANO) {
    return vicarias.filter((vicaria) => vicaria.diocesisId === sesion.diocesisId);
  }
  if (sesion.rolCodigo === CodigoRol.COORDINADOR_VICARIAL) {
    return vicarias.filter((vicaria) => vicaria.id === sesion.vicariaId);
  }
  return [];
}

function conEtiquetaSiFalta(etiqueta: string, nombre: string): string {
  const recortado = nombre.trim();
  if (recortado.toLocaleLowerCase("es").startsWith(etiqueta.toLocaleLowerCase("es"))) {
    return recortado;
  }
  return `${etiqueta} ${recortado}`;
}

export function describirAlcance(
  alcance: Alcance,
  nombres: {
    diocesis: Map<string, string>;
    vicarias: Map<string, string>;
    parroquias: Map<string, string>;
  },
): string {
  if (alcance.parroquiaId) {
    const nombre = nombres.parroquias.get(alcance.parroquiaId) ?? alcance.parroquiaId;
    return conEtiquetaSiFalta("Parroquia", nombre);
  }
  if (alcance.vicariaId) {
    const nombre = nombres.vicarias.get(alcance.vicariaId) ?? alcance.vicariaId;
    return conEtiquetaSiFalta("Vicaría", nombre);
  }
  if (alcance.diocesisId) {
    const nombre = nombres.diocesis.get(alcance.diocesisId) ?? alcance.diocesisId;
    return conEtiquetaSiFalta("Diócesis", nombre);
  }
  return "Alcance diocesano completo";
}
