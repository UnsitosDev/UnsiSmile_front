export interface ProfessorTableData {
    nombre: string;
    apellido: string;
    correo: string;
    'numero empleado': string;
    estatus: string;
    curp?: string;
    telefono?: string;
    fechaNacimiento?: string;
  }
  
  export interface ProfessorResponse {
    person: {
      firstName: string;
      firstLastName: string;
      secondLastName?: string;
      email: string;
      curp: string;
      phone: string;
      birthDate: string;
    };
    employeeNumber: string;
    user: {
      status: boolean;
    };
  }