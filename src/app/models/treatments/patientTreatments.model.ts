export interface TreatmentDetailResponse {
    idTreatmentDetail: number;
    startDate:         number[];
    endDate:           number[];
    status:            string;
    patient:           Patient;     
    professor:         Professor;
    student:           Student;
    treatment:         Treatment;
    teeth:             Tooth[];
    comments:          string;
}

interface Patient {
    id:                     string;
    name:                   string;
    medicalRecordNumber:    number;
    idPatientMedicalRecord: number;
}

interface Professor {
    id:   string;
    name: string;
}

interface Student {
    id:      string;
    name:    string;
    idGroup: number;
    group:   string;
}

interface Tooth {
    idDetailTooth: number;
    idTooth:       string;
}

interface Treatment {
    idTreatment:                number;
    name:                       string;
    treatmentScope:             TreatmentScope;
    cost:                       number;
    clinicalHistoryCatalogId:   number;
    clinicalHistoryCatalogName: string;
}

export interface TreatmentScope {
    idScopeTreatment: number;
    name:             string;
}



export type DateArray = [number, number, number, number, number];

export type TreatmentStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING";