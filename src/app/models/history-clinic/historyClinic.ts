import { formSectionFields } from "../form-fields/form-field.interface";

// Historias clinicas del paciente
export interface ClinicalHistory {
    id: number;                         
    clinicalHistoryName: string;       
    patientClinicalHistoryId: number;  
    patientId: string;                 
}

export interface ClinicalHistoryCatalog {
    idClinicalHistoryCatalog: number;
    clinicalHistoryName: string;
    formSections: FormSection[];
    medicalRecordNumber: number;
}

export interface FormSection {
    idFormSection: number;
    formName: string;
    isAnswered: boolean;
    subSections: SubSection[]; // Array de SubSection
    questions: Question[];
    status: string;
    requiresReview: boolean;
    reviewStatus: reviewStatus;
}

export interface reviewStatus {
    idReviewStatus: number;
    status: string;
    message: string;
}

export interface SubSection {
    formName: string;
    idSubSection: number; // Identificador único para la subsección
    subSectionName: string; // Nombre de la subsección
    questions: Question[]; // Preguntas relacionadas con esta subsección
    isAnswered: boolean | boolean;
    order: number;
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

export interface ClinicalHistoryCatalogRelation {
    statusKey: string;
    idClinicalHistoryCatalog: number;
    clinicalHistoryName: string | null; // Puede ser null
}

export interface Patient {
    statusKey: string;
    idPatient: number;
    admissionDate: string | null; // Puede ser null
    isMinor: boolean | null; // Puede ser null
    hasDisability: boolean | null; // Puede ser null
    nationality: string | null; // Puede ser null
    person: string | null; // Puede ser null
    address: string | null; // Puede ser null
    maritalStatus: string | null; // Puede ser null
    occupation: string | null; // Puede ser null
    ethnicGroup: string | null; // Puede ser null
    religion: string | null; // Puede ser null
    guardian: string | null; // Puede ser null
}

export interface RelationHistoryPatient {
    statusKey: string;
    idPatientClinicalHistory: number;
    clinicalHistoryCatalog: ClinicalHistoryCatalogRelation; // Cambiado aquí
    patient: Patient;
    date: [number, number, number, number, number, number, number]; // Array de números
}