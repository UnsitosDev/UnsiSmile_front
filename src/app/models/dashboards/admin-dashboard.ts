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


export interface PatientsByNationality {
  [nationality: string]: number;
}

export interface Treatments {
  resins:               number;
  prophylaxis:          number;
  fluorosis:            number;
  pitAndFissureSealers: number;
  extractions:          number;
  prosthesisRemovable:  number;
  removableProsthesis:  number;
  prosthodontics:       number;
  rootCanals:           number;
  scrapedAndSmoothed:   number;
  closedAndOpen:        number;
  distalWedges:         number;
  pulpotomyAndCrowns:   number;
  pulpectomyAndCrowns:  number;
}

export interface StatisticsResponse {
  totalPatients:                number;
  patientsWithDisability:       number;
  patientsRegisteredLastMonth:  number;
  patientsByNationality:        PatientsByNationality;
  totalStudents:                number;
  studentsRegisteredLastMonth:  number;
  totalProfessors:              number;
  treatments:                   Treatments;
  rejectedTreatments:           number;
  progressingTreatments:        number;
  inReviewTreatments:           number;
}
