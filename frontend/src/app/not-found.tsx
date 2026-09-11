import Link from "next/link";
import { Boton } from "@/components/ui/boton";

export default function NoEncontrado() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-lg font-semibold">No encontramos lo que buscaba</h1>
        <p className="text-sm text-[var(--color-tinta-suave)]">
          El recurso no existe, fue eliminado, o está fuera del alcance territorial de su rol. El
          backend responde igual en los tres casos para no revelar información de otras
          parroquias.
        </p>
        <Boton comoHijo variante="contorno">
          <Link href="/panel">Volver al panel</Link>
        </Boton>
      </div>
    </main>
  );
}
