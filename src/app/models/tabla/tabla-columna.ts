import { columnPatientsTableData, patientsTableData } from "../shared/patients";
import { studentsTableData } from "../shared/students";
import { AdminTableData } from "../shared/admin/admin";


//* El parámetro genérico T en la interfaz Accion
//* permite que la propiedad fila pueda ser un objeto de cualquier tipo.

export interface Accion<T = any> {
  accion: string; //editar - eliminar
  fila?: T // registro
}

export const getEntityPropiedades = (entidad: string): Array<any> => {
  let resultados: any = [];
  let clase: any;

  switch(entidad){
    case 'patients':
      clase = new columnPatientsTableData(); 
      break;
    case 'student':
      clase = new studentsTableData(); 
      break;
    case 'admin':
      clase = new AdminTableData();  // Agregamos el caso para admin
      break;
  }

  if(clase){
    resultados = Object.keys(clase);
  }
  return resultados
}
