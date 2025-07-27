import { formSectionFields } from "../form-fields/form-field.interface";

// Historias clinicas del paciente
export interface MedicalRecord {
    id: number;                         
    medicalRecordName: string;       
    patientMedicalRecordId: number;  
    patientId: string;                 
}

export interface MedicalRecordCatalog {
    idPatientMedicalRecord:   number;
    idMedicalRecordCatalog: number;
    medicalRecordName:      string;
    medicalRecordNumber:      number;
    appointmentDate:          Date;
    formSections:             FormSection[];
}

export interface FormSection {
    idFormSection: string;
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

export interface MedicalRecordCatalogRelation {
    statusKey: string;
    idMedicalRecordCatalog: number;
    medicalRecordName: string | null; // Puede ser null
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
    idPatientMedicalRecord: number;
    medicalRecordCatalog: MedicalRecordCatalogRelation; // Cambiado aquí
    patient: Patient;
    date: [number, number, number, number, number, number, number]; // Array de números
}

export enum EMedicalRecords {
  GENERAL = "GENERAL",
  PROTESIS_BUCAL = "PROTESIS_BUCAL",
  PERIODONCIA = "PERIODONCIA",
  OPERATORIA_DENTAL = "OPERATORIA_DENTAL",
  CIRUGIA_BUCAL = "CIRUGIA_BUCAL",
  ODONTOLOGIA_PREVENTIVA = "ODONTOLOGIA_PREVENTIVA",
  ENDODONCIA = "ENDODONCIA",
  PULPOTOMIA = "PULPOTOMIA",
  PULPECTOMIA = "PULPECTOMIA"
}

export const MedicalRecordsDescription = new Map<EMedicalRecords, string>([
  [EMedicalRecords.GENERAL, "General"],
  [EMedicalRecords.PROTESIS_BUCAL, "Prótesis bucal"],
  [EMedicalRecords.PERIODONCIA, "Periodoncia"],
  [EMedicalRecords.OPERATORIA_DENTAL, "Operatoria dental"],
  [EMedicalRecords.CIRUGIA_BUCAL, "Cirugía bucal"],
  [EMedicalRecords.ODONTOLOGIA_PREVENTIVA, "Odontología preventiva y salud pública"],
  [EMedicalRecords.ENDODONCIA, "Endodoncia"],
  [EMedicalRecords.PULPOTOMIA, "Pulpotomía"],
  [EMedicalRecords.PULPECTOMIA, "Pulpectomía"]
]);

export interface MedicalRecordsDigitizer {
    id: number;
    medicalRecordName: string;
    patientId: string | null;
    patientMedicalRecordId: number | null;
}
