export function snakeACamel(valor: string): string {
  return valor.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function camelASnake(valor: string): string {
  return valor.replace(/[A-Z]/g, (letra) => `_${letra.toLowerCase()}`);
}

export function filaACamel<T>(fila: Record<string, unknown> | null): T | null {
  if (!fila) {
    return null;
  }
  const resultado: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(fila)) {
    resultado[snakeACamel(clave)] = valor;
  }
  return resultado as T;
}

export function filasACamel<T>(filas: Record<string, unknown>[]): T[] {
  return filas.map((fila) => filaACamel<T>(fila) as T);
}

export function camelAFila(objeto: Record<string, unknown>): Record<string, unknown> {
  const resultado: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(objeto)) {
    if (valor === undefined) {
      continue;
    }
    resultado[camelASnake(clave)] = valor;
  }
  return resultado;
}
