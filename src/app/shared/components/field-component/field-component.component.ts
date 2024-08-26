import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar ReactiveFormsModule
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-field-component',
  standalone: true,
  imports: [NgFor, MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './field-component.component.html',
  styleUrl: './field-component.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export class FieldComponentComponent {
  @Input() field: any;
  @Input() formGroup!: FormGroup;
  @Input() errors: any;
  @Output() setFieldValue = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<string>();


  typeElement: string = '';
  datePipe = inject(DatePipe);

  onSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }

  onValueChange(event: any) {
    // Verifica si el evento es de tipo MatSelectChange
    if (event instanceof MatSelectChange) {
      const selectedValue = event.value;
      const selectedOption = this.field?.options?.find((option: any) => option.value === selectedValue);
      console.log('Opción seleccionada:', selectedOption);
    }
    // Emite el valor para todos los tipos de eventos
    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value });
  }

  showDate: any; // Para almacenar la fecha formateada

  onValueChangeDate(event: any) {
    const value = event.value as Date;
    this.setFieldValue.emit({ field: this.field.name, value: this.datePipe.transform(value, 'yyyy-MM-dd') });
  }


  /**
 * Verifica si un campo del formulario tiene algún error que no sea 'required'.
 * 
 * @param fieldName - El nombre del campo del formulario a verificar.
 * @returns true si el campo tiene algún error que no sea 'required', false en caso contrario.
 */
  hasLastError(fieldName: string): boolean {
    const control = this.formGroup.get(fieldName);
    if (!control) return false;

    const errors = control.errors;
    if (!errors) return false;

    // Considera cualquier error que no sea 'required' como un 'lastError'
    return Object.keys(errors).some(errorKey => errorKey !== 'required');
  }
}
