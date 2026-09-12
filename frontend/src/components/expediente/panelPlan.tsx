"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Truck } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Insignia } from "@/components/ui/insignia";
import {
  Aviso,
  CabeceraTarjeta,
  CuerpoTarjeta,
  Dato,
  RejillaDatos,
  Tarjeta,
  Vacio,
} from "@/components/ui/marco";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import {
  accionCrearDetallePlan,
  accionCrearPlan,
  accionRegistrarEntrega,
} from "@/lib/acciones/planes";
import { motivoPlanBloqueado, puede, puedeDecidirPlan } from "@/lib/autorizacion/permisos";
import type { DetalleConEntregas } from "@/lib/api/recursos/planes";
import { DecisionPlanAyuda, EstadoSolicitud, FRECUENCIAS_ENTREGA } from "@/lib/dominio/enums";
import { ETIQUETAS_DECISION, etiquetaFrecuencia } from "@/lib/dominio/etiquetas";
import type { ItemCatalogo, PlanAyuda } from "@/lib/dominio/tipos";
import { fechaDeHoy, formatearFecha, formatearMonto, textoOGuion } from "@/lib/formato";
import { useSesion } from "@/lib/sesion/contextoSesion";

export type PlanConDetalles = PlanAyuda & { detalles: DetalleConEntregas[] };

export function PanelPlan({
  solicitudId,
  estado,
  planes,
  tiposAyuda,
}: {
  solicitudId: string;
  estado: EstadoSolicitud;
  planes: PlanConDetalles[];
  tiposAyuda: ItemCatalogo[];
}) {
  const sesion = useSesion();
  const vigentes = planes.filter((plan) => !plan.eliminadoEn);

  return (
    <div className="space-y-6">
      <Tarjeta>
        <CabeceraTarjeta
          titulo="Decisión del plan de ayuda"
          descripcion="Registrar un plan aprobado o rechazado documenta la decisión del comité sobre el expediente."
          acciones={
            <AccionProtegida
              permitido={puedeDecidirPlan(sesion, estado)}
              motivo={motivoPlanBloqueado(sesion)}
            >
              <FormularioPlan solicitudId={solicitudId} estado={estado} />
            </AccionProtegida>
          }
        />
        {vigentes.length === 0 ? (
          <Vacio mensaje="Este expediente todavía no tiene una decisión de plan registrada." />
        ) : (
          <CuerpoTarjeta className="space-y-5">
            {vigentes.map((plan) => (
              <div key={plan.id} className="space-y-3 border-b border-[var(--color-borde)] pb-5 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Insignia
                    tono={plan.decision === DecisionPlanAyuda.APROBADA ? "exito" : "peligro"}
                  >
                    {ETIQUETAS_DECISION[plan.decision]}
                  </Insignia>
                  <AccionProtegida
                    permitido={
                      puede(sesion, "planesDetallesCrear") &&
                      plan.decision === DecisionPlanAyuda.APROBADA
                    }
                    motivo={
                      plan.decision !== DecisionPlanAyuda.APROBADA
                        ? "Un plan rechazado no admite detalles de ayuda"
                        : "Solo un coordinador parroquial o superior puede definir el detalle del plan"
                    }
                  >
                    <FormularioDetalle
                      solicitudId={solicitudId}
                      planId={plan.id}
                      tiposAyuda={tiposAyuda}
                    />
                  </AccionProtegida>
                </div>
                <RejillaDatos>
                  <Dato etiqueta="Vigencia">
                    {formatearFecha(plan.fechaInicio)} — {formatearFecha(plan.fechaFin)}
                  </Dato>
                  <Dato etiqueta="Decidido">{formatearFecha(plan.decididoEn)}</Dato>
                  <Dato etiqueta="Motivo">{textoOGuion(plan.motivoDecision)}</Dato>
                </RejillaDatos>

                {plan.detalles.length === 0 ? (
                  <p className="text-sm text-[var(--color-tinta-suave)]">
                    El plan no tiene detalles de ayuda definidos.
                  </p>
                ) : (
                  <TablaDetalles
                    solicitudId={solicitudId}
                    detalles={plan.detalles}
                    tiposAyuda={tiposAyuda}
                  />
                )}
              </div>
            ))}
          </CuerpoTarjeta>
        )}
      </Tarjeta>
    </div>
  );
}

