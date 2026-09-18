import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Puede } from "@/components/autorizacion/puede";
import { FormularioPersona } from "@/components/personas/formularioPersona";
import { PanelDirecciones } from "@/components/personas/panelDirecciones";
import { Boton } from "@/components/ui/boton";
import {
  Aviso,
  CabeceraTarjeta,
  CuerpoTarjeta,
  Dato,
  EncabezadoPagina,
  RejillaDatos,
  Tarjeta,
} from "@/components/ui/marco";
import { ErrorApi } from "@/lib/api/errorApi";
import { listarCatalogos } from "@/lib/api/recursos/catalogos";
import { listarDirecciones, obtenerPersona } from "@/lib/api/recursos/personas";
import type { Direccion } from "@/lib/dominio/tipos";
import { formatearFechaHora, nombreCompletoPersona } from "@/lib/formato";
import { exigirPermiso } from "@/lib/sesion/servidor";

export const dynamic = "force-dynamic";

export default async function PaginaPersona({ params }: { params: Promise<{ id: string }> }) {
  await exigirPermiso("personasVer");
  const { id } = await params;

  let persona;
  try {
    persona = await obtenerPersona(id);
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) {
      notFound();
    }
    throw error;
  }

  const catalogos = await listarCatalogos([
    "tipos-documento",
    "cantones",
    "distritos",
    "barrios",
  ]);
  const direcciones = await direccionesSeguras(id);

  return (
    <>
      <div>
        <Boton comoHijo variante="fantasma" tamano="pequeno" className="mb-3 -ml-2">
          <Link href="/personas">
            <ArrowLeft />
            Volver a personas
          </Link>
        </Boton>
        <EncabezadoPagina
          titulo={nombreCompletoPersona(persona)}
          descripcion="Ficha de la persona solicitante."
          acciones={
            <Puede accion="personasEditar">
              <FormularioPersona
                tiposDocumento={catalogos["tipos-documento"]}
                persona={persona}
                disparador={<Boton variante="contorno">Editar persona</Boton>}
              />
            </Puede>
          }
        />
      </div>

      <Aviso tono="informacion" titulo="Datos cifrados">
        El número de documento y el teléfono se cifran con AES-256-GCM al guardarse y el backend
        nunca los devuelve descifrados, así que la ficha solo indica si están registrados.
      </Aviso>

      <Tarjeta>
        <CabeceraTarjeta titulo="Datos de identificación" />
        <CuerpoTarjeta>
          <RejillaDatos>
            <Dato etiqueta="Primer nombre">{persona.primerNombre}</Dato>
            <Dato etiqueta="Segundo nombre">{persona.segundoNombre ?? "—"}</Dato>
            <Dato etiqueta="Primer apellido">{persona.primerApellido}</Dato>
            <Dato etiqueta="Segundo apellido">{persona.segundoApellido ?? "—"}</Dato>
            <Dato etiqueta="Tipo de documento">
              {catalogos["tipos-documento"].find((item) => item.id === persona.tipoDocumentoId)
                ?.nombre ?? "—"}
            </Dato>
            <Dato etiqueta="Número de documento">
              {persona.numeroDocumentoHash ? "Documento registrado" : "Sin documento"}
            </Dato>
            <Dato etiqueta="Teléfono">
              {persona.telefono ? "Teléfono registrado" : "Sin teléfono"}
            </Dato>
            <Dato etiqueta="Registrada">{formatearFechaHora(persona.creadoEn)}</Dato>
            <Dato etiqueta="Última actualización">
              {formatearFechaHora(persona.actualizadoEn)}
            </Dato>
          </RejillaDatos>
        </CuerpoTarjeta>
      </Tarjeta>

      <PanelDirecciones
        personaId={persona.id}
        direcciones={direcciones}
        catalogos={{
          cantones: catalogos.cantones,
          distritos: catalogos.distritos,
          barrios: catalogos.barrios,
        }}
      />
    </>
  );
}

async function direccionesSeguras(personaId: string): Promise<Direccion[]> {
  try {
    return await listarDirecciones(personaId);
  } catch {
    return [];
  }
}
