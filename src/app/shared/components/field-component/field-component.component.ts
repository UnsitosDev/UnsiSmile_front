import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnChanges, model } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormField } from 'src/app/models/form-fields/form-field.interface';



@Component({
  selector: 'app-field-component',
  standalone: true,
  imports: [MatCheckboxModule, MatInputModule, FormsModule, AsyncPipe, MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatAutocompleteModule],
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
  isChecked: boolean = false;

  typeElement: string = '';
  datePipe = inject(DatePipe);

  myControl = new FormControl('');

  ngOnInit() {
    // Verifica si alguno de los valores está presente antes de establecerlo
    if (this.field.answerField) {
      // Asignar el valor correspondiente según el tipo
      const value = this.field.answerField.answerBoolean ?? this.field.answerField.answerNumeric ?? this.field.answerField.answerText;
      
      // Si el valor no es nulo, lo establece en el FormControl
      if (value != null) {
        this.formGroup.get(this.field.name)?.setValue(value);
      }
    }
  }
  
  // Input & select
  onValueChange(event: any) {
    // Obtenemos el valor del evento
    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value, questionID: this.field.questionID });
  }


  // Date
  onValueChangeDate(event: any) {
    const value = event.value as Date;
    this.setFieldValue.emit({ field: this.field.name, value: this.datePipe.transform(value, 'yyyy-MM-dd') });
  }

  // Check
  onValueChangeCheck(event: any) {
    const value = event.checked; // Extrae el valor booleano del checkbox    
    this.setFieldValue.emit({ field: this.field.name, value: value, questionID: this.field.questionID });
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

}