function TablaDetalles({
  solicitudId,
  detalles,
  tiposAyuda,
}: {
  solicitudId: string;
  detalles: DetalleConEntregas[];
  tiposAyuda: ItemCatalogo[];
}) {
  const sesion = useSesion();

  return (
    <div className="marco overflow-hidden">
      <Tabla>
        <CabeceraTabla>
          <tr>
            <CeldaEncabezado>Tipo de ayuda</CeldaEncabezado>
            <CeldaEncabezado>Descripción</CeldaEncabezado>
            <CeldaEncabezado>Frecuencia</CeldaEncabezado>
            <CeldaEncabezado alineacion="derecha">Aprobado</CeldaEncabezado>
            <CeldaEncabezado alineacion="derecha">Entregado</CeldaEncabezado>
            <CeldaEncabezado alineacion="centro">Entregas</CeldaEncabezado>
            <CeldaEncabezado alineacion="derecha" />
          </tr>
        </CabeceraTabla>
        <CuerpoTabla>
          {detalles.map((detalle) => {
            const entregas = detalle.entregas.filter((entrega) => !entrega.eliminadoEn);
            const entregado = entregas.reduce((suma, entrega) => suma + (entrega.monto ?? 0), 0);
            const aprobado = detalle.montoEstimado ?? 0;
            const excedido = aprobado > 0 && entregado > aprobado;
            return (
              <FilaTabla key={detalle.id}>
                <Celda className="font-medium">
                  {tiposAyuda.find((item) => item.id === detalle.tipoAyudaId)?.nombre ??
                    detalle.tipoAyudaId}
                </Celda>
                <Celda>{textoOGuion(detalle.descripcion)}</Celda>
                <Celda>{etiquetaFrecuencia(detalle.frecuencia)}</Celda>
                <Celda alineacion="derecha">{formatearMonto(detalle.montoEstimado)}</Celda>
                <Celda alineacion="derecha">
                  <span className={excedido ? "text-[var(--color-peligro)]" : undefined}>
                    {formatearMonto(entregado)}
                  </span>
                  {excedido ? (
                    <span className="block text-xs text-[var(--color-peligro)]">
                      supera lo aprobado
                    </span>
                  ) : null}
                </Celda>
                <Celda alineacion="centro">{entregas.length}</Celda>
                <Celda alineacion="derecha">
                  <AccionProtegida
                    permitido={puede(sesion, "entregasRegistrar")}
                    motivo="Su rol no permite registrar entregas"
                  >
                    <FormularioEntrega solicitudId={solicitudId} detalleId={detalle.id} />
                  </AccionProtegida>
                </Celda>
              </FilaTabla>
            );
          })}
        </CuerpoTabla>
      </Tabla>
      <ListaEntregas detalles={detalles} tiposAyuda={tiposAyuda} />
    </div>
  );
}

function ListaEntregas({
  detalles,
  tiposAyuda,
}: {
  detalles: DetalleConEntregas[];
  tiposAyuda: ItemCatalogo[];
}) {
  const entregas = detalles.flatMap((detalle) =>
    detalle.entregas
      .filter((entrega) => !entrega.eliminadoEn)
      .map((entrega) => ({ entrega, detalle })),
  );
  if (entregas.length === 0) {
    return null;
  }
  return (
    <div className="border-t border-[var(--color-borde)] px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta-suave)]">
        Entregas registradas
      </p>
      <ul className="space-y-1.5">
        {entregas
          .sort((uno, otro) => otro.entrega.fechaEntrega.localeCompare(uno.entrega.fechaEntrega))
          .map(({ entrega, detalle }) => (
            <li key={entrega.id} className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="text-[var(--color-tinta-suave)]">
                {formatearFecha(entrega.fechaEntrega)}
              </span>
              <span className="font-medium">
                {tiposAyuda.find((item) => item.id === detalle.tipoAyudaId)?.nombre ?? "Ayuda"}
              </span>
              <span>{formatearMonto(entrega.monto)}</span>
              {entrega.descripcion ? (
                <span className="text-[var(--color-tinta-suave)]">— {entrega.descripcion}</span>
              ) : null}
            </li>
          ))}
      </ul>
    </div>
  );
}

function FormularioPlan({
  solicitudId,
  estado,
}: {
  solicitudId: string;
  estado: EstadoSolicitud;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    decision: DecisionPlanAyuda.APROBADA as DecisionPlanAyuda,
    fechaInicio: fechaDeHoy(),
    fechaFin: "",
    motivoDecision: "",
  });

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionCrearPlan(solicitudId, estado, valores);
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton tamano="pequeno">Registrar decisión</Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Registrar la decisión del plan"
        descripcion="Queda asociada a su usuario y a la fecha del sistema."
      >
        <div className="space-y-4">
          <Campo etiqueta="Decisión" requerido>
            <Seleccion
              value={valores.decision}
              onChange={(evento) =>
                setValores({ ...valores, decision: evento.target.value as DecisionPlanAyuda })
              }
            >
              <option value={DecisionPlanAyuda.APROBADA}>Aprobada</option>
              <option value={DecisionPlanAyuda.RECHAZADA}>Rechazada</option>
            </Seleccion>
          </Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Fecha de inicio">
              <Entrada
                type="date"
                value={valores.fechaInicio}
                onChange={(evento) =>
                  setValores({ ...valores, fechaInicio: evento.target.value })
                }
              />
            </Campo>
            <Campo etiqueta="Fecha de fin">
              <Entrada
                type="date"
                value={valores.fechaFin}
                onChange={(evento) => setValores({ ...valores, fechaFin: evento.target.value })}
              />
            </Campo>
          </div>
          <Campo
            etiqueta="Motivo de la decisión"
            ayuda="Recomendado siempre, imprescindible si se rechaza."
          >
            <AreaTexto
              value={valores.motivoDecision}
              onChange={(evento) =>
                setValores({ ...valores, motivoDecision: evento.target.value })
              }
            />
          </Campo>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}

