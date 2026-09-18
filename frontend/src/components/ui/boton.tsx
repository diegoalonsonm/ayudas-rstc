import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utiles";

const estilosBoton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variante: {
        primario:
          "bg-[var(--color-primario)] text-white hover:bg-[var(--color-primario-fuerte)]",
        contorno:
          "border border-[var(--color-borde)] bg-[var(--color-superficie)] text-[var(--color-tinta)] hover:bg-[var(--color-lienzo)]",
        sutil:
          "bg-[var(--color-primario-suave)] text-[var(--color-primario-fuerte)] hover:brightness-97",
        fantasma: "text-[var(--color-tinta-suave)] hover:bg-[var(--color-lienzo)] hover:text-[var(--color-tinta)]",
        peligro: "bg-[var(--color-peligro)] text-white hover:brightness-95",
      },
      tamano: {
        normal: "h-9 px-3.5",
        pequeno: "h-8 px-3 text-xs",
        grande: "h-10 px-5",
        icono: "size-9",
      },
    },
    defaultVariants: {
      variante: "primario",
      tamano: "normal",
    },
  },
);

export type PropsBoton = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof estilosBoton> & { comoHijo?: boolean };

export const Boton = React.forwardRef<HTMLButtonElement, PropsBoton>(function Boton(
  { className, variante, tamano, comoHijo = false, ...props },
  ref,
) {
  const Componente = comoHijo ? Slot : "button";
  return (
    <Componente
      ref={ref}
      className={cn(estilosBoton({ variante, tamano }), className)}
      {...props}
    />
  );
});

export { estilosBoton };
