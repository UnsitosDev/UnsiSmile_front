export interface ClinicalArea {
    idClinicalArea: number;
    clinicalArea: string;
    professors: Professor[] | null; 
}

export interface ProfessorClinicalAreaResponse {
    idProfessorClinicalArea: number;
    professorName: string;
    clinicalArea: ClinicalArea;
}

export interface Professor {
    idProfessor: number;
    name: string;
}