function FormularioDetalle({
  solicitudId,
  planId,
  tiposAyuda,
}: {
  solicitudId: string;
  planId: string;
  tiposAyuda: ItemCatalogo[];
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    tipoAyudaId: "",
    descripcion: "",
    frecuencia: "",
    montoEstimado: "",
  });

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionCrearDetallePlan(solicitudId, planId, {
      tipoAyudaId: valores.tipoAyudaId,
      descripcion: valores.descripcion,
      frecuencia: valores.frecuencia || null,
      montoEstimado: valores.montoEstimado,
    });
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setValores({ tipoAyudaId: "", descripcion: "", frecuencia: "", montoEstimado: "" });
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton variante="contorno" tamano="pequeno">
          <Plus />
          Agregar detalle
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Agregar detalle del plan"
        descripcion="El monto estimado es lo aprobado; las entregas se comparan contra este valor."
      >
        <div className="space-y-4">
          <Campo etiqueta="Tipo de ayuda" requerido>
            <Seleccion
              value={valores.tipoAyudaId}
              onChange={(evento) => setValores({ ...valores, tipoAyudaId: evento.target.value })}
              autoFocus
            >
              <option value="">Seleccione el tipo</option>
              {tiposAyuda.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </Seleccion>
          </Campo>
          <Campo etiqueta="Descripción">
            <Entrada
              value={valores.descripcion}
              onChange={(evento) => setValores({ ...valores, descripcion: evento.target.value })}
            />
          </Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Frecuencia">
              <Seleccion
                value={valores.frecuencia}
                onChange={(evento) => setValores({ ...valores, frecuencia: evento.target.value })}
              >
                <option value="">Sin especificar</option>
                {FRECUENCIAS_ENTREGA.map((valor) => (
                  <option key={valor} value={valor}>
                    {etiquetaFrecuencia(valor)}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Monto estimado" ayuda="En colones, sin separadores.">
              <Entrada
                type="number"
                min={0}
                value={valores.montoEstimado}
                onChange={(evento) =>
                  setValores({ ...valores, montoEstimado: evento.target.value })
                }
              />
            </Campo>
          </div>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton onClick={guardar} disabled={guardando || !valores.tipoAyudaId}>
              {guardando ? "Guardando…" : "Agregar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}

function FormularioEntrega({
  solicitudId,
  detalleId,
}: {
  solicitudId: string;
  detalleId: string;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);
  const [valores, setValores] = React.useState({
    fechaEntrega: fechaDeHoy(),
    descripcion: "",
    monto: "",
    observaciones: "",
  });

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionRegistrarEntrega(solicitudId, detalleId, valores);
    setGuardando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setValores({ fechaEntrega: fechaDeHoy(), descripcion: "", monto: "", observaciones: "" });
    setAbierto(false);
    router.refresh();
  }

  return (
    <Dialogo open={abierto} onOpenChange={setAbierto}>
      <DisparadorDialogo asChild>
        <Boton variante="sutil" tamano="pequeno">
          <Truck />
          Registrar entrega
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo="Registrar entrega"
        descripcion="Queda asociada a su usuario como responsable."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Fecha de entrega" requerido>
              <Entrada
                type="date"
                value={valores.fechaEntrega}
                onChange={(evento) =>
                  setValores({ ...valores, fechaEntrega: evento.target.value })
                }
              />
            </Campo>
            <Campo etiqueta="Monto">
              <Entrada
                type="number"
                min={0}
                value={valores.monto}
                onChange={(evento) => setValores({ ...valores, monto: evento.target.value })}
              />
            </Campo>
          </div>
          <Campo etiqueta="Descripción">
            <Entrada
              value={valores.descripcion}
              onChange={(evento) => setValores({ ...valores, descripcion: evento.target.value })}
              placeholder="Diarios de alimentos, pago de recibo, etc."
            />
          </Campo>
          <Campo etiqueta="Observaciones">
            <AreaTexto
              value={valores.observaciones}
              onChange={(evento) =>
                setValores({ ...valores, observaciones: evento.target.value })
              }
            />
          </Campo>
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}
          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton onClick={guardar} disabled={guardando || !valores.fechaEntrega}>
              {guardando ? "Guardando…" : "Registrar"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
