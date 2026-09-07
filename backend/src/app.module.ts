import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import {
  PUERTO_ALMACENAMIENTO,
  PUERTO_AUTENTICACION,
  SERVICIO_CIFRADO,
} from "./application/ports/puertosAplicacion";
import {
  REPOSITORIO_AUDITORIA,
  REPOSITORIO_DOCUMENTOS,
  REPOSITORIO_GENERICO,
  REPOSITORIO_ORGANIZACION,
  REPOSITORIO_PERSONAS,
  REPOSITORIO_SOLICITUDES,
  REPOSITORIO_USUARIOS,
} from "./domain/repositories/contratosRepositorio";
import { AdaptadorAutenticacionSupabase } from "./infrastructure/auth/adaptadorAutenticacionSupabase";
import { ProveedorServicioCifrado } from "./infrastructure/encryption/proveedorServicioCifrado";
import { RepositorioAuditoriaSupabase } from "./infrastructure/repositories/repositorioAuditoriaSupabase";
import { RepositorioDocumentosSupabase } from "./infrastructure/repositories/repositorioDocumentosSupabase";
import { RepositorioGenericoSupabase } from "./infrastructure/repositories/repositorioGenericoSupabase";
import { RepositorioOrganizacionSupabase } from "./infrastructure/repositories/repositorioOrganizacionSupabase";
import { RepositorioPersonasSupabase } from "./infrastructure/repositories/repositorioPersonasSupabase";
import { RepositorioSolicitudesSupabase } from "./infrastructure/repositories/repositorioSolicitudesSupabase";
import { RepositorioUsuariosSupabase } from "./infrastructure/repositories/repositorioUsuariosSupabase";
import { AdaptadorAlmacenamientoSupabase } from "./infrastructure/storage/adaptadorAlmacenamientoSupabase";
import { FabricaClienteSupabase } from "./infrastructure/supabase/fabricaClienteSupabase";
import { AuthController } from "./presentation/http/controllers/auth.controller";
import { CatalogosController } from "./presentation/http/controllers/catalogos.controller";
import { DocumentosController, EventosAuditoriaController } from "./presentation/http/controllers/documentos.controller";
import { OrganizacionController } from "./presentation/http/controllers/organizacion.controller";
import { PersonasController } from "./presentation/http/controllers/personas.controller";
import { SaludController } from "./presentation/http/controllers/salud.controller";
import { PlanesAyudaController, SolicitudesController } from "./presentation/http/controllers/solicitudes.controller";
import { UsuariosController } from "./presentation/http/controllers/usuarios.controller";
import { FiltroExcepcionesHttp } from "./presentation/http/filters/filtroExcepcionesHttp";
import { AlcanceGuard } from "./presentation/http/guards/alcanceGuard";
import { AutenticacionGuard } from "./presentation/http/guards/autenticacionGuard";
import { RolesGuard } from "./presentation/http/guards/rolesGuard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
  ],
  controllers: [
    SaludController,
    AuthController,
    CatalogosController,
    OrganizacionController,
    UsuariosController,
    PersonasController,
    SolicitudesController,
    PlanesAyudaController,
    DocumentosController,
    EventosAuditoriaController,
  ],
  providers: [
    ConfigService,
    FabricaClienteSupabase,
    RepositorioGenericoSupabase,
    ProveedorServicioCifrado,
    AdaptadorAutenticacionSupabase,
    AdaptadorAlmacenamientoSupabase,
    RepositorioUsuariosSupabase,
    RepositorioOrganizacionSupabase,
    RepositorioPersonasSupabase,
    RepositorioSolicitudesSupabase,
    RepositorioDocumentosSupabase,
    RepositorioAuditoriaSupabase,
    AutenticacionGuard,
    RolesGuard,
    AlcanceGuard,
    { provide: PUERTO_AUTENTICACION, useExisting: AdaptadorAutenticacionSupabase },
    { provide: PUERTO_ALMACENAMIENTO, useExisting: AdaptadorAlmacenamientoSupabase },
    { provide: SERVICIO_CIFRADO, useExisting: ProveedorServicioCifrado },
    { provide: REPOSITORIO_GENERICO, useExisting: RepositorioGenericoSupabase },
    { provide: REPOSITORIO_USUARIOS, useExisting: RepositorioUsuariosSupabase },
    { provide: REPOSITORIO_ORGANIZACION, useExisting: RepositorioOrganizacionSupabase },
    { provide: REPOSITORIO_PERSONAS, useExisting: RepositorioPersonasSupabase },
    { provide: REPOSITORIO_SOLICITUDES, useExisting: RepositorioSolicitudesSupabase },
    { provide: REPOSITORIO_DOCUMENTOS, useExisting: RepositorioDocumentosSupabase },
    { provide: REPOSITORIO_AUDITORIA, useExisting: RepositorioAuditoriaSupabase },
    { provide: APP_GUARD, useClass: AutenticacionGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: AlcanceGuard },
    { provide: APP_FILTER, useClass: FiltroExcepcionesHttp },
  ],
})
export class AppModule {}
