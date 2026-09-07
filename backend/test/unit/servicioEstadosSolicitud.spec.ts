import { ServicioEstadosSolicitud } from "../../src/domain/services/servicioEstadosSolicitud";
import { EstadoSolicitud } from "../../src/domain/enums/catalogosDominio";
import { ErrorValidacion } from "../../src/domain/errors/errorDominio";

describe("ServicioEstadosSolicitud", () => {
  const servicio = new ServicioEstadosSolicitud();

  it("reconoce estados vigentes", () => {
    expect(servicio.esEstadoVigente(EstadoSolicitud.PRESENTADA)).toBe(true);
    expect(servicio.esEstadoVigente(EstadoSolicitud.BORRADOR)).toBe(false);
    expect(servicio.esEstadoVigente(EstadoSolicitud.FINALIZADA)).toBe(false);
  });

  it("permite transiciones válidas", () => {
    expect(() =>
      servicio.validarTransicion(EstadoSolicitud.BORRADOR, EstadoSolicitud.PRESENTADA),
    ).not.toThrow();
    expect(() =>
      servicio.validarTransicion(EstadoSolicitud.EN_REVISION, EstadoSolicitud.APROBADA),
    ).not.toThrow();
  });

  it("rechaza transiciones inválidas", () => {
    expect(() =>
      servicio.validarTransicion(EstadoSolicitud.BORRADOR, EstadoSolicitud.ACTIVA),
    ).toThrow(ErrorValidacion);
    expect(() =>
      servicio.validarTransicion(EstadoSolicitud.RECHAZADA, EstadoSolicitud.ACTIVA),
    ).toThrow(ErrorValidacion);
  });
});
