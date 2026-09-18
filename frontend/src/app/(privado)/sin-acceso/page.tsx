import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Tarjeta, CuerpoTarjeta } from "@/components/ui/marco";
import { etiquetaRol } from "@/lib/dominio/etiquetas";
import { sesionActual } from "@/lib/sesion/servidor";

export default async function PaginaSinAcceso() {
  const sesion = await sesionActual();

  return (
    <Tarjeta className="mx-auto max-w-xl">
      <CuerpoTarjeta className="space-y-4 py-10 text-center">
        <ShieldAlert className="mx-auto size-10 text-[var(--color-aviso)]" />
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Esta sección no está disponible para su rol</h1>
          <p className="text-sm text-[var(--color-tinta-suave)]">
            Su rol actual es <strong>{etiquetaRol(sesion.rolCodigo)}</strong>. El acceso a esta
            sección está reservado a otros roles. Si necesita entrar, solicite el cambio de
            asignación a un administrador.
          </p>
        </div>
        <Boton comoHijo variante="contorno">
          <Link href="/panel">Volver al panel</Link>
        </Boton>
      </CuerpoTarjeta>
    </Tarjeta>
  );
}
