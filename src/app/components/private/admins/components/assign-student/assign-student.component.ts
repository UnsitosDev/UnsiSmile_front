import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { studentService } from 'src/app/services/student.service';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { MatCardModule } from '@angular/material/card';

export interface AssignStudentDialogData {
  patientId: string;
  patientName: string;
}

@Component({
  selector: 'app-assign-student',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    FieldComponentComponent,
    MatCardModule,
  ],
  templateUrl: './assign-student.component.html',
  styleUrls: ['./assign-student.component.scss']
})
export class AssignStudentComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private studentService = inject(studentService);
  private dialogRef = inject(MatDialogRef<AssignStudentComponent>);
  private fb = inject(FormBuilder);
  patientName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: AssignStudentDialogData) {}

  formGroup!: FormGroup;
  studentFields: FormField[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.studentFields = this.studentService.studentFields;
    this.patientName = this.data?.patientName || 'Paciente';

    this.formGroup = this.fb.group({
      studentEnrollment: ['', Validators.required]
    });

    this.studentFields.forEach(field => {
      if (!this.formGroup.contains(field.name)) {
        this.formGroup.addControl(
          field.name,
          this.fb.control(field.value || '', field.validators || [])
        );
      }
    });
  }

  onFieldValueChange(event: any) {
    const { name, value } = event;
    this.formGroup.get(name)?.setValue(value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  assignStudent(): void {
    if (this.formGroup.invalid) {
      this.toastr.warning('Por favor, selecciona un estudiante válido', 'Advertencia');
      return;
    }

    if (!this.data?.patientId) {
      this.toastr.error('No se ha especificado un ID de paciente válido', 'Error');
      return;
    }

    this.isLoading = true;
    const assignmentData = {
      patientId: this.data.patientId,
      studentEnrollment: this.formGroup.get('studentEnrollment')?.value
    };

    this.apiService.postService({
      url: UriConstants.POST_PATIENT_STUDENT,
      data: assignmentData
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Estudiante asignado correctamente', 'Éxito');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error?.error?.message || 'Error al asignar estudiante';
        this.toastr.error(errorMsg, 'Error');
      }
    });
  }
}
