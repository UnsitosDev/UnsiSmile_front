export interface MedicalRecordHistoryResponse {
  patient: Patient;
  page:    Page;
}

export interface Page {
  totalElements:    number;
  totalPages:       number;
  pageable:         Pageable;
  size:             number;
  content:          MedicalRecordHistory[];
  number:           number;
  sort:             Sort;
  first:            boolean;
  last:             boolean;
  numberOfElements: number;
  empty:            boolean;
}

export interface MedicalRecordHistory {
  id:                     number;
  medicalRecordName:      string;
  patientMedicalRecordId: number;
  appointmentDate:        Date;
  treatmentDetail:        TreatmentDetail;
}

export interface TreatmentDetail {
  idTreatmentDetail: number;
  startDate:         Date;
  endDate:           Date;
  status:            string;
  patient:           Patient;
  approvalProfessor: Professor;
  reviewProfessor:   Professor;
  student:           Student;
  treatment:         Treatment;
  teeth:             Tooth[];
}

export interface Professor {
  idProfessorClinicalArea: number;
  professorName:           string;
  comments:                string;
}

export interface Patient {
  id:                     string;
  name:                   string;
  medicalRecordNumber:    number;
  idPatientMedicalRecord: number;
}

export interface Student {
  id:      string;
  name:    string;
  idGroup: number;
  group:   string;
}

export interface Tooth {
  idDetailTooth: number;
  idTooth:       string;
  endDate:       Date;
  status:        string;
  isRecent:      boolean;
}

export interface Treatment {
  idTreatment:              number;
  name:                     string;
  treatmentScope:           TreatmentScope;
  cost:                     number;
  medicalRecordCatalogId:   number;
  medicalRecordCatalogName: string;
}

export interface TreatmentScope {
  idScopeTreatment: number;
  name:             string;
}

export interface Pageable {
  pageNumber: number;
  pageSize:   number;
  paged:      boolean;
  unpaged:    boolean;
  offset:     number;
  sort:       Sort;
}

export interface Sort {
  sorted:   boolean;
  unsorted: boolean;
  empty:    boolean;
}
