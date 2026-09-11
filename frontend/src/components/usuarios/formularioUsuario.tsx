"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Aviso } from "@/components/ui/marco";
import { SelectorAlcance } from "@/components/usuarios/selectorAlcance";
import { accionCrearUsuario } from "@/lib/acciones/usuarios";
import { validarFormaDeAlcance, type Alcance } from "@/lib/autorizacion/alcance";
import { rolesQuePuedeCrear } from "@/lib/autorizacion/permisos";
import type { CodigoRol } from "@/lib/dominio/enums";
import { etiquetaRol } from "@/lib/dominio/etiquetas";
import type { Diocesis, Parroquia, Vicaria } from "@/lib/dominio/tipos";
import { useSesion } from "@/lib/sesion/contextoSesion";

export function FormularioUsuario({
  opciones,
}: {
  opciones: { diocesis: Diocesis[]; vicarias: Vicaria[]; parroquias: Parroquia[] };
}) {
  const sesion = useSesion();
  const router = useRouter();
  const roles = rolesQuePuedeCrear(sesion);
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [exito, setExito] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [rolCodigo, setRolCodigo] = React.useState<CodigoRol>(roles[0]);
  const [alcance, setAlcance] = React.useState<Alcance>(() =>
    alcanceInicial(roles[0], sesion.diocesisId, sesion.vicariaId, sesion.parroquiaId),
  );
  const [valores, setValores] = React.useState({
    nombreCompleto: "",
    correo: "",
    contrasena: "",
    motivo: "",
  });

  const problemaAlcance = validarFormaDeAlcance(rolCodigo, alcance);

  async function guardar() {
    setError(null);
    setExito(null);
    setGuardando(true);
    const resultado = await accionCrearUsuario({
      nombreCompleto: valores.nombreCompleto,
      correo: valores.correo,
      contrasena: valores.contrasena,
      rolCodigo,
      diocesisId: alcance.diocesisId,
      vicariaId: alcance.vicariaId,
      parroquiaId: alcance.parroquiaId,
      motivo: valores.motivo,
    });
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setValores({ nombreCompleto: "", correo: "", contrasena: "", motivo: "" });
    setExito(`Se creó la cuenta de ${resultado.datos.nombreCompleto}.`);
    router.refresh();
  }

  return (
    <Dialogo
      open={abierto}
      onOpenChange={(valor) => {
        setAbierto(valor);
        if (!valor) {
          setError(null);
          setExito(null);
        }
      }}
    >
      <DisparadorDialogo asChild>
        <Boton>
          <UserPlus />
          Crear usuario
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Crear usuario"
        descripcion={`Su rol solo puede crear cuentas con rol ${roles.map(etiquetaRol).join(" o ")}.`}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre completo" requerido className="sm:col-span-2">
              <Entrada
                value={valores.nombreCompleto}
                onChange={(evento) =>
                  setValores({ ...valores, nombreCompleto: evento.target.value })
                }
                autoFocus
              />
            </Campo>
            <Campo etiqueta="Correo" requerido>
              <Entrada
                type="email"
                value={valores.correo}
                onChange={(evento) => setValores({ ...valores, correo: evento.target.value })}
              />
            </Campo>
            <Campo
              etiqueta="Contraseña inicial"
              requerido
              ayuda="Al menos 8 caracteres."
            >
              <Entrada
                type="password"
                value={valores.contrasena}
                onChange={(evento) => setValores({ ...valores, contrasena: evento.target.value })}
              />
            </Campo>
          </div>

          <Campo etiqueta="Rol" requerido>
            <Seleccion
              value={rolCodigo}
              disabled={roles.length === 1}
              onChange={(evento) => {
                const nuevo = evento.target.value as CodigoRol;
                setRolCodigo(nuevo);
                setAlcance(
                  alcanceInicial(nuevo, sesion.diocesisId, sesion.vicariaId, sesion.parroquiaId),
                );
              }}
            >
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {etiquetaRol(rol)}
                </option>
              ))}
            </Seleccion>
          </Campo>

          <SelectorAlcance
            rolCodigo={rolCodigo}
            alcance={alcance}
            opciones={opciones}
            alCambiar={setAlcance}
          />

          <Campo etiqueta="Motivo" ayuda="Se guarda en el evento de auditoría CREAR_USUARIO.">
            <AreaTexto
              value={valores.motivo}
              onChange={(evento) => setValores({ ...valores, motivo: evento.target.value })}
            />
          </Campo>

          {problemaAlcance ? <Aviso tono="advertencia">{problemaAlcance}</Aviso> : null}
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          {exito ? <Aviso tono="exito">{exito}</Aviso> : null}

          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cerrar
            </Boton>
            <Boton
              onClick={guardar}
              disabled={
                guardando ||
                Boolean(problemaAlcance) ||
                !valores.nombreCompleto.trim() ||
                !valores.correo.trim() ||
                valores.contrasena.length < 8
              }
            >
              {guardando ? "Creando…" : "Crear usuario"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}

function alcanceInicial(
  rolCodigo: CodigoRol,
  diocesisId: string | null,
  vicariaId: string | null,
  parroquiaId: string | null,
): Alcance {
  if (rolCodigo === "PERSONAL_PASTORAL" || rolCodigo === "COORDINADOR_PARROQUIAL") {
    return { diocesisId: null, vicariaId: null, parroquiaId };
  }
  if (rolCodigo === "COORDINADOR_VICARIAL") {
    return { diocesisId: null, vicariaId, parroquiaId: null };
  }
  if (rolCodigo === "COORDINADOR_DIOCESANO") {
    return { diocesisId, vicariaId: null, parroquiaId: null };
  }
  return { diocesisId: null, vicariaId: null, parroquiaId: null };
}
