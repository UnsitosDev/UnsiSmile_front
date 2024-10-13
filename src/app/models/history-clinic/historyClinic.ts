import { formSectionFields } from "../form-fields/form-field.interface";

// Historias clinicas del paciente
export interface ClinicalHistory {
    id: number;                         
    clinicalHistoryName: string;       
    patientClinicalHistoryId: number;  
    patientId: number;                 
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
    subSections: SubSection[]; // Array de SubSection
    questions: Question[];
}

export interface SubSection {
    formName: string;
    idSubSection: number; // Identificador único para la subsección
    subSectionName: string; // Nombre de la subsección
    questions: Question[]; // Preguntas relacionadas con esta subsección
}

export interface Question {
    idQuestion: number;
    questionText: string;
    placeholder: string | '';
    required: boolean;
    order: number;
    answerType: AnswerType;
    catalog: Catalog | null;
    answer: Answer | null;
    questionValidations: Validation[];
}

export interface Answer {
    answerBoolean: boolean | null;
    answerCatalogOption: any | null;
    answerDate: string | null;
    answerNumeric: number | null;
    answerText: string | null;
    files: boolean | null;
    idAnswer: number | null;
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

// Interfaz para el tipo de validación
export interface ValidationType {
    idValidationType: number;  // ID del tipo de validación
    validationCode: string;     // Código de la validación
}

// Interfaz para cada objeto de validación
export interface Validation {
    idValidation: number;        // ID de la validación
    validationValue: string;     // Valor de validación (puede ser regex, min, max, etc.)
    validationMessage: string;   // Mensaje asociado a la validación
    validationType: ValidationType;  // Tipo de validación
}