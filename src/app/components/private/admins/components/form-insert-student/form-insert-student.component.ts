import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { studentService } from 'src/app/services/student.service';
import { MatStep } from '@angular/material/stepper';
import { MatStepperModule } from '@angular/material/stepper';


@Component({
  selector: 'app-form-insert-student',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FieldComponentComponent,MatStep,MatStepperModule],
  templateUrl: './form-insert-student.component.html',
  styleUrl: './form-insert-student.component.scss'
})
export class FormInsertStudentComponent {
  formGroup!: FormGroup;
  student: FormField[] = [];
  accountStudent: FormField[]=[];

  constructor(
    private fb: FormBuilder,
    private studentFields: studentService,

  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.student = this.studentFields.getPersonalDataFields();
    this.accountStudent = this.studentFields.getaccountDataFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.student].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }


}
