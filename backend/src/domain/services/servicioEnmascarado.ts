const CLAVES_SENSIBLES = [
  "numeroDocumentoCifrado",
  "numeroDocumentoHash",
  "telefono",
  "senas",
  "correo",
  "identidadAutenticacionId",
  "identificadorSesion",
  "claveObjeto",
  "sumaVerificacion",
  "direccionIp",
  "agenteUsuario",
  "contrasena",
  "tokenAcceso",
  "tokenRenovacion",
];

export class ServicioEnmascarado {
  enmascarar(datos: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!datos) {
      return null;
    }
    const resultado: Record<string, unknown> = { ...datos };
    for (const clave of CLAVES_SENSIBLES) {
      if (clave in resultado && resultado[clave] !== undefined && resultado[clave] !== null) {
        resultado[clave] = "[redactado]";
      }
    }
    return resultado;
  }
}
