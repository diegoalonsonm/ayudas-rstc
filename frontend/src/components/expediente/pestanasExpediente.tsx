"use client";

import * as React from "react";
import { ListaPestanas, PanelPestana, Pestana, Pestanas } from "@/components/ui/pestanas";

export function PestanasExpediente({
  resumen,
  grupoFamiliar,
  vivienda,
  ayudas,
  plan,
  consentimientos,
  historial,
  cantidades,
}: {
  resumen: React.ReactNode;
  grupoFamiliar: React.ReactNode;
  vivienda: React.ReactNode;
  ayudas: React.ReactNode;
  plan: React.ReactNode;
  consentimientos: React.ReactNode;
  historial: React.ReactNode;
  cantidades: {
    integrantes: number;
    ayudas: number;
    planes: number;
    documentos: number;
  };
}) {
  return (
    <Pestanas defaultValue="resumen">
      <ListaPestanas>
        <Pestana valor="resumen">Resumen</Pestana>
        <Pestana valor="grupo">Grupo familiar ({cantidades.integrantes})</Pestana>
        <Pestana valor="vivienda">Vivienda</Pestana>
        <Pestana valor="ayudas">Ayuda solicitada ({cantidades.ayudas})</Pestana>
        <Pestana valor="plan">Plan y entregas ({cantidades.planes})</Pestana>
        <Pestana valor="consentimientos">Consentimientos ({cantidades.documentos})</Pestana>
        <Pestana valor="historial">Historial</Pestana>
      </ListaPestanas>
      <PanelPestana valor="resumen">{resumen}</PanelPestana>
      <PanelPestana valor="grupo">{grupoFamiliar}</PanelPestana>
      <PanelPestana valor="vivienda">{vivienda}</PanelPestana>
      <PanelPestana valor="ayudas">{ayudas}</PanelPestana>
      <PanelPestana valor="plan">{plan}</PanelPestana>
      <PanelPestana valor="consentimientos">{consentimientos}</PanelPestana>
      <PanelPestana valor="historial">{historial}</PanelPestana>
    </Pestanas>
  );
}
