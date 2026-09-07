import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { SERVICIO_CIFRADO } from "../../../application/ports/puertosAplicacion";
import {
  ActualizarDireccion,
  ActualizarPersona,
  BuscarProcesosVigentes,
  CrearDireccion,
  CrearPersona,
  ListarDirecciones,
  ListarPersonas,
  ObtenerPersona,
} from "../../../application/useCases/personas/gestionarPersonas";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import {
  REPOSITORIO_AUDITORIA,
  REPOSITORIO_PERSONAS,
  RepositorioAuditoria,
  RepositorioPersonas,
} from "../../../domain/repositories/contratosRepositorio";
import { ServicioCifrado } from "../../../domain/services/servicioCifrado";
import { Actor } from "../decorators/actorActual";
import { BuscarPersonaDto, CrearDireccionDto, CrearPersonaDto } from "../dto/dtosHttp";

@Controller("personas")
export class PersonasController {
  constructor(
    @Inject(REPOSITORIO_PERSONAS) private readonly repositorioPersonas: RepositorioPersonas,
    @Inject(SERVICIO_CIFRADO) private readonly servicioCifrado: ServicioCifrado,
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  @Get()
  listar() {
    return new ListarPersonas(this.repositorioPersonas).ejecutar();
  }

  @Post("busquedas")
  buscar(@Actor() actor: ActorActual, @Body() dto: BuscarPersonaDto) {
    return new BuscarProcesosVigentes(
      this.repositorioPersonas,
      this.servicioCifrado,
      this.repositorioAuditoria,
    ).ejecutar(actor, dto.numeroDocumento);
  }

  @Get(":id")
  obtener(@Param("id") id: string) {
    return new ObtenerPersona(this.repositorioPersonas).ejecutar(id);
  }

  @Post()
  crear(@Actor() actor: ActorActual, @Body() dto: CrearPersonaDto) {
    return new CrearPersona(this.repositorioPersonas, this.servicioCifrado, this.repositorioAuditoria).ejecutar(
      actor,
      {
        tipoDocumentoId: dto.tipoDocumentoId ?? null,
        numeroDocumento: dto.numeroDocumento ?? null,
        primerNombre: dto.primerNombre,
        segundoNombre: dto.segundoNombre ?? null,
        primerApellido: dto.primerApellido,
        segundoApellido: dto.segundoApellido ?? null,
        telefono: dto.telefono ?? null,
      },
    );
  }

  @Patch(":id")
  actualizar(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: Partial<CrearPersonaDto>) {
    return new ActualizarPersona(this.repositorioPersonas, this.servicioCifrado).ejecutar(actor, id, dto);
  }

  @Get(":id/direcciones")
  listarDirecciones(@Param("id") id: string) {
    return new ListarDirecciones(this.repositorioPersonas).ejecutar(id);
  }

  @Post(":id/direcciones")
  crearDireccion(@Actor() actor: ActorActual, @Param("id") id: string, @Body() dto: CrearDireccionDto) {
    return new CrearDireccion(this.repositorioPersonas).ejecutar(actor, id, {
      cantonId: dto.cantonId ?? null,
      distritoId: dto.distritoId ?? null,
      barrioId: dto.barrioId ?? null,
      senas: dto.senas ?? null,
      esActual: dto.esActual,
      vigenteDesde: dto.vigenteDesde,
      vigenteHasta: dto.vigenteHasta ?? null,
    });
  }

  @Patch(":id/direcciones/:direccionId")
  actualizarDireccion(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Param("direccionId") direccionId: string,
    @Body() dto: Partial<CrearDireccionDto>,
  ) {
    return new ActualizarDireccion(this.repositorioPersonas).ejecutar(actor, id, direccionId, dto);
  }
}
