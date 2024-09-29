import { formSectionFields } from "../form-fields/form-field.interface";

export interface HistoryData {
    title: string;
    tabs: formSectionFields[];
}

export interface ClinicalHistoryCatalog {
    idClinicalHistoryCatalog: number; // ID del catálogo de historia clínica
    clinicalHistoryName: string;       // Nombre de la historia clínica
    formSections: any[];               
  } 