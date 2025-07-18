export interface DigitizerRequest {
  idMedicalRecordDigitizer: number;
  studentFullName: string;
  idStudent: string;
  startDate: string;
  endDate: string;
  status: string; // Agregado el campo status
}
