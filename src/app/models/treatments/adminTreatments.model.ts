export interface Patient {
  id:                     string;
  name:                   string;
  medicalRecordNumber:    number;
  idPatientMedicalRecord: number;
}

export interface Professor {
  id:     string;
  name:   string;
}

export interface Student {
  id:           string;
  name:         string;
  idGroup:      number;
  group:        string;
}

export interface TreatmentScope {
  idScopeTreatment:   number;
  name:               string;
}

export interface Treatment {
  idTreatment:                number;
  name:                       string;
  treatmentScope:             TreatmentScope;
  cost:                       number;
  clinicalHistoryCatalogId:   number;
  clinicalHistoryCatalogName: string;
}

export interface TreatmentDetailResponse {
  idTreatmentDetail:  number;
  startDate:          number[];
  endDate:            number[];
  status:             string;
  patient:            Patient;
  professor:          Professor;
  student:            Student;
  treatment:          Treatment;
  teeth:              any;
}
