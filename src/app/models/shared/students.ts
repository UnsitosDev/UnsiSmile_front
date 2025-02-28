export interface Istudents {
  nombre: string,
  apellido: string,
  correo: string,
  matricula: string,
  status: string  // Agregado status
}

export class studentsTableData {
  nombre = ''
  apellido = ''
  correo = ''
  matricula = ''
  estatus = ''  // Agregado status
}

export interface PatientsByNationality {
  [nationality: string]: number; 
}

export interface Data {
  patientsWithDisability: number;
  patientsRegisteredLastMonth: number;
  patients: number;
  patientsByNationality: PatientsByNationality;
}

export interface Dashboard {
  data: Data;
}
