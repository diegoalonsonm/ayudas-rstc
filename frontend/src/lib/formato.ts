const FORMATO_FECHA = new Intl.DateTimeFormat("es-CR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Costa_Rica",
});

const FORMATO_FECHA_HORA = new Intl.DateTimeFormat("es-CR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Costa_Rica",
});

const FORMATO_COLONES = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

export function formatearFecha(valor: string | null | undefined): string {
  if (!valor) {
    return "—";
  }
  const fecha = interpretarFecha(valor);
  return fecha ? FORMATO_FECHA.format(fecha) : "—";
}

export function formatearFechaHora(valor: string | null | undefined): string {
  if (!valor) {
    return "—";
  }
  const fecha = interpretarFecha(valor);
  return fecha ? FORMATO_FECHA_HORA.format(fecha) : "—";
}

export function formatearMonto(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return "—";
  }
  return FORMATO_COLONES.format(valor);
}

export function formatearTamano(bytes: number | null | undefined): string {
  if (!bytes) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} kB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fechaDeHoy(): string {
  const ahora = new Date();
  const desplazado = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
  return desplazado.toISOString().slice(0, 10);
}

export function nombreCompletoPersona(persona: {
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
}): string {
  return [
    persona.primerNombre,
    persona.segundoNombre,
    persona.primerApellido,
    persona.segundoApellido,
  ]
    .filter(Boolean)
    .join(" ");
}

export function textoOGuion(valor: string | null | undefined): string {
  const limpio = valor?.trim();
  return limpio ? limpio : "—";
}

export function siONo(valor: boolean | null | undefined): string {
  if (valor === null || valor === undefined) {
    return "—";
  }
  return valor ? "Sí" : "No";
}

function interpretarFecha(valor: string): Date | null {
  const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(valor);
  const fecha = new Date(soloFecha ? `${valor}T12:00:00Z` : valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}
