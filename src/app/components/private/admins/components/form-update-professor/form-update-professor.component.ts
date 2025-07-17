import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { ProfesorService } from 'src/app/services/profesor.service';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { AlertModel } from '@mean/models';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '@mean/shared';

@Component({
  selector: 'app-form-update-professor',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatStepperModule,
    FieldComponentComponent,
    AlertComponent,
    MatCardModule,
    LoadingComponent
  ],
  templateUrl: './form-update-professor.component.html',
  styleUrl: './form-update-professor.component.scss'
})
export class FormUpdateProfessorComponent implements OnInit {
  private toastr = inject(ToastrService);
  @Input() professorId: string = '';
  formGroup!: FormGroup;
  professor: FormField[] = [];
  private apiService = inject(ApiService<any>);
  alertConfig = new AlertModel.AlertaClass(false, '', AlertModel.AlertSeverity.ERROR);
  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private professorService: ProfesorService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si no se proporciona el professorId como input, intentar obtenerlo de los parámetros de la ruta
    if (!this.professorId) {
      this.professorId = this.route.snapshot.params['professorId'];
    }
    
    this.professor = this.professorService.getPersonalDataFields();
    
    // Asegurarnos de que se carguen las opciones de género antes de inicializar el form
    const genderField = this.professor.find(field => field.name === 'gender');
    if (genderField && genderField.onClick) {
      genderField.onClick(new MouseEvent('click'));
    }
    
    // Asegurarnos de que se carguen las opciones de carrera
    const careerField = this.professor.find(field => field.name === 'career');
    if (careerField && careerField.onClick) {
      careerField.onClick(new MouseEvent('click'));
    }
    
    // Retrasar la inicialización del formulario para dar tiempo a que se carguen las opciones
    setTimeout(() => {
      this.initForm();
      this.loadProfessorData();
    }, 100);
  }

  private initForm() {
    this.formGroup = this.fb.group({});
    this.professor.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control({ 
          value: '', 
          disabled: field.disabled || false 
        }, field.validators || [])
      );
    });
  }

  private loadProfessorData() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PROFESSORS}/${this.professorId}`,
      data: {},
    }).subscribe({
      next: (response) => {
        // Formatear la fecha antes de asignarla
        const birthDate = response.person.birthDate ? new Date(response.person.birthDate) : '';
        
        // Asegurar que el género y carrera se carguen correctamente
        setTimeout(() => {
          // Establecer todos los valores después de que se hayan cargado las opciones
          this.formGroup.patchValue({
            employeeNumber: response.employeeNumber,
            curp: response.person.curp,
            firstName: response.person.firstName,
            secondName: response.person.secondName,
            firstLastName: response.person.firstLastName,
            secondLastName: response.person.secondLastName,
            phone: response.person.phone,
            birthDate: birthDate,
            email: response.person.email,
            gender: response.person.gender.idGender.toString(),
            career: response.career.idCareer.toString()
          });
          
          // Asegurar que los campos específicos estén deshabilitados
          if (this.formGroup.get('employeeNumber')) {
            this.formGroup.get('employeeNumber')?.disable();
          }
          if (this.formGroup.get('curp')) {
            this.formGroup.get('curp')?.disable();
          }
          if (this.formGroup.get('birthDate')) {
            this.formGroup.get('birthDate')?.disable();
          }

          // Marcar el formulario como "touched" para que se muestren los valores
          Object.keys(this.formGroup.controls).forEach(key => {
            const control = this.formGroup.get(key);
            control?.markAsTouched();
          });
        }, 100);
      },
      error: (error) => {
        this.alertConfig.singleMessage = 'Error al cargar los datos del profesor';
      },
    });
  }

  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  onBack() {
    this.router.navigate(['/admin/professors']);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // Obtener todos los valores, incluyendo los campos deshabilitados
      const formValues = {
        ...this.formGroup.value,
        employeeNumber: this.formGroup.get('employeeNumber')?.value,
        curp: this.formGroup.get('curp')?.value,
        birthDate: this.formGroup.get('birthDate')?.value
      };
      
      const professorData = {
        employeeNumber: formValues.employeeNumber,
        person: {
          curp: formValues.curp,
          firstName: formValues.firstName,
          secondName: formValues.secondName || '',
          firstLastName: formValues.firstLastName,
          secondLastName: formValues.secondLastName,
          phone: formValues.phone || '',
          birthDate: formValues.birthDate instanceof Date 
            ? formValues.birthDate.toISOString().split('T')[0] 
            : formValues.birthDate,
          email: formValues.email,
          gender: {
            idGender: parseInt(formValues.gender)
          }
        },
        career: {
          idCareer: formValues.career
        }
      };

      this.apiService.patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PATCH_PROFESSORS}/${this.professorId}`,
        data: professorData,
      }).subscribe({
        next: () => {
          this.toastr.success('Profesor actualizado exitosamente', 'Éxito');
          setTimeout(() => {
            this.router.navigate(['/admin/professors']);
          }, 2000);
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Error al actualizar el profesor', 'Error');
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
