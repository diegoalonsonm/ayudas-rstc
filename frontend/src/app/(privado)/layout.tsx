import { BarraLateral } from "@/components/layout/barraLateral";
import { Encabezado } from "@/components/layout/encabezado";
import { ProveedorConsultas } from "@/components/layout/proveedorConsultas";
import { ProveedorSesion } from "@/lib/sesion/contextoSesion";
import { nombresDeOrganizacion, organizacionSegura, sesionActual } from "@/lib/sesion/servidor";

export default async function LayoutPrivado({ children }: { children: React.ReactNode }) {
  const sesion = await sesionActual();
  const organizacion = await organizacionSegura();

  return (
    <ProveedorSesion sesion={sesion} nombres={nombresDeOrganizacion(organizacion)}>
      <ProveedorConsultas>
        <div className="flex min-h-dvh flex-col lg:flex-row">
          <BarraLateral />
          <div className="flex min-w-0 flex-1 flex-col">
            <Encabezado />
            <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-5 py-6">{children}</main>
          </div>
        </div>
      </ProveedorConsultas>
    </ProveedorSesion>
  );
}
