import { Suspense } from "react";
import { FormularioIngreso } from "@/components/sesion/formularioIngreso";

export const metadata = {
  title: "Ingreso — Ayudas RSTC",
};

export default function PaginaIngreso() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-[var(--color-primario)] text-base font-semibold text-white">
            PS
          </span>
          <h1 className="text-xl font-semibold tracking-tight">Ayudas RSTC</h1>
          <p className="text-sm text-[var(--color-tinta-suave)]">
            Pastoral Social, Diócesis de Cartago
          </p>
        </div>
        <Suspense fallback={null}>
          <FormularioIngreso />
        </Suspense>
      </div>
    </main>
  );
}
