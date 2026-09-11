import { z } from "zod";
import {
  CODIGOS_ROL,
  DecisionPlanAyuda,
  ESTADOS_SOLICITUD,
  FRECUENCIAS_ENTREGA,
} from "../dominio/enums";

const textoOpcional = z
  .string()
  .trim()
  .transform((valor) => (valor === "" ? null : valor))
  .nullable()
  .optional();

const uuidOpcional = z
  .string()
  .trim()
  .transform((valor) => (valor === "" ? null : valor))
  .nullable()
  .optional()
  .refine(
    (valor) => valor === null || valor === undefined || z.string().uuid().safeParse(valor).success,
    "Seleccione una opción válida",
  );

const fechaOpcional = z
  .string()
  .trim()
  .transform((valor) => (valor === "" ? null : valor))
  .nullable()
  .optional()
  .refine(
    (valor) => valor === null || valor === undefined || /^\d{4}-\d{2}-\d{2}$/.test(valor),
    "Use el formato AAAA-MM-DD",
  );

const numeroOpcional = z
  .union([z.number(), z.string()])
  .transform((valor) => {
    if (typeof valor === "number") {
      return valor;
    }
    const limpio = valor.trim();
    return limpio === "" ? null : Number(limpio);
  })
  .nullable()
  .optional()
  .refine((valor) => valor === null || valor === undefined || !Number.isNaN(valor), "Indique un número válido");

const booleanoOpcional = z
  .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("")])
  .transform((valor) => {
    if (valor === "" ) return null;
    if (typeof valor === "boolean") return valor;
    return valor === "true";
  })
  .nullable()
  .optional();

export const esquemaIngreso = z.object({
  correo: z.string().trim().email("Indique un correo válido"),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const esquemaMotivo = z.object({
  motivo: z.string().trim().min(3, "El motivo debe tener al menos 3 caracteres"),
});

export const esquemaCrearPersona = z.object({
  tipoDocumentoId: uuidOpcional,
  numeroDocumento: textoOpcional,
  primerNombre: z.string().trim().min(1, "El primer nombre es obligatorio"),
  segundoNombre: textoOpcional,
  primerApellido: z.string().trim().min(1, "El primer apellido es obligatorio"),
  segundoApellido: textoOpcional,
  telefono: textoOpcional,
});

export const esquemaActualizarPersona = esquemaCrearPersona.partial();

export const esquemaBuscarPersona = z.object({
  numeroDocumento: z.string().trim().min(4, "Indique al menos 4 caracteres"),
});

export const esquemaCrearDireccion = z.object({
  cantonId: uuidOpcional,
  distritoId: uuidOpcional,
  barrioId: uuidOpcional,
  senas: textoOpcional,
  esActual: z.boolean(),
  vigenteDesde: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use el formato AAAA-MM-DD"),
  vigenteHasta: fechaOpcional,
});

export const esquemaRegistrarSolicitud = z.object({
  personaSolicitanteId: z.string().uuid("Seleccione la persona solicitante"),
  parroquiaReceptoraId: z.string().uuid("Seleccione la parroquia receptora"),
  sectorOficial: textoOpcional,
  fechaEntrevista: fechaOpcional,
  fechaVisita: fechaOpcional,
  observaciones: textoOpcional,
  tiposAyuda: z.array(z.string().uuid()).min(1, "Seleccione al menos un tipo de ayuda"),
  detalles: z.array(z.string()).nullable().optional(),
  estado: z.enum(ESTADOS_SOLICITUD as [string, ...string[]]).optional(),
});

export const esquemaActualizarSolicitud = z.object({
  sectorOficial: textoOpcional,
  fechaEntrevista: fechaOpcional,
  fechaVisita: fechaOpcional,
  observaciones: textoOpcional,
});

export const esquemaCambiarEstado = z.object({
  estadoNuevo: z.enum(ESTADOS_SOLICITUD as [string, ...string[]]),
  motivo: textoOpcional,
});

export const esquemaCrearIntegrante = z.object({
  personaId: uuidOpcional,
  nombreCompleto: z.string().trim().min(1, "El nombre completo es obligatorio"),
  sexoId: uuidOpcional,
  ocupacion: textoOpcional,
  tipoDocumentoId: uuidOpcional,
  numeroDocumento: textoOpcional,
  gradoAcademicoId: uuidOpcional,
  rangoIngresoId: uuidOpcional,
  cuentaConSeguro: booleanoOpcional,
  parentescoId: uuidOpcional,
});

export const esquemaActualizarIntegrante = esquemaCrearIntegrante.partial();

export const esquemaEvaluacionVivienda = z.object({
  tipoViviendaId: uuidOpcional,
  tipoTenenciaId: uuidOpcional,
  condicionViviendaId: uuidOpcional,
  observaciones: textoOpcional,
});

export const esquemaAyudaSolicitada = z.object({
  tipoAyudaId: z.string().uuid("Seleccione el tipo de ayuda"),
  detalle: textoOpcional,
});

export const esquemaCrearPlan = z.object({
  decision: z.nativeEnum(DecisionPlanAyuda),
  fechaInicio: fechaOpcional,
  fechaFin: fechaOpcional,
  motivoDecision: textoOpcional,
});

export const esquemaCrearDetallePlan = z.object({
  tipoAyudaId: z.string().uuid("Seleccione el tipo de ayuda"),
  descripcion: textoOpcional,
  frecuencia: z
    .enum(FRECUENCIAS_ENTREGA as [string, ...string[]])
    .nullable()
    .optional(),
  montoEstimado: numeroOpcional,
});

export const esquemaCrearEntrega = z.object({
  fechaEntrega: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use el formato AAAA-MM-DD"),
  descripcion: textoOpcional,
  monto: numeroOpcional,
  observaciones: textoOpcional,
});

export const esquemaCrearUsuario = z.object({
  nombreCompleto: z.string().trim().min(1, "El nombre completo es obligatorio"),
  correo: z.string().trim().email("Indique un correo válido"),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rolCodigo: z.enum(CODIGOS_ROL as [string, ...string[]]),
  diocesisId: uuidOpcional,
  vicariaId: uuidOpcional,
  parroquiaId: uuidOpcional,
  motivo: textoOpcional,
});

export const esquemaActualizarUsuario = z.object({
  nombreCompleto: z.string().trim().min(1).optional(),
  activo: z.boolean().optional(),
  motivo: z.string().trim().min(3, "Indique el motivo del cambio").optional(),
});

export const esquemaCambiarAsignacion = z.object({
  rolCodigo: z.enum(CODIGOS_ROL as [string, ...string[]]),
  diocesisId: uuidOpcional,
  vicariaId: uuidOpcional,
  parroquiaId: uuidOpcional,
  motivo: textoOpcional,
});

export const esquemaOrganizacion = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  codigo: z.string().trim().optional(),
  diocesisId: z.string().uuid().optional(),
  vicariaId: z.string().uuid().optional(),
});

export const esquemaItemCatalogo = z.object({
  codigo: z.string().trim().min(1, "El código es obligatorio"),
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  ordenPresentacion: numeroOpcional,
  requiereDetalle: booleanoOpcional,
  montoMinimo: numeroOpcional,
  montoMaximo: numeroOpcional,
  cantonId: z.string().uuid().optional(),
  distritoId: z.string().uuid().optional(),
});

export function soloCamposDefinidos<T extends Record<string, unknown>>(datos: T): Partial<T> {
  const salida: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      salida[clave] = valor;
    }
  }
  return salida as Partial<T>;
}
