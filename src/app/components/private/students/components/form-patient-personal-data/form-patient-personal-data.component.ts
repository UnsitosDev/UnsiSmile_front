import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { FormFieldsService } from 'src/app/services/form-fields.service';

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
  formFields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private formFieldsService: FormFieldsService

  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.formFields = this.formFieldsService.getFormFields();

    // Construcción del formulario
    this.formGroup = this.fb.group({});
    this.formFields.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
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
