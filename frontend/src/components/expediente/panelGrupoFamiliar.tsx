"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { Boton } from "@/components/ui/boton";
import { Campo, Casilla, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Aviso, CabeceraTarjeta, Tarjeta, Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { accionCrearIntegrante } from "@/lib/acciones/solicitudes";
import { puede } from "@/lib/autorizacion/permisos";
import { nombreDeCatalogo } from "@/lib/dominio/catalogos";
import type { IntegranteConvivencia, ItemCatalogo } from "@/lib/dominio/tipos";
import { siONo, textoOGuion } from "@/lib/formato";
import { useSesion } from "@/lib/sesion/contextoSesion";

type CatalogosIntegrante = {
  sexos: ItemCatalogo[];
  tiposDocumento: ItemCatalogo[];
  gradosAcademicos: ItemCatalogo[];
  rangosIngreso: ItemCatalogo[];
  parentescos: ItemCatalogo[];
};

export function PanelGrupoFamiliar({
  solicitudId,
  integrantes,
  catalogos,
}: {
  solicitudId: string;
  integrantes: IntegranteConvivencia[];
  catalogos: CatalogosIntegrante;
}) {
  const sesion = useSesion();
  const vigentes = integrantes.filter((integrante) => !integrante.eliminadoEn);

  return (
    <Tarjeta>
      <CabeceraTarjeta
        titulo="Grupo familiar y de convivencia"
        descripcion="El ingreso se registra por rango, según la ficha física."
        acciones={
          <AccionProtegida
            permitido={puede(sesion, "integrantesEscribir")}
            motivo="Su rol no permite registrar integrantes"
          >
            <FormularioIntegrante solicitudId={solicitudId} catalogos={catalogos} />
          </AccionProtegida>
        }
      />
      {vigentes.length === 0 ? (
        <Vacio mensaje="Todavía no hay integrantes registrados en este expediente." />
      ) : (
        <Tabla>
          <CabeceraTabla>
            <tr>
              <CeldaEncabezado>Nombre</CeldaEncabezado>
              <CeldaEncabezado>Parentesco</CeldaEncabezado>
              <CeldaEncabezado>Sexo</CeldaEncabezado>
              <CeldaEncabezado>Ocupación</CeldaEncabezado>
              <CeldaEncabezado>Grado académico</CeldaEncabezado>
              <CeldaEncabezado>Ingreso mensual</CeldaEncabezado>
              <CeldaEncabezado alineacion="centro">Seguro</CeldaEncabezado>
            </tr>
          </CabeceraTabla>
          <CuerpoTabla>
            {vigentes.map((integrante) => (
              <FilaTabla key={integrante.id}>
                <Celda className="font-medium">{integrante.nombreCompleto}</Celda>
                <Celda>{nombreDeCatalogo(catalogos.parentescos, integrante.parentescoId)}</Celda>
                <Celda>{nombreDeCatalogo(catalogos.sexos, integrante.sexoId)}</Celda>
                <Celda>{textoOGuion(integrante.ocupacion)}</Celda>
                <Celda>
                  {nombreDeCatalogo(catalogos.gradosAcademicos, integrante.gradoAcademicoId)}
                </Celda>
                <Celda>
                  {nombreDeCatalogo(catalogos.rangosIngreso, integrante.rangoIngresoId)}
                </Celda>
                <Celda alineacion="centro">{siONo(integrante.cuentaConSeguro)}</Celda>
              </FilaTabla>
            ))}
          </CuerpoTabla>
        </Tabla>
      )}
    </Tarjeta>
  );
}

function FormularioIntegrante({
  solicitudId,
  catalogos,
}: {
  solicitudId: string;
  catalogos: CatalogosIntegrante;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    nombreCompleto: "",
    parentescoId: "",
    sexoId: "",
    ocupacion: "",
    tipoDocumentoId: "",
    numeroDocumento: "",
    gradoAcademicoId: "",
    rangoIngresoId: "",
    cuentaConSeguro: false,
  });

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionCrearIntegrante(solicitudId, {
      nombreCompleto: valores.nombreCompleto,
      parentescoId: valores.parentescoId,
      sexoId: valores.sexoId,
      ocupacion: valores.ocupacion,
      tipoDocumentoId: valores.tipoDocumentoId,
      numeroDocumento: valores.numeroDocumento,
      gradoAcademicoId: valores.gradoAcademicoId,
      rangoIngresoId: valores.rangoIngresoId,
      cuentaConSeguro: valores.cuentaConSeguro,
    });
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setValores({
      nombreCompleto: "",
      parentescoId: "",
      sexoId: "",
      ocupacion: "",
      tipoDocumentoId: "",
      numeroDocumento: "",
      gradoAcademicoId: "",
      rangoIngresoId: "",
      cuentaConSeguro: false,
    });
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton variante="contorno" tamano="pequeno">
          <Plus />
          Agregar integrante
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Agregar integrante"
        descripcion="El número de documento se cifra en el servidor al guardarse."
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
            <Campo etiqueta="Parentesco">
              <Seleccion
                value={valores.parentescoId}
                onChange={(evento) =>
                  setValores({ ...valores, parentescoId: evento.target.value })
                }
              >
                <option value="">Sin especificar</option>
                {catalogos.parentescos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Sexo">
              <Seleccion
                value={valores.sexoId}
                onChange={(evento) => setValores({ ...valores, sexoId: evento.target.value })}
              >
                <option value="">Sin especificar</option>
                {catalogos.sexos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Ocupación">
              <Entrada
                value={valores.ocupacion}
                onChange={(evento) => setValores({ ...valores, ocupacion: evento.target.value })}
              />
            </Campo>
            <Campo etiqueta="Grado académico">
              <Seleccion
                value={valores.gradoAcademicoId}
                onChange={(evento) =>
                  setValores({ ...valores, gradoAcademicoId: evento.target.value })
                }
              >
                <option value="">Sin especificar</option>
                {catalogos.gradosAcademicos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Tipo de documento">
              <Seleccion
                value={valores.tipoDocumentoId}
                onChange={(evento) =>
                  setValores({ ...valores, tipoDocumentoId: evento.target.value })
                }
              >
                <option value="">Sin especificar</option>
                {catalogos.tiposDocumento.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Número de documento">
              <Entrada
                value={valores.numeroDocumento}
                onChange={(evento) =>
                  setValores({ ...valores, numeroDocumento: evento.target.value })
                }
              />
            </Campo>
            <Campo etiqueta="Ingreso mensual" className="sm:col-span-2">
              <Seleccion
                value={valores.rangoIngresoId}
                onChange={(evento) =>
                  setValores({ ...valores, rangoIngresoId: evento.target.value })
                }
              >
                <option value="">Sin especificar</option>
                {catalogos.rangosIngreso.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Casilla
              checked={valores.cuentaConSeguro}
              onChange={(evento) =>
                setValores({ ...valores, cuentaConSeguro: evento.target.checked })
              }
            />
            Cuenta con seguro social
          </label>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton
              onClick={guardar}
              disabled={guardando || !valores.nombreCompleto.trim()}
            >
              {guardando ? "Guardando…" : "Agregar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
