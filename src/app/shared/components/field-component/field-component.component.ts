import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnChanges, model, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-field-component',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, MatListModule, MatCheckboxModule, MatInputModule, FormsModule, AsyncPipe, MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatAutocompleteModule],
  templateUrl: './field-component.component.html',
  styleUrl: './field-component.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export class FieldComponentComponent implements OnChanges {
   @Input() field!: FormField;
  @Input() formGroup!: FormGroup;
  @Input() errors: any;
  @Input() fieldValue: any;
  @Output() setFieldValue = new EventEmitter<any>();
  @Output() setFileValue = new EventEmitter<any>();
  @Output() ageStatusChange = new EventEmitter<boolean>(); 
  apiService = inject(ApiService);
  isTextRequired: boolean = false;
  datePipe = inject(DatePipe);
  
  myControl = new FormControl('');

  ngOnInit() {

    if (this.field.answerField) {

      // Verifica si la respuesta contiene una fecha válida
      const rawValue = this.field.answerField.answerDate;
      const formattedDate = this.getFormattedDate(rawValue);

      if (formattedDate) {
        this.formGroup.get(this.field.name)?.setValue(formattedDate);
      } else {
        // Asignar otros valores si la fecha no está disponible
        const value = this.field.answerField.answerText ??
          this.field.answerField.answerBoolean ??
          this.field.answerField.answerNumeric;

        if (value != null) {
          this.formGroup.get(this.field.name)?.setValue(value);
        }
      }
    }

    // Agrega validaciones dinámicas basadas en el valor de `required`
    const control = this.formGroup.get(this.field.name);
    if (control) {
      // Si `required` es undefined, se asume como `false`
      const isRequired = !!this.field.required; // Convierte undefined a false
      if (isRequired) {
        control.setValidators([Validators.required]);  // Añade la validación de 'required'
      }
      control.updateValueAndValidity();
    }

  }

    combinedValues = {
      checkboxValue: false,
      textValue: ''
    };
  
    onFieldChange(fieldType: 'checkbox' | 'text', fieldName: string, event: Event | MatCheckboxChange) {
      if (fieldType === 'checkbox') {
        const checkboxEvent = event as MatCheckboxChange;
        this.combinedValues.checkboxValue = checkboxEvent.checked;
      } else if (fieldType === 'text') {
        const inputEvent = event as InputEvent;
        const target = inputEvent.target as HTMLInputElement;
        this.combinedValues.textValue = target?.value || '';
      }
    
      const emittedValue = {
        field: fieldName,  
        value: this.combinedValues,  
        questionID: this.field.questionID,  
        idAnswer: this.field.answerField?.idAnswer
      };
      
      this.setFieldValue.emit(emittedValue);  
    }
    
  
  // Retorna una función que, dado un valor, devuelve la etiqueta (`label`) asociada 
  // de las opciones de un campo. Si no se encuentra la opción o los datos son inválidos, retorna una cadena vacía.
  getOptionLabel(field: any): (value: any) => string {
    return (value: any): string => {
      if (!value || !field || !field.options) {
        return '';
      }
      const selectedOption = field.options.find((option: any) => option.value === value);
      return selectedOption ? selectedOption.label : '';
    };
  }

  getFormattedDate(dateValue: string | number[] | null | undefined): Date | null {
    if (!dateValue) {
      return null;
    }

    if (Array.isArray(dateValue) && dateValue.length === 3) {
      const [year, month, day] = dateValue;
      return new Date(year, month - 1, day); // Mes basado en 0
    }

    if (typeof dateValue === 'string') {
      const parsedDate = new Date(dateValue);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    return null;
  }


  transform(value: number[] | undefined): string | null {
    if (!value || value.length !== 3) return null;
    const [year, month, day] = value;
    return new Date(year, month - 1, day).toLocaleDateString();  // Meses en JavaScript son 0-indexados
  }


  // Input & select
  onValueChange(event: any) {
    // Obtenemos el valor del evento
    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value, questionID: this.field.questionID, idAnswer: this.field.answerField?.idAnswer });
    }


  // Date
  onValueChangeDate(event: any) {
    const value = event.value as Date;
    if (value) {
      // Formatear el valor seleccionado
      const formattedValue = this.datePipe.transform(value, 'yyyy-MM-dd');

      // Actualizar el FormControl con la nueva fecha seleccionada
      this.formGroup.get(this.field.name)?.setValue(value);

      // Emitir el valor formateado
      this.setFieldValue.emit({
        field: this.field.name,
        value: formattedValue,
        questionID: this.field.questionID,
        idAnswer: this.field.answerField?.idAnswer
      });

      // Lógica para verificar si el usuario es menor de edad
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const isMinor =
        age < 18 ||
        (age === 18 &&
          today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()));

      // Emitir el estado de edad
      this.ageStatusChange.emit(isMinor);
    }
  }


  // Check
  onValueChangeCheck(event: any) {
    const value = event.checked; // Extrae el valor booleano del checkbox    
    this.setFieldValue.emit({ field: this.field.name, value: value, questionID: this.field.questionID, idAnswer: this.field.answerField?.idAnswer });
  }

  // Input Event
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (this.field.onInputChange) {
      this.field.onInputChange.changeFunction?.(value);
    }

    this.setFieldValue.emit({ name: this.field.name, value });
  }

  // Autocomplete
  onInputAutocomplete(event: Event): void {

    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (this.field.onInputChange) {
      this.field.onInputChange.changeFunction?.(value);
    }

    this.setFieldValue.emit({ field: this.field.name, value: value });

  }

  // Método para manejar el cambio de archivo
  onValueChangeFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;

    if (files && files.length > 0) {
      this.setFileValue.emit({
        value: files,
        questionID: this.field.questionID,
        type: 'file',
      });
      this.formGroup.get(this.field.name)?.setValue(files);
    } else {
      console.error('No se recibieron archivos.');
    }
  }

  ngOnChanges(changes: SimpleChanges) {


    //llamar a una funcion que itere sobre la lista de validaciones

  }

  hasLastError(fieldName: string): boolean {
    const control = this.formGroup.get(fieldName);
    if (!control) return false;

    const errors = control.errors;
    if (!errors) return false;

    // Considera cualquier error que no sea 'required' como un 'lastError'
    return Object.keys(errors).some(errorKey => errorKey !== 'required');
  }

  onFileClick(file: any) {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWLOAD_FILES}${file.idFile}`,
        data: {},
        responseType: 'blob'
      })
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: response.type || 'application/octet-stream' });

          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = file.fileName || 'downloaded-file';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error al guardar datos: ', error);
        },
      });
  }

}
