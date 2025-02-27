import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export function onFieldValueChange(event: any, formGroup: FormGroup, serviceCall?: (param: string) => Observable<any>, length?: number, fieldsToUpdate?: string[]): void {
  const { name, value } = event;
  formGroup.get(name)?.setValue(value);

  // Si se proporciona un servicio y una longitud, llama a la función para obtener los datos
  if (serviceCall && length && value.length === length) {
    serviceCall(value).subscribe({
      next: (response) => {
        // Actualiza los campos de autocompletado si se especifican
        if (fieldsToUpdate) {
          fieldsToUpdate.forEach((field, index) => {
            formGroup.get(field)?.setValue(response[index]?.name || '');
          });
        }
      },
      error: (error) => {
        console.error(`Error al obtener los datos para ${name}:`, error);
      }
    });
  }
}

export function getFieldValue(formGroup: FormGroup, fieldName: string) {
  return formGroup.get(fieldName)?.value;
}

// FieldNames nuevo Paciente, se usan en archivo(form-fields.service)

export class FieldNames {
  static readonly GENDER = 'gender';
  static readonly HOUSING_CATEGORY = 'housingCategory';
  static readonly STREET_NAME = 'streetName';
  static readonly NEIGHBORHOOD_NAME = 'neighborhoodName';
  static readonly LOCALITY_NAME = 'localityName';
  static readonly MUNICIPALITY_NAME = 'municipalityName';
  static readonly STATE_NAME = 'stateName';
  static readonly NATIONALITY = 'nationality';
  static readonly MARITAL_STATUS = 'maritalStatus';
  static readonly OCCUPATION = 'occupation';
  static readonly ETHNIC_GROUP = 'ethnicGroup';
  static readonly RELIGION = 'religion';
  static readonly PARENTS_MARITAL_STATUS = 'parentsMaritalStatus';
}