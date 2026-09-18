import { PuertoAutenticacion } from "../../ports/puertosAplicacion";

export class RenovarSesion {
  constructor(private readonly puertoAutenticacion: PuertoAutenticacion) {}

  async ejecutar(tokenRenovacion: string) {
    const sesion = await this.puertoAutenticacion.renovarSesion(tokenRenovacion);
    return {
      tokenAcceso: sesion.tokenAcceso,
      tokenRenovacion: sesion.tokenRenovacion,
      expiraEn: sesion.expiraEn,
    };
  }
}
