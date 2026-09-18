import { FormularioUsuario } from "@/components/usuarios/formularioUsuario";
import { TablaUsuarios } from "@/components/usuarios/tablaUsuarios";
import { Aviso, EncabezadoPagina, Tarjeta } from "@/components/ui/marco";
import { ErrorApi } from "@/lib/api/errorApi";
import { listarUsuariosConAsignacion } from "@/lib/api/recursos/usuarios";
import {
  diocesisParaCrearUsuario,
  parroquiasParaCrearUsuario,
  vicariasParaCrearUsuario,
} from "@/lib/autorizacion/alcance";
import { rolesQuePuedeCrear } from "@/lib/autorizacion/permisos";
import { etiquetaRol } from "@/lib/dominio/etiquetas";
import type { UsuarioConAsignacion } from "@/lib/dominio/tipos";
import { organizacionSegura, sesionActual } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Usuarios — Ayudas RSTC",
};

export default async function PaginaUsuarios() {
  const sesion = await sesionActual();
  const organizacion = await organizacionSegura();

  let usuarios: UsuarioConAsignacion[] = [];
  let error: string | null = null;
  try {
    usuarios = await listarUsuariosConAsignacion();
  } catch (problema) {
    error = problema instanceof ErrorApi ? problema.message : "No se pudo cargar el listado";
  }

  const opciones = {
    diocesis: diocesisParaCrearUsuario(sesion, organizacion.diocesis),
    vicarias: vicariasParaCrearUsuario(sesion, organizacion.vicarias),
    parroquias: parroquiasParaCrearUsuario(
      sesion,
      organizacion.parroquias,
      organizacion.vicarias,
    ),
  };
  const rolesCreables = rolesQuePuedeCrear(sesion).map(etiquetaRol).join(" o ");

  return (
    <>
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion={`Desde su rol puede crear cuentas con rol ${rolesCreables}, dentro de su alcance territorial.`}
        acciones={<FormularioUsuario opciones={opciones} />}
      />

      {error ? <Aviso tono="peligro">{error}</Aviso> : null}

      <Tarjeta>
        <TablaUsuarios usuarios={usuarios} opciones={opciones} />
      </Tarjeta>
    </>
  );
}
