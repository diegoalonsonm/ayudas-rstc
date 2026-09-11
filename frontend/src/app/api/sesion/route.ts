import { NextResponse } from "next/server";
import { z } from "zod";
import { cerrarSesionApi, iniciarSesionApi, olvidarSesion } from "@/lib/api/clienteServidor";
import { ErrorApi } from "@/lib/api/errorApi";
import { guardarTokens } from "@/lib/sesion/cookies";

const esquemaIngreso = z.object({
  correo: z.string().email("Indique un correo válido"),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function POST(peticion: Request) {
  const cuerpo = await peticion.json().catch(() => null);
  const validado = esquemaIngreso.safeParse(cuerpo);
  if (!validado.success) {
    return NextResponse.json(
      { codigo: "VALIDACION", mensaje: validado.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 422 },
    );
  }
  try {
    const { tokens } = await iniciarSesionApi(validado.data.correo, validado.data.contrasena);
    await guardarTokens(tokens);
    return NextResponse.json({ ingresado: true });
  } catch (error) {
    if (error instanceof ErrorApi) {
      return NextResponse.json(
        { codigo: error.codigo, mensaje: error.message },
        { status: error.estado },
      );
    }
    return NextResponse.json(
      { codigo: "INTERNO", mensaje: "No se pudo iniciar sesión" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  await cerrarSesionApi();
  await olvidarSesion();
  return NextResponse.json({ cerrado: true });
}
