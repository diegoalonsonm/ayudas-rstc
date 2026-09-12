import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayudas RSTC",
  description: "Sistema de ayudas de la Pastoral Social, Diócesis de Cartago",
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
