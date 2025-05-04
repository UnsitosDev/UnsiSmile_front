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
    teeth: TreatmentToothResponse[];
    startDate: number[];
    endDate: number[];
    studentGroupId: number;
    professorId: string;
    professorName: string;
    status: string; 
}