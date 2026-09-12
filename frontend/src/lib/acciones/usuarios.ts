"use server";

import { revalidatePath } from "next/cache";
import {
  esquemaActualizarUsuario,
  esquemaCambiarAsignacion,
  esquemaCrearUsuario,
  soloCamposDefinidos,
} from "../api/esquemas";
import { actualizarUsuario, cambiarAsignacion, crearUsuario } from "../api/recursos/usuarios";
import { validarFormaDeAlcance } from "../autorizacion/alcance";
import {
  puede,
  puedeEditarUsuario,
  puedeReasignarUsuario,
  rolesQuePuedeCrear,
} from "../autorizacion/permisos";
import type { CodigoRol } from "../dominio/enums";
import type { AsignacionUsuario, Usuario } from "../dominio/tipos";
import { sesionActual } from "../sesion/servidor";
import { fallido, intentar, type Resultado } from "./resultado";

export async function accionCrearUsuario(entrada: unknown): Promise<Resultado<Usuario>> {
  const sesion = await sesionActual();
  if (!puede(sesion, "usuariosCrear")) {
    return fallido("Su rol no permite crear usuarios");
  }
  const validado = esquemaCrearUsuario.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const datos = validado.data;
  const rolCodigo = datos.rolCodigo as CodigoRol;
  const permitidos = rolesQuePuedeCrear(sesion);
  if (!permitidos.includes(rolCodigo)) {
    return fallido(
      `Su rol solo puede crear usuarios con rol ${permitidos.join(" o ")}`,
    );
  }
  const alcance = {
    diocesisId: datos.diocesisId ?? null,
    vicariaId: datos.vicariaId ?? null,
    parroquiaId: datos.parroquiaId ?? null,
  };
  const problemaAlcance = validarFormaDeAlcance(rolCodigo, alcance);
  if (problemaAlcance) {
    return fallido(problemaAlcance);
  }
  const resultado = await intentar(() => crearUsuario(datos));
  if (resultado.exito) {
    revalidatePath("/usuarios");
  }
  return resultado;
}

export async function accionActualizarUsuario(
  usuarioId: string,
  entrada: unknown,
): Promise<Resultado<Usuario>> {
  const sesion = await sesionActual();
  if (!puedeEditarUsuario(sesion, usuarioId)) {
    return fallido("Solo el administrador puede editar usuarios distintos al propio");
  }
  const validado = esquemaActualizarUsuario.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const cuerpo = soloCamposDefinidos(validado.data);
  if (Object.keys(cuerpo).length === 0) {
    return fallido("No hay cambios por guardar");
  }
  const resultado = await intentar(() => actualizarUsuario(usuarioId, cuerpo));
  if (resultado.exito) {
    revalidatePath("/usuarios");
  }
  return resultado;
}

export async function accionCambiarAsignacion(
  usuarioId: string,
  entrada: unknown,
): Promise<Resultado<AsignacionUsuario>> {
  const sesion = await sesionActual();
  if (!puedeReasignarUsuario(sesion, usuarioId)) {
    return fallido(
      sesion.usuarioId === usuarioId
        ? "Nadie puede cambiar su propio rol ni su propio alcance"
        : "Solo el administrador o el coordinador diocesano puede cambiar la asignación de un usuario",
    );
  }
  const validado = esquemaCambiarAsignacion.safeParse(entrada);
  if (!validado.success) {
    return fallido(validado.error.issues[0]?.message ?? "Datos inválidos");
  }
  const datos = validado.data;
  const problemaAlcance = validarFormaDeAlcance(datos.rolCodigo as CodigoRol, {
    diocesisId: datos.diocesisId ?? null,
    vicariaId: datos.vicariaId ?? null,
    parroquiaId: datos.parroquiaId ?? null,
  });
  if (problemaAlcance) {
    return fallido(problemaAlcance);
  }
  const resultado = await intentar(() => cambiarAsignacion(usuarioId, datos));
  if (resultado.exito) {
    revalidatePath("/usuarios");
  }
  return resultado;
}
