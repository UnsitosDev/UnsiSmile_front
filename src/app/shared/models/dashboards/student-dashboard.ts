export interface StudentDashboard {
    totalPatients:               number;
    patientsWithDisability:      number;
    patientsRegisteredLastMonth: number;
    patientsByNationality:       PatientsByNationality;
    patientsUnder18:             number;
    patientsBetween18And60:      number;
    patientsOver60:              number;
}

export interface PatientsByNationality {
    additionalProp1: number;
    additionalProp2: number;
    additionalProp3: number;
}

