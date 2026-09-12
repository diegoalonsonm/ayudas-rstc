import type { ItemCatalogo, Parroquia, Persona, Vicaria } from "@/lib/dominio/tipos";

export type CatalogosAsistente = {
  tiposDocumento: ItemCatalogo[];
  sexos: ItemCatalogo[];
  gradosAcademicos: ItemCatalogo[];
  parentescos: ItemCatalogo[];
  rangosIngreso: ItemCatalogo[];
  tiposVivienda: ItemCatalogo[];
  tiposTenencia: ItemCatalogo[];
  condicionesVivienda: ItemCatalogo[];
  tiposAyuda: ItemCatalogo[];
  cantones: ItemCatalogo[];
  distritos: ItemCatalogo[];
  barrios: ItemCatalogo[];
};

export type OrganizacionAsistente = {
  vicarias: Vicaria[];
  parroquias: Parroquia[];
};

export type IntegranteBorrador = {
  clave: string;
  nombreCompleto: string;
  sexoId: string;
  ocupacion: string;
  tipoDocumentoId: string;
  numeroDocumento: string;
  gradoAcademicoId: string;
  rangoIngresoId: string;
  cuentaConSeguro: boolean;
  parentescoId: string;
};

export type AyudaBorrador = {
  tipoAyudaId: string;
  detalle: string;
};

export type BorradorAsistente = {
  personaId: string | null;
  personaResumen: Persona | null;
  documentoBuscado: string;
  parroquiaReceptoraId: string;
  vicariaId: string;
  sectorOficial: string;
  fechaEntrevista: string;
  fechaVisita: string;
  observaciones: string;
  direccion: {
    cantonId: string;
    distritoId: string;
    barrioId: string;
    senas: string;
  };
  integrantes: IntegranteBorrador[];
  vivienda: {
    tipoViviendaId: string;
    tipoTenenciaId: string;
    condicionViviendaId: string;
    observaciones: string;
  };
  ayudas: AyudaBorrador[];
};

export function borradorInicial(fechaHoy: string): BorradorAsistente {
  return {
    personaId: null,
    personaResumen: null,
    documentoBuscado: "",
    parroquiaReceptoraId: "",
    vicariaId: "",
    sectorOficial: "",
    fechaEntrevista: fechaHoy,
    fechaVisita: "",
    observaciones: "",
    direccion: { cantonId: "", distritoId: "", barrioId: "", senas: "" },
    integrantes: [],
    vivienda: {
      tipoViviendaId: "",
      tipoTenenciaId: "",
      condicionViviendaId: "",
      observaciones: "",
    },
    ayudas: [],
  };
}

export function integranteVacio(): IntegranteBorrador {
  return {
    clave: crypto.randomUUID(),
    nombreCompleto: "",
    sexoId: "",
    ocupacion: "",
    tipoDocumentoId: "",
    numeroDocumento: "",
    gradoAcademicoId: "",
    rangoIngresoId: "",
    cuentaConSeguro: false,
    parentescoId: "",
  };
}
