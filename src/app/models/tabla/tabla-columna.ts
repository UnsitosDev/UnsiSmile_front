import { columnPatientsTableData, patientsTableData } from "../shared/patients";



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
      clase = new columnPatientsTableData(); break;
   
  }

  if(clase){
    resultados = Object.keys(clase);
  }
  return resultados
}
