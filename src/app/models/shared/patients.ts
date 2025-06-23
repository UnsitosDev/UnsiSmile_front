export interface Ipatients {
  nombre: string,
  edad: number
  sexo: string
  telefono: number
  email: string
}
export class patientsTableData {
  patientID = 0
  nombres = ''
  apellidos = ''
  correo = ''
  curp = ''
  idMedicalHistory = 0
  estatus = ''  // Nuevo campo
}

export class patientsTableDataProfessor {
  nombres = ''
  apellidos = ''
  curp = ''
  expediente  = 0
}

export class columnPatientsTableData {
  nombres = ''
  apellidos = ''
  correo = ''
  curp = ''

}