import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { CodigoRol, DecisionPlanAyuda, EstadoSolicitud, FrecuenciaEntrega } from "../../../domain/enums/catalogosDominio";

export class IniciarSesionDto {
  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(8)
  contrasena!: string;
}

export class RenovarSesionDto {
  @IsString()
  tokenRenovacion!: string;
}

export class CrearUsuarioDto {
  @IsString()
  nombreCompleto!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(8)
  contrasena!: string;

  @IsEnum(CodigoRol)
  rolCodigo!: CodigoRol;

  @IsOptional()
  @IsUUID()
  diocesisId?: string | null;

  @IsOptional()
  @IsUUID()
  vicariaId?: string | null;

  @IsOptional()
  @IsUUID()
  parroquiaId?: string | null;

  @IsOptional()
  @IsString()
  motivo?: string | null;
}

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsString()
  motivo?: string;
}

export class CambiarAsignacionDto {
  @IsEnum(CodigoRol)
  rolCodigo!: CodigoRol;

  @IsOptional()
  @IsUUID()
  diocesisId?: string | null;

  @IsOptional()
  @IsUUID()
  vicariaId?: string | null;

  @IsOptional()
  @IsUUID()
  parroquiaId?: string | null;

  @IsOptional()
  @IsString()
  motivo?: string | null;
}

export class CrearPersonaDto {
  @IsOptional()
  @IsUUID()
  tipoDocumentoId?: string | null;

  @IsOptional()
  @IsString()
  numeroDocumento?: string | null;

  @IsString()
  primerNombre!: string;

  @IsOptional()
  @IsString()
  segundoNombre?: string | null;

  @IsString()
  primerApellido!: string;

  @IsOptional()
  @IsString()
  segundoApellido?: string | null;

  @IsOptional()
  @IsString()
  telefono?: string | null;
}

export class BuscarPersonaDto {
  @IsString()
  numeroDocumento!: string;
}

export class CrearDireccionDto {
  @IsOptional()
  @IsUUID()
  cantonId?: string | null;

  @IsOptional()
  @IsUUID()
  distritoId?: string | null;

  @IsOptional()
  @IsUUID()
  barrioId?: string | null;

  @IsOptional()
  @IsString()
  senas?: string | null;

  @IsBoolean()
  esActual!: boolean;

  @IsString()
  vigenteDesde!: string;

  @IsOptional()
  @IsString()
  vigenteHasta?: string | null;
}

export class RegistrarSolicitudDto {
  @IsUUID()
  personaSolicitanteId!: string;

  @IsUUID()
  parroquiaReceptoraId!: string;

  @IsOptional()
  @IsString()
  sectorOficial?: string | null;

  @IsOptional()
  @IsString()
  fechaEntrevista?: string | null;

  @IsOptional()
  @IsString()
  fechaVisita?: string | null;

  @IsOptional()
  @IsString()
  observaciones?: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  tiposAyuda!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  detalles?: string[] | null;

  @IsOptional()
  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud;
}

export class CambiarEstadoDto {
  @IsEnum(EstadoSolicitud)
  estadoNuevo!: EstadoSolicitud;

  @IsOptional()
  @IsString()
  motivo?: string | null;
}

export class MotivoDto {
  @IsString()
  @MinLength(3)
  motivo!: string;
}

export class ItemCatalogoDto {
  @IsString()
  codigo!: string;

  @IsString()
  nombre!: string;

  @IsOptional()
  @IsNumber()
  ordenPresentacion?: number;

  @IsOptional()
  @IsBoolean()
  requiereDetalle?: boolean;

  @IsOptional()
  @IsNumber()
  montoMinimo?: number | null;

  @IsOptional()
  @IsNumber()
  montoMaximo?: number | null;

  @IsOptional()
  @IsUUID()
  cantonId?: string;

  @IsOptional()
  @IsUUID()
  distritoId?: string;

  @IsOptional()
  @IsUUID()
  diocesisId?: string;

  @IsOptional()
  @IsUUID()
  vicariaId?: string;
}

export class CrearIntegranteDto {
  @IsOptional()
  @IsUUID()
  personaId?: string | null;

  @IsString()
  nombreCompleto!: string;

  @IsOptional()
  @IsUUID()
  sexoId?: string | null;

  @IsOptional()
  @IsString()
  ocupacion?: string | null;

  @IsOptional()
  @IsUUID()
  tipoDocumentoId?: string | null;

  @IsOptional()
  @IsString()
  numeroDocumento?: string | null;

  @IsOptional()
  @IsUUID()
  gradoAcademicoId?: string | null;

  @IsOptional()
  @IsUUID()
  rangoIngresoId?: string | null;

  @IsOptional()
  @IsBoolean()
  cuentaConSeguro?: boolean | null;

  @IsOptional()
  @IsUUID()
  parentescoId?: string | null;
}

export class EvaluacionViviendaDto {
  @IsOptional()
  @IsUUID()
  tipoViviendaId?: string | null;

  @IsOptional()
  @IsUUID()
  tipoTenenciaId?: string | null;

  @IsOptional()
  @IsUUID()
  condicionViviendaId?: string | null;

  @IsOptional()
  @IsString()
  observaciones?: string | null;
}

export class AyudaSolicitadaDto {
  @IsUUID()
  tipoAyudaId!: string;

  @IsOptional()
  @IsString()
  detalle?: string | null;
}

export class CrearPlanDto {
  @IsEnum(DecisionPlanAyuda)
  decision!: DecisionPlanAyuda;

  @IsOptional()
  @IsString()
  fechaInicio?: string | null;

  @IsOptional()
  @IsString()
  fechaFin?: string | null;

  @IsOptional()
  @IsString()
  motivoDecision?: string | null;
}

export class CrearDetallePlanDto {
  @IsUUID()
  tipoAyudaId!: string;

  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @IsOptional()
  @IsEnum(FrecuenciaEntrega)
  frecuencia?: FrecuenciaEntrega | null;

  @IsOptional()
  @IsNumber()
  montoEstimado?: number | null;
}

export class CrearEntregaDto {
  @IsString()
  fechaEntrega!: string;

  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @IsOptional()
  @IsNumber()
  monto?: number | null;

  @IsOptional()
  @IsString()
  observaciones?: string | null;
}

export class OrganizacionDto {
  @IsString()
  nombre!: string;

  @IsString()
  codigo!: string;

  @IsOptional()
  @IsUUID()
  diocesisId?: string;

  @IsOptional()
  @IsUUID()
  vicariaId?: string;
}
