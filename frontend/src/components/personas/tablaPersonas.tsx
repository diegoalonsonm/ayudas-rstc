"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Entrada } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { Paginacion, paginar } from "@/components/comunes/paginacion";
import type { Persona } from "@/lib/dominio/tipos";
import { formatearFecha, nombreCompletoPersona } from "@/lib/formato";

export function TablaPersonas({ personas }: { personas: Persona[] }) {
  const [texto, setTexto] = React.useState("");
  const [pagina, setPagina] = React.useState(1);

  const filtradas = React.useMemo(() => {
    const consulta = texto.trim().toLowerCase();
    const vigentes = personas.filter((persona) => !persona.eliminadoEn);
    if (!consulta) {
      return vigentes;
    }
    return vigentes.filter((persona) =>
      nombreCompletoPersona(persona).toLowerCase().includes(consulta),
    );
  }, [personas, texto]);

  React.useEffect(() => {
    setPagina(1);
  }, [texto]);

  const visibles = paginar(filtradas, pagina);

  return (
    <div>
      <div className="border-b border-[var(--color-borde)] px-5 py-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-tinta-suave)]" />
          <Entrada
            className="pl-9"
            placeholder="Filtrar por nombre"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            aria-label="Filtrar personas por nombre"
          />
        </div>
        <p className="mt-2 text-xs text-[var(--color-tinta-suave)]">
          El filtro por nombre es local. Para ubicar a alguien por documento use la búsqueda de
          procesos vigentes, porque el documento se guarda cifrado.
        </p>
      </div>

      {filtradas.length === 0 ? (
        <Vacio mensaje="Ninguna persona coincide con el filtro, o su alcance no incluye expedientes con personas." />
      ) : (
        <>
          <Tabla>
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Nombre</CeldaEncabezado>
                <CeldaEncabezado>Documento</CeldaEncabezado>
                <CeldaEncabezado>Teléfono</CeldaEncabezado>
                <CeldaEncabezado alineacion="derecha">Registrada</CeldaEncabezado>
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {visibles.map((persona) => (
                <FilaTabla key={persona.id}>
                  <Celda>
                    <Link
                      href={`/personas/${persona.id}`}
                      className="font-medium text-[var(--color-primario-fuerte)] hover:underline"
                    >
                      {nombreCompletoPersona(persona)}
                    </Link>
                  </Celda>
                  <Celda>
                    {persona.numeroDocumentoHash ? (
                      <Insignia tono="informacion">Registrado</Insignia>
                    ) : (
                      <Insignia>Sin documento</Insignia>
                    )}
                  </Celda>
                  <Celda>
                    {persona.telefono ? (
                      <Insignia tono="informacion">Registrado</Insignia>
                    ) : (
                      <Insignia>Sin teléfono</Insignia>
                    )}
                  </Celda>
                  <Celda alineacion="derecha">{formatearFecha(persona.creadoEn)}</Celda>
                </FilaTabla>
              ))}
            </CuerpoTabla>
          </Tabla>
          <Paginacion pagina={pagina} total={filtradas.length} alCambiar={setPagina} />
        </>
      )}
    </div>
  );
}
