export const PUERTO_AUTENTICACION = "PUERTO_AUTENTICACION";
export const PUERTO_ALMACENAMIENTO = "PUERTO_ALMACENAMIENTO";
export const SERVICIO_CIFRADO = "SERVICIO_CIFRADO";

export type ResultadoSesionAuth = {
  tokenAcceso: string;
  tokenRenovacion: string;
  expiraEn: number;
  usuarioAuthId: string;
  identificadorSesion: string | null;
};

export type TokenVerificado = {
  sub: string;
  identificadorSesion: string | null;
};

export interface PuertoAutenticacion {
  iniciarSesion(correo: string, contrasena: string): Promise<ResultadoSesionAuth>;
  cerrarSesion(tokenAcceso: string): Promise<void>;
  renovarSesion(tokenRenovacion: string): Promise<ResultadoSesionAuth>;
  crearIdentidad(correo: string, contrasena: string, nombreCompleto: string): Promise<string>;
  verificarToken(tokenAcceso: string): Promise<TokenVerificado>;
}

export type ArchivoCargado = {
  buffer: Buffer;
  nombreOriginal: string;
  tipoMime: string;
  tamanoBytes: number;
};

export interface PuertoAlmacenamiento {
  subirConsentimiento(claveObjeto: string, archivo: ArchivoCargado): Promise<void>;
  crearUrlFirmada(claveObjeto: string, segundos: number): Promise<string>;
}
