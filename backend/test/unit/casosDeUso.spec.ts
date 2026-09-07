import { IniciarSesion } from "../../src/application/useCases/auth/iniciarSesion";
import { CambiarEstadoSolicitud, RegistrarSolicitud } from "../../src/application/useCases/solicitudes/gestionarSolicitudes";
import { CrearUsuario } from "../../src/application/useCases/usuarios/gestionarUsuarios";
import { ActorActual, AsignacionUsuario, Usuario } from "../../src/domain/entities/tiposDominio";
import { CodigoRol } from "../../src/domain/enums/catalogosDominio";
import { ErrorNoAutenticado, ErrorNoAutorizado } from "../../src/domain/errors/errorDominio";

const actor: ActorActual = {
  usuarioId: "u1",
  identidadAutenticacionId: "auth1",
  correo: "coord@local",
  nombreCompleto: "Coord",
  rolCodigo: CodigoRol.COORDINADOR_PARROQUIAL,
  rolId: "r1",
  diocesisId: null,
  vicariaId: null,
  parroquiaId: "p1",
  tokenAcceso: "t",
  identificadorSesion: "s",
  direccionIp: null,
  agenteUsuario: null,
  identificadorSolicitud: "req",
};

describe("IniciarSesion", () => {
  it("rechaza usuario inactivo", async () => {
    const puerto = {
      iniciarSesion: jest.fn().mockResolvedValue({
        tokenAcceso: "a",
        tokenRenovacion: "r",
        expiraEn: 1,
        usuarioAuthId: "auth1",
        identificadorSesion: "s",
      }),
    };
    const usuarios = {
      obtenerPorIdentidadAutenticacion: jest.fn().mockResolvedValue({
        id: "u1",
        activo: false,
        eliminadoEn: null,
      }),
    };
    const auditoria = { registrar: jest.fn().mockResolvedValue(undefined) };
    const caso = new IniciarSesion(puerto as never, usuarios as never, auditoria as never);
    await expect(
      caso.ejecutar("a@a.tld", "secret12", {
        direccionIp: null,
        agenteUsuario: null,
        identificadorSolicitud: "x",
      }),
    ).rejects.toBeInstanceOf(ErrorNoAutenticado);
    expect(auditoria.registrar).toHaveBeenCalled();
  });
});

describe("RegistrarSolicitud", () => {
  it("exige parroquia en alcance", async () => {
    const solicitudes = { registrarConAyudas: jest.fn() };
    const organizacion = {
      obtenerParroquia: jest.fn().mockResolvedValue({ id: "p2", vicariaId: "v1" }),
      obtenerVicaria: jest.fn().mockResolvedValue({ id: "v1", diocesisId: "d1" }),
    };
    const caso = new RegistrarSolicitud(solicitudes as never, organizacion as never);
    await expect(
      caso.ejecutar(actor, {
        personaSolicitanteId: "pe1",
        parroquiaReceptoraId: "p2",
        sectorOficial: null,
        fechaEntrevista: null,
        fechaVisita: null,
        observaciones: null,
        tiposAyuda: ["t1"],
        detalles: null,
        estado: "BORRADOR",
      }),
    ).rejects.toBeInstanceOf(ErrorNoAutorizado);
    expect(solicitudes.registrarConAyudas).not.toHaveBeenCalled();
  });
});

describe("CambiarEstadoSolicitud", () => {
  it("rechaza una transición inválida", async () => {
    const solicitudes = {
      obtenerPorId: jest.fn().mockResolvedValue({ id: "s1", estado: "BORRADOR" }),
      actualizar: jest.fn(),
    };
    const auditoria = { registrar: jest.fn() };
    const caso = new CambiarEstadoSolicitud(solicitudes as never, auditoria as never);
    await expect(caso.ejecutar(actor, "s1", "ACTIVA", null)).rejects.toThrow();
    expect(solicitudes.actualizar).not.toHaveBeenCalled();
  });
});

describe("CrearUsuario", () => {
  it("impide crear un rol superior al permitido", async () => {
    const auth = { crearIdentidad: jest.fn() };
    const usuarios = {};
    const organizacion = {
      obtenerParroquia: jest.fn().mockResolvedValue({ id: "p1", vicariaId: "v1" }),
      obtenerVicaria: jest.fn().mockResolvedValue({ id: "v1", diocesisId: "d1" }),
    };
    const auditoria = { registrar: jest.fn() };
    const caso = new CrearUsuario(auth as never, usuarios as never, organizacion as never, auditoria as never);
    await expect(
      caso.ejecutar(actor, {
        nombreCompleto: "N",
        correo: "n@n.tld",
        contrasena: "secret123",
        rolCodigo: CodigoRol.ADMINISTRADOR,
        diocesisId: null,
        vicariaId: null,
        parroquiaId: null,
        motivo: null,
      }),
    ).rejects.toBeInstanceOf(ErrorNoAutorizado);
    expect(auth.crearIdentidad).not.toHaveBeenCalled();
  });
});

describe("tipos de apoyo a tests", () => {
  it("mantiene formas de usuario y asignación", () => {
    const usuario: Usuario = {
      id: "u",
      identidadAutenticacionId: "a",
      nombreCompleto: "N",
      correo: "n@n.tld",
      activo: true,
      ultimoAccesoEn: null,
      creadoEn: "",
      creadoPorUsuarioId: null,
      actualizadoEn: "",
      actualizadoPorUsuarioId: null,
      eliminadoEn: null,
      eliminadoPorUsuarioId: null,
      motivoEliminacion: null,
    };
    const asignacion: AsignacionUsuario = {
      id: "as",
      usuarioId: "u",
      rolId: "r",
      diocesisId: null,
      vicariaId: null,
      parroquiaId: "p1",
      vigenteDesde: "",
      vigenteHasta: null,
      creadoEn: "",
      creadoPorUsuarioId: null,
      actualizadoEn: "",
      actualizadoPorUsuarioId: null,
      eliminadoEn: null,
      eliminadoPorUsuarioId: null,
      motivoEliminacion: null,
    };
    expect(usuario.activo).toBe(true);
    expect(asignacion.parroquiaId).toBe("p1");
  });
});
