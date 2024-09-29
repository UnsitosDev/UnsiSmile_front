import { formSectionFields } from "../form-fields/form-field.interface";

export interface HistoryData {
    title: string;
    tabs: formSectionFields[];
}

export interface ClinicalHistoryCatalog {
    idClinicalHistoryCatalog: number;
    clinicalHistoryName: string;
    formSections: any;
  }
  