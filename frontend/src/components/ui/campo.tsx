import * as React from "react";
import { cn } from "@/lib/utiles";

const CLASES_CONTROL =
  "h-9 w-full rounded-lg border border-[var(--color-borde)] bg-[var(--color-superficie)] px-3 text-sm text-[var(--color-tinta)] placeholder:text-[var(--color-tinta-suave)] disabled:cursor-not-allowed disabled:bg-[var(--color-lienzo)] disabled:text-[var(--color-tinta-suave)]";

export const Entrada = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Entrada({ className, ...props }, ref) {
    return <input ref={ref} className={cn(CLASES_CONTROL, className)} {...props} />;
  },
);

export const AreaTexto = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AreaTexto({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(CLASES_CONTROL, "h-auto min-h-20 py-2 leading-relaxed", className)}
      {...props}
    />
  );
});

export const Seleccion = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Seleccion({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(CLASES_CONTROL, "pr-8", className)} {...props}>
      {children}
    </select>
  );
});

export const Casilla = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Casilla({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "size-4 shrink-0 rounded border-[var(--color-borde)] accent-[var(--color-primario)]",
          className,
        )}
        {...props}
      />
    );
  },
);

export function Etiqueta({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-[var(--color-tinta)]", className)} {...props}>
      {children}
    </label>
  );
}

export function Campo({
  etiqueta,
  error,
  ayuda,
  requerido,
  className,
  children,
}: {
  etiqueta: string;
  error?: string;
  ayuda?: string;
  requerido?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Etiqueta>
        {etiqueta}
        {requerido ? <span className="ml-0.5 text-[var(--color-peligro)]">*</span> : null}
      </Etiqueta>
      {children}
      {ayuda && !error ? (
        <p className="text-xs text-[var(--color-tinta-suave)]">{ayuda}</p>
      ) : null}
      {error ? <p className="text-xs text-[var(--color-peligro)]">{error}</p> : null}
    </div>
  );
}
