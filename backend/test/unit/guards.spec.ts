import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AutenticacionGuard } from "../../src/presentation/http/guards/autenticacionGuard";
import { RolesGuard } from "../../src/presentation/http/guards/rolesGuard";
import { ErrorNoAutenticado, ErrorNoAutorizado } from "../../src/domain/errors/errorDominio";
import { CodigoRol } from "../../src/domain/enums/catalogosDominio";
import { ACTOR_REQUEST } from "../../src/presentation/http/decorators/decoradoresHttp";

function contexto(request: Record<string, unknown>, handler: object = {}): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => class {},
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

describe("AutenticacionGuard", () => {
  it("omite rutas públicas", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) };
    const guard = new AutenticacionGuard(reflector as unknown as Reflector, {} as never, {} as never);
    await expect(guard.canActivate(contexto({}))).resolves.toBe(true);
  });

  it("rechaza ausencia de bearer", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    const guard = new AutenticacionGuard(reflector as unknown as Reflector, {} as never, {} as never);
    await expect(guard.canActivate(contexto({ headers: {} }))).rejects.toBeInstanceOf(ErrorNoAutenticado);
  });

  it("rechaza token inválido", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    const puerto = {
      verificarToken: jest.fn().mockRejectedValue(new ErrorNoAutenticado("Token inválido")),
    };
    const guard = new AutenticacionGuard(
      reflector as unknown as Reflector,
      puerto as never,
      {} as never,
    );
    await expect(
      guard.canActivate(contexto({ headers: { authorization: "Bearer x" } })),
    ).rejects.toBeInstanceOf(ErrorNoAutenticado);
  });
});

describe("RolesGuard", () => {
  it("permite si no hay roles requeridos", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) };
    const guard = new RolesGuard(reflector as unknown as Reflector);
    expect(guard.canActivate(contexto({}))).toBe(true);
  });

  it("rechaza rol insuficiente", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue([CodigoRol.ADMINISTRADOR]) };
    const guard = new RolesGuard(reflector as unknown as Reflector);
    expect(() =>
      guard.canActivate(
        contexto({ [ACTOR_REQUEST]: { rolCodigo: CodigoRol.PERSONAL_PASTORAL } }),
      ),
    ).toThrow(ErrorNoAutorizado);
  });
});

describe("AlcanceGuard", () => {
  it("rechaza parroquia fuera de alcance", async () => {
    const { AlcanceGuard } = await import("../../src/presentation/http/guards/alcanceGuard");
    const organizacion = {
      obtenerParroquia: jest.fn().mockResolvedValue({ id: "p2", vicariaId: "v1" }),
      obtenerVicaria: jest.fn().mockResolvedValue({ id: "v1", diocesisId: "d1" }),
    };
    const moduleRef = {
      registerRequestByContextId: jest.fn(),
      resolve: jest.fn().mockResolvedValue(organizacion),
    };
    const guard = new AlcanceGuard(moduleRef as never);
    await expect(
      guard.canActivate(
        contexto({
          [ACTOR_REQUEST]: {
            rolCodigo: CodigoRol.PERSONAL_PASTORAL,
            parroquiaId: "p1",
          },
          body: { parroquiaReceptoraId: "p2" },
        }),
      ),
    ).rejects.toBeInstanceOf(ErrorNoAutorizado);
  });
});
