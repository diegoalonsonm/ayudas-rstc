"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Shuffle } from "lucide-react";
import { AccionProtegida } from "@/components/autorizacion/accionProtegida";
import { DialogoMotivo } from "@/components/comunes/dialogoMotivo";
import { Paginacion, paginar } from "@/components/comunes/paginacion";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Entrada, Seleccion } from "@/components/ui/campo";
import { ContenidoDialogo, Dialogo, DisparadorDialogo } from "@/components/ui/dialogo";
import { Insignia } from "@/components/ui/insignia";
import { Aviso, Vacio } from "@/components/ui/marco";
import { SelectorAlcance } from "@/components/usuarios/selectorAlcance";
import {
  Celda,
  CeldaEncabezado,
  CabeceraTabla,
  CuerpoTabla,
  FilaTabla,
  Tabla,
} from "@/components/ui/tabla";
import { accionActualizarUsuario, accionCambiarAsignacion } from "@/lib/acciones/usuarios";
import { describirAlcance, validarFormaDeAlcance, type Alcance } from "@/lib/autorizacion/alcance";
import {
  puedeEditarUsuario,
  puedeReasignarUsuario,
  rolesParaReasignar,
} from "@/lib/autorizacion/permisos";
import { CODIGOS_ROL, type CodigoRol } from "@/lib/dominio/enums";
import { etiquetaRol } from "@/lib/dominio/etiquetas";
import type { Diocesis, Parroquia, UsuarioConAsignacion, Vicaria } from "@/lib/dominio/tipos";
import { formatearFechaHora } from "@/lib/formato";
import { useNombresOrganizacion, useSesion } from "@/lib/sesion/contextoSesion";

export function TablaUsuarios({
  usuarios,
  opciones,
}: {
  usuarios: UsuarioConAsignacion[];
  opciones: { diocesis: Diocesis[]; vicarias: Vicaria[]; parroquias: Parroquia[] };
}) {
  const sesion = useSesion();
  const nombres = useNombresOrganizacion();
  const [texto, setTexto] = React.useState("");
  const [pagina, setPagina] = React.useState(1);

  const mapas = React.useMemo(
    () => ({
      diocesis: new Map(Object.entries(nombres.diocesis)),
      vicarias: new Map(Object.entries(nombres.vicarias)),
      parroquias: new Map(Object.entries(nombres.parroquias)),
    }),
    [nombres],
  );

  const filtrados = React.useMemo(() => {
    const consulta = texto.trim().toLowerCase();
    if (!consulta) {
      return usuarios;
    }
    return usuarios.filter((entrada) =>
      `${entrada.usuario.nombreCompleto} ${entrada.usuario.correo}`
        .toLowerCase()
        .includes(consulta),
    );
  }, [usuarios, texto]);

  React.useEffect(() => {
    setPagina(1);
  }, [texto]);

  const visibles = paginar(filtrados, pagina);

  return (
    <div>
      <div className="border-b border-[var(--color-borde)] px-5 py-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-tinta-suave)]" />
          <Entrada
            className="pl-9"
            placeholder="Filtrar por nombre o correo"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            aria-label="Filtrar usuarios"
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <Vacio mensaje="Ningún usuario coincide con el filtro." />
      ) : (
        <>
          <Tabla>
            <CabeceraTabla>
              <tr>
                <CeldaEncabezado>Nombre</CeldaEncabezado>
                <CeldaEncabezado>Correo</CeldaEncabezado>
                <CeldaEncabezado>Rol</CeldaEncabezado>
                <CeldaEncabezado>Alcance</CeldaEncabezado>
                <CeldaEncabezado alineacion="centro">Estado</CeldaEncabezado>
                <CeldaEncabezado>Último acceso</CeldaEncabezado>
                <CeldaEncabezado alineacion="derecha" />
              </tr>
            </CabeceraTabla>
            <CuerpoTabla>
              {visibles.map(({ usuario, asignacion }) => (
                <FilaTabla key={usuario.id}>
                  <Celda className="font-medium">
                    {usuario.nombreCompleto}
                    {usuario.id === sesion.usuarioId ? (
                      <span className="ml-2 text-xs text-[var(--color-tinta-suave)]">(usted)</span>
                    ) : null}
                  </Celda>
                  <Celda>{usuario.correo}</Celda>
                  <Celda>
                    {asignacion?.rolCodigo ? (
                      <Insignia tono="informacion">{etiquetaRol(asignacion.rolCodigo)}</Insignia>
                    ) : (
                      "—"
                    )}
                  </Celda>
                  <Celda>
                    {asignacion
                      ? describirAlcance(
                          {
                            diocesisId: asignacion.diocesisId,
                            vicariaId: asignacion.vicariaId,
                            parroquiaId: asignacion.parroquiaId,
                          },
                          mapas,
                        )
                      : "—"}
                  </Celda>
                  <Celda alineacion="centro">
                    {usuario.activo ? (
                      <Insignia tono="exito">Activo</Insignia>
                    ) : (
                      <Insignia tono="peligro">Inactivo</Insignia>
                    )}
                  </Celda>
                  <Celda>{formatearFechaHora(usuario.ultimoAccesoEn)}</Celda>
                  <Celda alineacion="derecha">
                    <div className="flex justify-end gap-1.5">
                      <AccionProtegida
                        permitido={puedeEditarUsuario(sesion, usuario.id)}
                        motivo="Solo el administrador puede cambiar el estado de otros usuarios"
                      >
                        <DialogoMotivo
                          titulo={usuario.activo ? "Desactivar usuario" : "Activar usuario"}
                          descripcion={`La cuenta de ${usuario.nombreCompleto} quedará ${usuario.activo ? "inactiva" : "activa"}.`}
                          textoConfirmar={usuario.activo ? "Desactivar" : "Activar"}
                          varianteConfirmar={usuario.activo ? "peligro" : "primario"}
                          disparador={
                            <Boton variante="fantasma" tamano="pequeno">
                              {usuario.activo ? "Desactivar" : "Activar"}
                            </Boton>
                          }
                          alConfirmar={async (motivo) =>
                            await accionActualizarUsuario(usuario.id, {
                              activo: !usuario.activo,
                              motivo,
                            })
                          }
                        />
                      </AccionProtegida>
                      <AccionProtegida
                        permitido={puedeReasignarUsuario(sesion, usuario.id)}
                        motivo={
                          sesion.usuarioId === usuario.id
                            ? "Nadie puede cambiar su propio rol ni su propio alcance"
                            : "Solo el administrador o el coordinador diocesano puede cambiar la asignación de un usuario"
                        }
                      >
                        <FormularioAsignacion
                          usuarioId={usuario.id}
                          nombre={usuario.nombreCompleto}
                          rolActual={(asignacion?.rolCodigo as CodigoRol) ?? CODIGOS_ROL[0]}
                          opciones={opciones}
                        />
                      </AccionProtegida>
                    </div>
                  </Celda>
                </FilaTabla>
              ))}
            </CuerpoTabla>
          </Tabla>
          <Paginacion pagina={pagina} total={filtrados.length} alCambiar={setPagina} />
        </>
      )}
    </div>
  );
}

