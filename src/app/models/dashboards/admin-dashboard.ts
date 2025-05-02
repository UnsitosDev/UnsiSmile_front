export interface AdminDashboard {
    totalPatients: number;
    patientsWithDisability: number;
    patientsRegisteredLastMonth: number;
    patientsByNationality: PatientsByNationality;
    totalStudents: number;
    studentsRegisteredLastMonth: number;
    totalProfessors: number;
}

export interface PatientsByNationality {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

export interface SupervisorDashboard {
    totalPatients: number;
    totalStudents: number;
    clinicalHistoriesInReview: number;
    clinicalHistoriesRejected: number;
    clinicalHistoriesAccepted: number;
    treatmentsCompleted: number;
}

export interface ProfessorDashboard {
    totalGroups: number;
    totalStudents: number;
}
