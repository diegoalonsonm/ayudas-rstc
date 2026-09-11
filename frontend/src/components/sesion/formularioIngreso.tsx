"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada } from "@/components/ui/campo";
import { Aviso, CuerpoTarjeta, Tarjeta } from "@/components/ui/marco";
import { esquemaIngreso } from "@/lib/api/esquemas";

type Valores = z.infer<typeof esquemaIngreso>;

export function FormularioIngreso() {
  const router = useRouter();
  const parametros = useSearchParams();
  const volverA = parametros.get("volverA") ?? "/panel";
  const [errorGeneral, setErrorGeneral] = React.useState<string | null>(null);

  const formulario = useForm<Valores>({
    resolver: zodResolver(esquemaIngreso),
    defaultValues: { correo: "", contrasena: "" },
  });

  async function enviar(valores: Valores) {
    setErrorGeneral(null);
    const respuesta = await fetch("/api/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valores),
    });
    if (!respuesta.ok) {
      const cuerpo = (await respuesta.json().catch(() => null)) as { mensaje?: string } | null;
      setErrorGeneral(cuerpo?.mensaje ?? "No se pudo iniciar sesión");
      return;
    }
    router.replace(volverA);
    router.refresh();
  }

  return (
    <Tarjeta>
      <CuerpoTarjeta>
        <form onSubmit={formulario.handleSubmit(enviar)} className="space-y-4" noValidate>
          <Campo etiqueta="Correo" requerido error={formulario.formState.errors.correo?.message}>
            <Entrada
              type="email"
              autoComplete="username"
              autoFocus
              placeholder="persona@diocesis.test"
              {...formulario.register("correo")}
            />
          </Campo>
          <Campo
            etiqueta="Contraseña"
            requerido
            error={formulario.formState.errors.contrasena?.message}
          >
            <Entrada
              type="password"
              autoComplete="current-password"
              {...formulario.register("contrasena")}
            />
          </Campo>
          {errorGeneral ? <Aviso tono="peligro">{errorGeneral}</Aviso> : null}
          <Boton
            type="submit"
            className="w-full"
            disabled={formulario.formState.isSubmitting}
          >
            {formulario.formState.isSubmitting ? "Ingresando…" : "Ingresar"}
          </Boton>
        </form>
      </CuerpoTarjeta>
    </Tarjeta>
  );
}
