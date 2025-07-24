import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { ProgressNotesService } from 'src/app/services/form-progress-notes.service';

@Component({
  selector: 'app-field-component',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, MatListModule, MatCheckboxModule, MatInputModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatAutocompleteModule],
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
  @Input() disabledMultivalued: boolean = false; 
  progressNotesService = inject(ProgressNotesService);
  apiService = inject(ApiService);
  isTextRequired: boolean = false;
  datePipe = inject(DatePipe);
  
  myControl = new FormControl('');
  maxDate = new Date(); // Añadir esta línea para definir maxDate

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
      const control = this.formGroup.get(this.field.name);
      if (control) {
        // Actualizar el valor y forzar la validación
        control.setValue(value);
        control.markAsTouched();
        control.updateValueAndValidity();

        // Solo proceder si no hay errores de validación
        if (!control.errors) {
          const formattedValue = this.datePipe.transform(value, 'yyyy-MM-dd');
          this.setFieldValue.emit({
            field: this.field.name,
            value: formattedValue,
            questionID: this.field.questionID,
            idAnswer: this.field.answerField?.idAnswer
          });

          // Verificar si es fecha de nacimiento para calcular si es menor de edad
          if (this.field.name === 'birthDate') {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            
            this.ageStatusChange.emit(age < 18);
          }
        }
      }
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

    // Solo llamar a la función de búsqueda si hay contenido y cumple con la longitud mínima
    if (this.field.onInputChange && value.length >= (this.field.onInputChange.length || 1)) {
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

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.formGroup.get(fieldName);
    return control?.errors?.[errorType] && control.touched;
  }

  getErrorMessage(fieldName: string): string | undefined {
    const control = this.formGroup.get(fieldName);
    if (control?.errors) {
      if (control.errors['futureDate']) {
        return this.errors?.futureDate;
      }
      if (control.errors['required']) {
        return this.errors?.required;
      }
      if (control.errors['lastError']) {
        return this.errors?.lastError;
      }
    }
    return undefined;
  }

  onFileClick(file: any) {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWLOAD_FILES_SECTION}/${file.idFile}`,
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
