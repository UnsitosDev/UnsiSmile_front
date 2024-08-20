import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { curpValidator, genderValidator } from 'src/app/utils/validators';
import { AlertModel } from '@mean/models';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";


interface FormField {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  options?: { value: string, label: string }[];
  validators?: ValidatorFn[]; // Agregar la propiedad validators
  value?: any;
}
@Component({
  selector: 'app-form-patient-personal-data',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule, AlertComponent, FieldComponentComponent],
  templateUrl: './form-patient-personal-data.component.html',
  styleUrl: './form-patient-personal-data.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class FormPatientPersonalDataComponent {
  formGroup!: FormGroup;

  formFields: FormField[] = [
    {
      type: 'input',
      label: 'Nombre',
      name: 'nombre',
      required: true,
      validators: [Validators.required] // Agregar validadores
    },
    {
      type: 'select',
      label: 'País',
      name: 'pais',
      required: true,
      options: [
        { value: 'MX', label: 'México' },
        { value: 'US', label: 'Estados Unidos' }
      ],
      validators: [Validators.required] // Agregar validadores
    }
  ];

  constructor(private fb: FormBuilder) {
    // Construcción del formulario
    this.formGroup = this.fb.group({});
    this.formFields.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }

  ngOnInit(): void {}

  handleSetFieldValue(event: { field: string, value: any }) {
    this.formGroup.get(event.field)?.setValue(event.value);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Form Values:', this.formGroup.value);
    }
  }
}
