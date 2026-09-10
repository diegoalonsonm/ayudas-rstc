import { ActorActual, Parroquia, Vicaria } from "../../src/domain/entities/tiposDominio";
import { CodigoRol } from "../../src/domain/enums/catalogosDominio";
import { ErrorNoAutorizado } from "../../src/domain/errors/errorDominio";
import { ServicioCreacionUsuarios } from "../../src/domain/services/servicioCreacionUsuarios";

function actor(parcial: Partial<ActorActual> & { rolCodigo: string }): ActorActual {
  return {
    usuarioId: "u1",
    identidadAutenticacionId: "auth1",
    correo: "a@a.tld",
    nombreCompleto: "A",
    rolId: "r1",
    diocesisId: "d1",
    vicariaId: "v1",
    parroquiaId: "p1",
    tokenAcceso: "t",
    identificadorSesion: null,
    direccionIp: null,
    agenteUsuario: null,
    identificadorSolicitud: "req",
    ...parcial,
  };
}

const parroquia: Parroquia = {
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

const vicaria: Vicaria = {
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

describe("ServicioCreacionUsuarios", () => {
  const servicio = new ServicioCreacionUsuarios();

  it("define el rol que cada actor puede crear", () => {
    expect(servicio.rolPermitidoParaCrear(CodigoRol.PERSONAL_PASTORAL)).toBe(
      CodigoRol.PERSONAL_PASTORAL,
    );
    expect(servicio.rolPermitidoParaCrear(CodigoRol.COORDINADOR_PARROQUIAL)).toBe(
      CodigoRol.PERSONAL_PASTORAL,
    );
    expect(servicio.rolPermitidoParaCrear(CodigoRol.COORDINADOR_VICARIAL)).toBe(
      CodigoRol.COORDINADOR_PARROQUIAL,
    );
    expect(servicio.rolPermitidoParaCrear(CodigoRol.COORDINADOR_DIOCESANO)).toBe(
      CodigoRol.COORDINADOR_VICARIAL,
    );
    expect(servicio.rolPermitidoParaCrear(CodigoRol.ADMINISTRADOR)).toBeNull();
  });

  it("impide autoasignación", () => {
    expect(() => servicio.validarCambioPropio(actor({ rolCodigo: CodigoRol.ADMINISTRADOR }), "u1")).toThrow(
      ErrorNoAutorizado,
    );
  });

  it("impide que pastoral cree un coordinador", () => {
    expect(() =>
      servicio.validarCreacion(
        actor({ rolCodigo: CodigoRol.PERSONAL_PASTORAL, parroquiaId: "p1" }),
        CodigoRol.COORDINADOR_PARROQUIAL,
        { diocesisId: null, vicariaId: null, parroquiaId: "p1" },
        null,
        parroquia,
        vicaria,
      ),
    ).toThrow(ErrorNoAutorizado);
  });

  it("permite al administrador crear un administrador de una parroquia", () => {
    expect(() =>
      servicio.validarCreacion(
        actor({ rolCodigo: CodigoRol.ADMINISTRADOR, parroquiaId: null, vicariaId: null, diocesisId: null }),
        CodigoRol.ADMINISTRADOR,
        { diocesisId: null, vicariaId: null, parroquiaId: "p1" },
        "auth-nuevo",
        parroquia,
        vicaria,
      ),
    ).not.toThrow();
  });

  it("permite al coordinador parroquial crear pastoral de su parroquia", () => {
    expect(() =>
      servicio.validarCreacion(
        actor({ rolCodigo: CodigoRol.COORDINADOR_PARROQUIAL, parroquiaId: "p1" }),
        CodigoRol.PERSONAL_PASTORAL,
        { diocesisId: null, vicariaId: null, parroquiaId: "p1" },
        "auth-nuevo",
        parroquia,
        vicaria,
      ),
    ).not.toThrow();
  });
});
