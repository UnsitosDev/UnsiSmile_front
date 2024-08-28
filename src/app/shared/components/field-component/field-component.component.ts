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
import { InputChangeConfig } from 'src/app/models/form-fields/form-field.interface';
import { PatientService } from 'src/app/services/patient/patient.service';

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


  typeElement: string = '';
  datePipe = inject(DatePipe);

  // onSelectionChange(event: any) {
  //   const selectedValue = event.value;
  //   const selectedOption = this.field?.options?.find((option: any) => option.value === selectedValue);
  //   const obj = {
  //     id: selectedOption.value,
  //     label: selectedOption.label
  //   }
  //   console.log('Valor emitido desde select:', obj); // Para depuración
  //   const value = event.target ? event.target.value : event.value;
  //   this.setFieldValue.emit({ field: this.field.name, value: value });

  // }

  onSelectionChange(event: any) {
    // const selectedValue = event.value;
    // const selectedOption = this.field?.options?.find((option: any) => option.value === selectedValue);
    // console.log('Valor emitido desde select:', selectedOption  ); 
    // this.setFieldValue.emit({ field: this.field.name, value: selectedValue  });
    // this.setFieldValue.emit({ field: this.field.name, value: selectedOption  });
    // this.onSelectionChange2(selectedValue);
  }

  onSelectionChange2(event: any) {
    const selectedValue2 = event.value;

    const selectedOption = this.field?.options?.find((option: any) => option.value === selectedValue2);
    // console.log('Valor emitido desde select:', selectedOption  ); 
    // this.setFieldValue.emit({ field: this.field.name, value: selectedValue  });
    this.setFieldValue.emit({ field: this.field.name, value: selectedOption });
  }



  onValueChange(event: any) {
    // Emite el valor para todos los tipos de eventos
    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value });
  }


  // handleSelectChange(event: any) {
  //   const selectedValue = event.value;
  //   const selectedOption = this.field?.options?.find((option: any) => option.value === selectedValue);
  //   const obj = {
  //     id: selectedOption.value,
  //     label: selectedOption.label
  //   }
  //   this.selectedLabel = obj.label; // Actualiza la propiedad con el label seleccionado
  //   console.log('Valor emitido desde select:', obj.label); // Para depuración
  //   const value = event.target ? event.target.value : event.value;
  //   this.setFieldValue.emit({ field: this.field.name, value: obj });
  // }

  handleSelectChange(event: any) {

    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value });
  }
  showDate: any; // Para almacenar la fecha formateada

  onValueChangeDate(event: any) {
    const value = event.value as Date;
    this.setFieldValue.emit({ field: this.field.name, value: this.datePipe.transform(value, 'yyyy-MM-dd') });
  }

  // onInputChange(event: Event) {
  //   if (this.field.onInputChange) {
  //     this.field.onInputChange(event);
  //   }
  // }
  onInputChange(event: Event) {
    if (this.field.onInputChange) {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;

        if (value.length === this.field.onInputChange.length) {
            this.field.onInputChange.changeFunction(event);
        }
    }
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
