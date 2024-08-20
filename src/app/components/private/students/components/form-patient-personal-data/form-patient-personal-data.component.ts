import { Component, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
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
}

interface FormValues {
  [key: string]: any;
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

  fields: FormField[] = [
    {
      type: 'input',
      name: 'name',
      label: 'Primer Nombre',
      required: true
    },
    {
      type: 'select',
      name: 'gender',
      label: 'Género',
      options: [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' }
      ],
      required: true
    }
  ];

  values: FormValues = {
    name: 'Juan',
    gender: 'M'
  };

  errors: FormValues = {
    name: 'Este campo es requerido.',
    gender: 'Seleccione una opción.'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    const group: { [key: string]: any } = {};

    this.fields.forEach(field => {
      group[field.name] = [
        this.values[field.name] || '',
        field.required ? Validators.required : null
      ];
    });

    this.formGroup = this.fb.group(group);
  }

  handleSetFieldValue(event: { field: string, value: any }) {
    this.formGroup.get(event.field)?.setValue(event.value);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Form Values:', this.formGroup.value);
    }
  }
 
}
