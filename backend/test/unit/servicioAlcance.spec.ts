import { ActorActual } from "../../src/domain/entities/tiposDominio";
import { CodigoRol } from "../../src/domain/enums/catalogosDominio";
import { ErrorNoAutorizado, ErrorValidacion } from "../../src/domain/errors/errorDominio";
import { ServicioAlcance } from "../../src/domain/services/servicioAlcance";

function actor(parcial: Partial<ActorActual> & { rolCodigo: string }): ActorActual {
  return {
    usuarioId: "u1",
    identidadAutenticacionId: "auth1",
    correo: "a@a.tld",
    nombreCompleto: "A",
    rolId: "r1",
    diocesisId: null,
    vicariaId: null,
    parroquiaId: null,
    tokenAcceso: "t",
    identificadorSesion: null,
    direccionIp: null,
    agenteUsuario: null,
    identificadorSolicitud: "req",
    ...parcial,
  };
}

describe("ServicioAlcance", () => {
  const servicio = new ServicioAlcance();
  const parroquia = {
    id: "p1",
    vicariaId: "v1",
    nombre: "P",
    codigo: "P",
    creadoEn: "",
    creadoPorUsuarioId: null,
    actualizadoEn: "",
    actualizadoPorUsuarioId: null,
    eliminadoEn: null,
    eliminadoPorUsuarioId: null,
    motivoEliminacion: null,
  };
  const vicaria = {
    id: "v1",
    diocesisId: "d1",
    nombre: "V",
    codigo: "V",
    creadoEn: "",
    creadoPorUsuarioId: null,
    actualizadoEn: "",
    actualizadoPorUsuarioId: null,
    eliminadoEn: null,
    eliminadoPorUsuarioId: null,
    motivoEliminacion: null,
  };

  it("da acceso total al administrador", () => {
    expect(
      servicio.parroquiaEstaEnAlcance(
        actor({ rolCodigo: CodigoRol.ADMINISTRADOR }),
        parroquia,
        vicaria,
      ),
    ).toBe(true);
  });

  it("restringe personal pastoral a su parroquia", () => {
    expect(
      servicio.parroquiaEstaEnAlcance(
        actor({ rolCodigo: CodigoRol.PERSONAL_PASTORAL, parroquiaId: "p1" }),
        parroquia,
        vicaria,
      ),
    ).toBe(true);
    expect(
      servicio.parroquiaEstaEnAlcance(
        actor({ rolCodigo: CodigoRol.PERSONAL_PASTORAL, parroquiaId: "otra" }),
        parroquia,
        vicaria,
      ),
    ).toBe(false);
  });

  it("permite auditoría a diocesano y administrador", () => {
    expect(servicio.puedeVerAuditoria(actor({ rolCodigo: CodigoRol.ADMINISTRADOR }))).toBe(true);
    expect(servicio.puedeVerAuditoria(actor({ rolCodigo: CodigoRol.COORDINADOR_DIOCESANO }))).toBe(true);
    expect(servicio.puedeVerAuditoria(actor({ rolCodigo: CodigoRol.PERSONAL_PASTORAL }))).toBe(false);
  });

  it("valida la forma de alcance por rol", () => {
    expect(() =>
      servicio.validarFormaDeAlcance(CodigoRol.ADMINISTRADOR, {
        diocesisId: null,
        vicariaId: null,
        parroquiaId: null,
      }),
    ).not.toThrow();
    expect(() =>
      servicio.validarFormaDeAlcance(CodigoRol.ADMINISTRADOR, {
        diocesisId: "d1",
        vicariaId: null,
        parroquiaId: null,
      }),
    ).not.toThrow();
    expect(() =>
      servicio.validarFormaDeAlcance(CodigoRol.ADMINISTRADOR, {
        diocesisId: null,
        vicariaId: null,
        parroquiaId: "p1",
      }),
    ).not.toThrow();
    expect(() =>
      servicio.validarFormaDeAlcance(CodigoRol.ADMINISTRADOR, {
        diocesisId: "d1",
        vicariaId: null,
        parroquiaId: "p1",
      }),
    ).toThrow(ErrorValidacion);
    expect(() =>
      servicio.exigirParroquiaEnAlcance(
        actor({ rolCodigo: CodigoRol.PERSONAL_PASTORAL, parroquiaId: "otra" }),
        parroquia,
        vicaria,
      ),
    ).toThrow(ErrorNoAutorizado);
  });
});
