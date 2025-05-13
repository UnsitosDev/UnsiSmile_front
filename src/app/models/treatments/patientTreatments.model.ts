export interface TreatmentScopeResponse {
    idScopeTreatment: number;
    name: string;
}

export interface TreatmentResponse {
    idTreatment: number;
    name: string;
    treatmentScope: TreatmentScopeResponse;
    cost: number;
    clinicalHistoryCatalogId: number;
    clinicalHistoryCatalogName: string;
}

export interface TreatmentToothResponse {
    idDetailTooth: number;
    idTooth: string;
}

export interface TreatmentDetailResponse {
    idTreatmentDetail: number;
    patientClinicalHistoryId: number;
    patientName: string;
    treatment: TreatmentResponse;
    teeth: TreatmentToothResponse[] | null;
    startDate: number[];
    endDate: number[];
    studentGroupId: number;
    professorId: string;
    professorName: string;
    status: string; 
    patientId: string;
    studentName?: string;
}

// Todos los tratamientos
export interface TreatmentScope {
    idScopeTreatment: number;
    name: string;
}

export interface Treatment {
    idTreatment: number;
    name: string;
    treatmentScope: TreatmentScope;
    cost: number | null;
    clinicalHistoryCatalogId: number;
    clinicalHistoryCatalogName: string;
}

export interface ToothDetail {
    idDetailTooth: number;
    idTooth: string;
}

export type DateArray = [number, number, number, number, number];

export type TreatmentStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING";

export interface AllTreatmentDetailResponse {
    idTreatmentDetail: number;
    patientClinicalHistoryId: number;
    patientName: string;
    treatment: Treatment;
    teeth: ToothDetail[];
    startDate: DateArray;
    endDate: DateArray;
    studentGroupId: number;
    professorId: number | null;
    professorName: string | null;
    status: TreatmentStatus;
    patientId: string;
}