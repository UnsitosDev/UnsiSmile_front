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