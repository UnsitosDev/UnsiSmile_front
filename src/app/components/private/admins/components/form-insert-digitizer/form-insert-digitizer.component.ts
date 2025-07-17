import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { studentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-form-insert-digitizer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FieldComponentComponent,
  ],
  templateUrl: './form-insert-digitizer.component.html',
  styleUrls: ['./form-insert-digitizer.component.scss']
})
export class FormInsertDigitizerComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private studentService = inject(studentService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  formGroup!: FormGroup;
  studentFields: FormField[] = [];

  ngOnInit(): void {
    this.studentFields = this.studentService.studentFields;

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

  goBack(): void {
    this.router.navigate(['/admin/digitizers']);
  }

  createDigitizer(): void {
    if (this.formGroup.invalid) {
      this.toastr.warning('Por favor, completa todos los campos requeridos', 'Advertencia');
      return;
    }

    const digitizerData = {
      idMedicalRecordDigitizer: 0,
      idStudent: this.formGroup.get('studentEnrollment')?.value
    };

    this.apiService.postService({
      url: UriConstants.POST_DIGITIZER,
      data: digitizerData
    }).subscribe({
      next: () => {
        this.toastr.success('Capturador creado correctamente', 'Éxito');
        this.router.navigate(['/admin/digitizers']);
      },
      error: (error) => {
        const errorMsg = error?.error?.message || 'Error al crear el capturador';
        this.toastr.error(errorMsg, 'Error');
      }
    });
  }
}

