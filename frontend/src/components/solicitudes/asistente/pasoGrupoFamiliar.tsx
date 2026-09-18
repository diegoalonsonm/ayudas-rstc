"use client";

import { Plus, Trash2 } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Casilla, Entrada, Seleccion } from "@/components/ui/campo";
import { Aviso, Vacio } from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import {
  integranteVacio,
  type BorradorAsistente,
  type CatalogosAsistente,
  type IntegranteBorrador,
} from "./tipos";

export function PasoGrupoFamiliar({
  borrador,
  catalogos,
  alCambiar,
}: {
  borrador: BorradorAsistente;
  catalogos: CatalogosAsistente;
  alCambiar: (cambio: Partial<BorradorAsistente>) => void;
}) {
  function actualizar(clave: string, cambio: Partial<IntegranteBorrador>) {
    alCambiar({
      integrantes: borrador.integrantes.map((integrante) =>
        integrante.clave === clave ? { ...integrante, ...cambio } : integrante,
      ),
    });
  }

  function agregar() {
    alCambiar({ integrantes: [...borrador.integrantes, integranteVacio()] });
  }

  function quitar(clave: string) {
    alCambiar({
      integrantes: borrador.integrantes.filter((integrante) => integrante.clave !== clave),
    });
  }

  return (
    <div className="space-y-4">
      <Aviso tono="informacion">
        El ingreso mensual se recopila por rango, no como monto exacto. Esta composición familiar
        queda guardada tal como se declaró en la entrevista.
      </Aviso>

      {borrador.integrantes.length === 0 ? (
        <div className="marco">
          <Vacio
            mensaje="Todavía no ha agregado integrantes del grupo familiar o de convivencia."
            accion={
              <Boton variante="contorno" tamano="pequeno" onClick={agregar}>
                <Plus />
                Agregar integrante
              </Boton>
            }
          />
        </div>
      ) : (
        <div className="marco">
          <Tabla className="min-w-[64rem]">
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Nombre</CeldaEncabezado>
                <CeldaEncabezado>Sexo</CeldaEncabezado>
                <CeldaEncabezado>Ocupación</CeldaEncabezado>
                <CeldaEncabezado>Documento</CeldaEncabezado>
                <CeldaEncabezado>Grado académico</CeldaEncabezado>
                <CeldaEncabezado>Ingreso mensual</CeldaEncabezado>
                <CeldaEncabezado>Parentesco</CeldaEncabezado>
                <CeldaEncabezado alineacion="centro">Seguro</CeldaEncabezado>
                <CeldaEncabezado />
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {borrador.integrantes.map((integrante) => (
                <FilaTabla key={integrante.clave}>
                  <Celda className="min-w-44">
                    <Entrada
                      value={integrante.nombreCompleto}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { nombreCompleto: evento.target.value })
                      }
                      placeholder="Nombre completo"
                      aria-label="Nombre completo"
                    />
                  </Celda>
                  <Celda className="min-w-28">
                    <Seleccion
                      value={integrante.sexoId}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { sexoId: evento.target.value })
                      }
                      aria-label="Sexo"
                    >
                      <option value="">—</option>
                      {catalogos.sexos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </Seleccion>
                  </Celda>
                  <Celda className="min-w-36">
                    <Entrada
                      value={integrante.ocupacion}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { ocupacion: evento.target.value })
                      }
                      aria-label="Ocupación"
                    />
                  </Celda>
                  <Celda className="min-w-44">
                    <div className="flex gap-1.5">
                      <Seleccion
                        className="w-28"
                        value={integrante.tipoDocumentoId}
                        onChange={(evento) =>
                          actualizar(integrante.clave, { tipoDocumentoId: evento.target.value })
                        }
                        aria-label="Tipo de documento"
                      >
                        <option value="">—</option>
                        {catalogos.tiposDocumento.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nombre}
                          </option>
                        ))}
                      </Seleccion>
                      <Entrada
                        value={integrante.numeroDocumento}
                        onChange={(evento) =>
                          actualizar(integrante.clave, { numeroDocumento: evento.target.value })
                        }
                        placeholder="Número"
                        aria-label="Número de documento"
                      />
                    </div>
                  </Celda>
                  <Celda className="min-w-36">
                    <Seleccion
                      value={integrante.gradoAcademicoId}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { gradoAcademicoId: evento.target.value })
                      }
                      aria-label="Grado académico"
                    >
                      <option value="">—</option>
                      {catalogos.gradosAcademicos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </Seleccion>
                  </Celda>
                  <Celda className="min-w-44">
                    <Seleccion
                      value={integrante.rangoIngresoId}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { rangoIngresoId: evento.target.value })
                      }
                      aria-label="Rango de ingreso"
                    >
                      <option value="">—</option>
                      {catalogos.rangosIngreso.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </Seleccion>
                  </Celda>
                  <Celda className="min-w-32">
                    <Seleccion
                      value={integrante.parentescoId}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { parentescoId: evento.target.value })
                      }
                      aria-label="Parentesco"
                    >
                      <option value="">—</option>
                      {catalogos.parentescos.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nombre}
                        </option>
                      ))}
                    </Seleccion>
                  </Celda>
                  <Celda alineacion="centro">
                    <Casilla
                      checked={integrante.cuentaConSeguro}
                      onChange={(evento) =>
                        actualizar(integrante.clave, { cuentaConSeguro: evento.target.checked })
                      }
                      aria-label="Cuenta con seguro"
                    />
                  </Celda>
                  <Celda alineacion="derecha">
                    <Boton
                      variante="fantasma"
                      tamano="icono"
                      onClick={() => quitar(integrante.clave)}
                      aria-label={`Quitar ${integrante.nombreCompleto || "integrante"}`}
                    >
                      <Trash2 />
                    </Boton>
                  </Celda>
                </FilaTabla>
              ))}
            </CuerpoTabla>
          </Tabla>
          <div className="border-t border-[var(--color-borde)] px-5 py-3">
            <Boton variante="contorno" tamano="pequeno" onClick={agregar}>
              <Plus />
              Agregar integrante
            </Boton>
          </div>
        </div>
      )}
    </div>
  );
}
