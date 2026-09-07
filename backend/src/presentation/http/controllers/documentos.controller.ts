import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { PUERTO_ALMACENAMIENTO, PuertoAlmacenamiento } from "../../../application/ports/puertosAplicacion";
import {
  CargarDocumentoConsentimiento,
  ListarDocumentosConsentimiento,
  ListarEventosAuditoria,
  ObtenerUrlDocumento,
} from "../../../application/useCases/catalogos/gestionarCatalogo";
import { ActorActual } from "../../../domain/entities/tiposDominio";
import { CodigoRol } from "../../../domain/enums/catalogosDominio";
import {
  REPOSITORIO_AUDITORIA,
  REPOSITORIO_DOCUMENTOS,
  REPOSITORIO_SOLICITUDES,
  RepositorioAuditoria,
  RepositorioDocumentos,
  RepositorioSolicitudes,
} from "../../../domain/repositories/contratosRepositorio";
import { ErrorValidacion } from "../../../domain/errors/errorDominio";
import { Actor } from "../decorators/actorActual";
import { RequerirRoles } from "../decorators/decoradoresHttp";

@Controller()
export class DocumentosController {
  constructor(
    @Inject(REPOSITORIO_SOLICITUDES) private readonly repositorioSolicitudes: RepositorioSolicitudes,
    @Inject(REPOSITORIO_DOCUMENTOS) private readonly repositorioDocumentos: RepositorioDocumentos,
    @Inject(PUERTO_ALMACENAMIENTO) private readonly almacenamiento: PuertoAlmacenamiento,
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  @Get("solicitudes-ayuda/:id/documentos-consentimiento")
  listar(@Param("id") id: string) {
    return new ListarDocumentosConsentimiento(this.repositorioDocumentos).ejecutar(id);
  }

  @Post("solicitudes-ayuda/:id/documentos-consentimiento")
  @UseInterceptors(FileInterceptor("archivo", { storage: memoryStorage() }))
  cargar(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @UploadedFile() archivo: Express.Multer.File,
    @Query("fechaFirma") fechaFirma?: string,
  ) {
    if (!archivo) {
      throw new ErrorValidacion("El archivo es obligatorio");
    }
    return new CargarDocumentoConsentimiento(
      this.repositorioSolicitudes,
      this.repositorioDocumentos,
      this.almacenamiento,
      this.repositorioAuditoria,
    ).ejecutar(
      actor,
      id,
      {
        buffer: archivo.buffer,
        nombreOriginal: archivo.originalname,
        tipoMime: archivo.mimetype,
        tamanoBytes: archivo.size,
      },
      fechaFirma ?? null,
    );
  }

  @Get("documentos-consentimiento/:id/url")
  obtenerUrl(
    @Actor() actor: ActorActual,
    @Param("id") id: string,
    @Query("descargar") descargar?: string,
  ) {
    return new ObtenerUrlDocumento(
      this.repositorioDocumentos,
      this.almacenamiento,
      this.repositorioAuditoria,
    ).ejecutar(actor, id, descargar === "true");
  }
}

@Controller("eventos-auditoria")
export class EventosAuditoriaController {
  constructor(
    @Inject(REPOSITORIO_AUDITORIA) private readonly repositorioAuditoria: RepositorioAuditoria,
  ) {}

  @Get()
  @RequerirRoles(CodigoRol.ADMINISTRADOR, CodigoRol.COORDINADOR_DIOCESANO)
  listar(@Actor() actor: ActorActual) {
    return new ListarEventosAuditoria(this.repositorioAuditoria).ejecutar(actor);
  }
}
