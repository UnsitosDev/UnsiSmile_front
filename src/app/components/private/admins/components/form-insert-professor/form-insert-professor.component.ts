import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { FormField } from 'src/app/shared/models/form-fields/form-field.interface';
import { ProfesorService } from 'src/app/shared/services/profesor.service';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { LoadingComponent } from '@mean/shared';

@Component({
    selector: 'app-form-insert-professor',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatStepperModule,
        MatCardModule,
        FieldComponentComponent
    ],
    templateUrl: './form-insert-professor.component.html',
    styleUrls: ['./form-insert-professor.component.scss']
})
export class FormInsertProfessorComponent implements OnInit {
    private toastr = inject(ToastrService);
    private apiService = inject(ApiService);
    formGroup!: FormGroup;
    professor: FormField[] = [];

    constructor(
        private fb: FormBuilder,
        private professorService: ProfesorService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.professor = this.professorService.getPersonalDataFields();
        this.formGroup = this.fb.group({});
        
        this.professor.forEach(field => {
            this.formGroup.addControl(
                field.name,
                this.fb.control(field.value || '', field.validators || [])
            );
        });
    }

    getFieldValue(fieldName: string) {
        return this.formGroup.get(fieldName)?.value;
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const formValues = this.formGroup.value;
            
            const professorData = {
                employeeNumber: formValues.employeeNumber,
                person: {
                    curp: formValues.curp,
                    firstName: formValues.firstName,
                    secondName: formValues.secondName || '',
                    firstLastName: formValues.firstLastName,
                    secondLastName: formValues.secondLastName,
                    phone: formValues.phone || '',
                    birthDate: formValues.birthDate,
                    email: formValues.email,
                    gender: {
                        idGender: formValues.gender
                    }
                },
                career: {
                    idCareer: formValues.career,
                    career: ''
                }
            };

            this.apiService.postService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: UriConstants.POST_PROFESSORS,
                data: professorData,
            }).subscribe({
                next: () => {
                    this.toastr.success('Profesor creado exitosamente', 'Éxito');
                    this.router.navigate(['/admin/professors']);
                },
                error: (error) => {
                    this.toastr.error(error.error?.message || 'Error al crear el profesor', 'Error');
                },
            });
        } else {
            this.toastr.warning('Por favor, complete todos los campos requeridos', 'Advertencia');
            this.markFormGroupTouched(this.formGroup);
        }
    }

    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}