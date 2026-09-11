"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  esquemaCrearDireccion,
  esquemaCrearIntegrante,
  esquemaEvaluacionVivienda,
  esquemaRegistrarSolicitud,
} from "../api/esquemas";
import { crearDireccion } from "../api/recursos/personas";
import {
  crearIntegrante,
  guardarEvaluacionVivienda,
  registrarSolicitud,
} from "../api/recursos/solicitudes";
import { puede } from "../autorizacion/permisos";
import { sesionActual } from "../sesion/servidor";
import { fallido, intentar, type Resultado } from "./resultado";

const esquemaAsistente = z.object({
  solicitud: esquemaRegistrarSolicitud,
  direccion: esquemaCrearDireccion.nullable(),
  integrantes: z.array(esquemaCrearIntegrante),
  vivienda: esquemaEvaluacionVivienda.nullable(),
});

export type ResultadoAsistente = {
  solicitudId: string;
  advertencias: string[];
};

export async function accionCompletarAsistente(
  entrada: unknown,
): Promise<Resultado<ResultadoAsistente>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "solicitudesCrear")) {
    return fallido("Su rol no permite registrar solicitudes");
  }
  const validado = esquemaAsistente.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const { solicitud, direccion, integrantes, vivienda } = validado.data;

  const creada = await intentar(() => registrarSolicitud(solicitud));
  if (!creada.exito) {
    return creada;
  }
  const solicitudId = creada.datos.id;
  const advertencias: string[] = [];

  if (direccion) {
    const guardada = await intentar(() =>
      crearDireccion(solicitud.personaSolicitanteId, direccion),
    );
    if (!guardada.exito) {
      advertencias.push(`No se pudo guardar la dirección: ${guardada.mensaje}`);
    }
  }

  for (const integrante of integrantes) {
    const guardado = await intentar(() => crearIntegrante(solicitudId, integrante));
    if (!guardado.exito) {
      advertencias.push(
        `No se pudo guardar al integrante ${integrante.nombreCompleto}: ${guardado.mensaje}`,
      );
    }
  }

  if (vivienda) {
    const guardada = await intentar(() => guardarEvaluacionVivienda(solicitudId, vivienda));
    if (!guardada.exito) {
      advertencias.push(`No se pudo guardar la evaluación de vivienda: ${guardada.mensaje}`);
    }
  }

  revalidatePath("/solicitudes");
  revalidatePath("/panel");
  return { exito: true, datos: { solicitudId, advertencias } };
}
