import Link from "next/link";
import { Boton } from "@/components/ui/boton";
import { Aviso, EncabezadoPagina, Tarjeta } from "@/components/ui/marco";
import { TablaSolicitudes } from "@/components/solicitudes/tablaSolicitudes";
import { ErrorApi } from "@/lib/api/errorApi";
import { listarPersonas } from "@/lib/api/recursos/personas";
import { listarSolicitudes } from "@/lib/api/recursos/solicitudes";
import { puede } from "@/lib/autorizacion/permisos";
import type { Persona, SolicitudAyuda } from "@/lib/dominio/tipos";
import { exigirPermiso, organizacionSegura } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solicitudes — Ayudas RSTC",
};

export default async function PaginaSolicitudes() {
  const sesion = await exigirPermiso("solicitudesVer");
  const organizacion = await organizacionSegura();

  let solicitudes: SolicitudAyuda[] = [];
  let personas: Persona[] = [];
  let error: string | null = null;
  try {
    [solicitudes, personas] = await Promise.all([listarSolicitudes(), listarPersonasSegura()]);
  } catch (problema) {
    error = problema instanceof ErrorApi ? problema.message : "No se pudo cargar el listado";
  }

  const vicariaPorParroquia = Object.fromEntries(
    organizacion.parroquias.map((parroquia) => [parroquia.id, parroquia.vicariaId]),
  );
  const indicePersonas = Object.fromEntries(
    personas.map((persona) => [
      persona.id,
      {
        primerNombre: persona.primerNombre,
        segundoNombre: persona.segundoNombre,
        primerApellido: persona.primerApellido,
        segundoApellido: persona.segundoApellido,
      },
    ]),
  );

  return (
    <>
      <EncabezadoPagina
        titulo="Solicitudes de ayuda"
        descripcion="El listado solo incluye las solicitudes de las parroquias que su rol y alcance permiten ver."
        acciones={
          puede(sesion, "solicitudesCrear") ? (
            <Boton comoHijo>
              <Link href="/solicitudes/nueva">Nueva solicitud</Link>
            </Boton>
          ) : null
        }
      />
      {error ? <Aviso tono="peligro">{error}</Aviso> : null}
      <Tarjeta>
        <TablaSolicitudes
          solicitudes={solicitudes}
          vicariaPorParroquia={vicariaPorParroquia}
          personas={indicePersonas}
        />
      </Tarjeta>
    </>
  );
}

async function listarPersonasSegura(): Promise<Persona[]> {
  try {
    return await listarPersonas();
  } catch {
    return [];
  }
}
