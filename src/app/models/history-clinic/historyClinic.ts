import { formSectionFields } from "../form-fields/form-field.interface";

// Historias clinicas del paciente
export interface ClinicalHistory {
    id: number;                         
    clinicalHistoryName: string;       
    patientClinicalHistoryId: number;  
    patientId: number;                 
}
export interface HistoryData {
    title: string;
    tabs: formSectionFields[];
}

export interface ClinicalHistoryCatalog {
    idClinicalHistoryCatalog: number;
    clinicalHistoryName: string;
    formSections: FormSection[];
}

export interface FormSection {
    idFormSection: number;
    formName: string;
    isAnswered: boolean;
    subSections: SubSection[];
    questions: Question[];
}

export interface SubSection {
}

export interface Question {
    idQuestion: number;
    questionText: string;
    placeholder: string | null;
    required: boolean;
    order: number;
    answerType: AnswerType;
    catalog: Catalog | null;
    answer: string | null;
    questionValidations: Validation[];
}

export interface AnswerType {
    idAnswerType: number;
    description: string;
}

export interface Catalog {
    idCatalog: number;
    catalogName: string;
    catalogOptions: CatalogOption[];
}

export interface CatalogOption {
    idCatalogOption: number;
    optionName: string;
}

export interface Validation {
}