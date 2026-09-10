export class ErrorDominio extends Error {
  constructor(
    message: string,
    readonly codigo: string,
    readonly estadoHttp: number,
  ) {
    super(message);
    this.name = "ErrorDominio";
  }
}

export class ErrorNoAutenticado extends ErrorDominio {
  constructor(message = "No autenticado") {
    super(message, "NO_AUTENTICADO", 401);
    this.name = "ErrorNoAutenticado";
  }
}

export class ErrorNoAutorizado extends ErrorDominio {
  constructor(message = "No autorizado") {
    super(message, "NO_AUTORIZADO", 403);
    this.name = "ErrorNoAutorizado";
  }
}

export class ErrorNoEncontrado extends ErrorDominio {
  constructor(message = "Recurso no encontrado") {
    super(message, "NO_ENCONTRADO", 404);
    this.name = "ErrorNoEncontrado";
  }
}

export class ErrorConflicto extends ErrorDominio {
  constructor(message = "Conflicto de negocio") {
    super(message, "CONFLICTO", 409);
    this.name = "ErrorConflicto";
  }
}

export class ErrorValidacion extends ErrorDominio {
  constructor(message = "Datos inválidos") {
    super(message, "VALIDACION", 422);
    this.name = "ErrorValidacion";
  }
}
