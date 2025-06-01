export interface ReviewAsigneds {
    idReviewStatus:          number;
    status:                  string;
    message:                 string;
    idPatientMedicalRecord:  number;
    idSection:               number;
    idProfessorClinicalArea: number;
    idTreatmentDetail:       number;
    studentName:             string;
    patient:                 Patient;
}

interface Patient {
    id:                  string;
    name:                string;
    curp:                string;
    medicalRecordNumber: number;
}


export const REVIEW_TABLE_DATA = ["Paciente", "CURP", "Expediente", "Estudiante"];