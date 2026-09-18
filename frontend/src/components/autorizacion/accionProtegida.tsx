"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function AccionProtegida({
  permitido,
  motivo,
  children,
}: {
  permitido: boolean;
  motivo: string;
  children: React.ReactElement<{ disabled?: boolean }>;
}) {
  if (permitido) {
    return children;
  }
  const deshabilitado = React.cloneElement(children, { disabled: true });
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="inline-flex cursor-not-allowed">{deshabilitado}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-50 max-w-64 rounded-md bg-[var(--color-tinta)] px-2.5 py-1.5 text-xs text-white shadow-md"
          >
            {motivo}
            <Tooltip.Arrow className="fill-[var(--color-tinta)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