function FormularioAsignacion({
  usuarioId,
  nombre,
  rolActual,
  opciones,
}: {
  usuarioId: string;
  nombre: string;
  rolActual: CodigoRol;
  opciones: { diocesis: Diocesis[]; vicarias: Vicaria[]; parroquias: Parroquia[] };
}) {
  const sesion = useSesion();
  const router = useRouter();
  const roles = rolesParaReasignar(sesion);
  const [abierto, setAbierto] = React.useState(false);
  const [rolCodigo, setRolCodigo] = React.useState<CodigoRol>(
    roles.includes(rolActual) ? rolActual : (roles[0] ?? rolActual),
  );
  const [alcance, setAlcance] = React.useState<Alcance>({
    diocesisId: null,
    vicariaId: null,
    parroquiaId: null,
  });
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [guardando, setGuardando] = React.useState(false);

  const problemaAlcance = validarFormaDeAlcance(rolCodigo, alcance);

  async function guardar() {
    setError(null);
    setGuardando(true);
    const resultado = await accionCambiarAsignacion(usuarioId, {
      rolCodigo,
      diocesisId: alcance.diocesisId,
      vicariaId: alcance.vicariaId,
      parroquiaId: alcance.parroquiaId,
      motivo,
    });
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
        <Boton variante="fantasma" tamano="pequeno">
          <Shuffle />
          Reasignar
        </Boton>
      </DisparadorDialogo>
      <ContenidoDialogo
        titulo={`Cambiar asignación de ${nombre}`}
        descripcion="Se cierra la asignación vigente y se abre una nueva desde hoy."
      >
        <div className="space-y-4">
          <Campo etiqueta="Rol" requerido>
            <Seleccion
              value={rolCodigo}
              onChange={(evento) => {
                setRolCodigo(evento.target.value as CodigoRol);
                setAlcance({ diocesisId: null, vicariaId: null, parroquiaId: null });
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

          <Campo etiqueta="Motivo">
            <AreaTexto value={motivo} onChange={(evento) => setMotivo(evento.target.value)} />
          </Campo>

          {problemaAlcance ? <Aviso tono="advertencia">{problemaAlcance}</Aviso> : null}
          {error ? <Aviso tono="peligro">{error}</Aviso> : null}

          <div className="flex justify-end gap-2">
            <Boton variante="contorno" onClick={() => setAbierto(false)} disabled={guardando}>
              Cancelar
            </Boton>
            <Boton onClick={guardar} disabled={guardando || Boolean(problemaAlcance)}>
              {guardando ? "Guardando…" : "Cambiar asignación"}
            </Boton>
          </div>
        </div>
      </ContenidoDialogo>
    </Dialogo>
  );
}
