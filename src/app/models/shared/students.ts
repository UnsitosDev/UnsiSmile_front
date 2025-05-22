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

export class StudentTreatment {
  nombre = ''
  apellido = ''
  matricula = ''
}
