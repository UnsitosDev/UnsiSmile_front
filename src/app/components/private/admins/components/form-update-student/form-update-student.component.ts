import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { studentService } from 'src/app/services/student.service';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { LoadingComponent } from '@mean/shared';

@Component({
  selector: 'app-form-update-student',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FieldComponentComponent,
    LoadingComponent
],
  templateUrl: './form-update-student.component.html',
  styleUrls: ['./form-update-student.component.scss']
})
export class FormUpdateStudentComponent implements OnInit {
  matricula: string = '';
  formGroup!: FormGroup;
  studentFields: FormField[] = [];
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userId: string = '';
  private userPassword: string = '';
  private userStatus: boolean = false;

  constructor(private route: ActivatedRoute, private studentService: studentService) {}

  ngOnInit() {
    // Cargar los campos de estudiante primero
    this.studentFields = this.studentService.getPersonalDataFields();
    
    // Asegurarnos de que se carguen las opciones de género antes de inicializar el form
    const genderField = this.studentFields.find(field => field.name === 'gender');
    if (genderField && genderField.onClick) {
      genderField.onClick(new MouseEvent('click'));
    }

    // Inicializar el formulario después de cargar los campos y las opciones de género
    this.formGroup = this.fb.group({});
    this.studentFields.forEach(field => {
      const control = this.fb.control({
        value: field.value || '',
        disabled: field.disabled || false
      }, field.validators || []);
      this.formGroup.addControl(field.name, control);
    });

    // Suscribirse a los parámetros de ruta y cargar datos del estudiante
    this.route.params.subscribe(params => {
      this.matricula = params['matricula'];
      this.loadStudentData(this.matricula);
    });
  }

  loadStudentData(matricula: string) {
    const url = `${UriConstants.GET_STUDENTS}?keyword=${matricula}`;
    this.apiService.getService({ url }).subscribe({
      next: (response: any) => {
        if (response.content && response.content.length > 0) {
          const student = response.content[0]; // Tomamos el primer estudiante del array
          
          // Asegurar que el género se cargue correctamente
          const genderField = this.studentFields.find(field => field.name === 'gender');
          if (genderField && genderField.onClick) {
            genderField.onClick(new MouseEvent('click'));
            setTimeout(() => {
              // Establecer el valor después de que se hayan cargado las opciones
              this.formGroup.patchValue({
                gender: student.person.gender.idGender.toString(),
              });
              
              // Marcar el control como "touched" para que muestre el valor seleccionado
              this.formGroup.get('gender')?.markAsTouched();
            }, 100);
          }

          this.formGroup.patchValue({
            firstName: student.person.firstName,
            secondName: student.person.secondName,
            firstLastName: student.person.firstLastName,
            secondLastName: student.person.secondLastName,
            enrollment: student.enrollment,
            curp: student.person.curp,
            phone: student.person.phone,
            birthDate: new Date(student.person.birthDate),
            email: student.person.email,
            career: student.group.career.idCareer,
            semester: student.group.semester.idSemester,
            group: student.group.idGroup.toString()
          });

          // Asegurar que los campos CURP, birthDate y enrollment estén deshabilitados
          if (this.formGroup.get('curp')) {
            this.formGroup.get('curp')?.disable();
          }
          if (this.formGroup.get('birthDate')) {
            this.formGroup.get('birthDate')?.disable();
          }
          if (this.formGroup.get('enrollment')) {
            this.formGroup.get('enrollment')?.disable();
          }

          Object.keys(this.formGroup.controls).forEach(key => {
            const control = this.formGroup.get(key);
            control?.markAsTouched();
          });

          // Guardar valores adicionales
          this.userId = student.user.id;
          this.userPassword = student.user.password || '';
          this.userStatus = student.user.status;
        } else {
          this.toastr.error('No se encontró el estudiante', 'Error');
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos del estudiante: ' + error.message, 'Error');
      }
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // Obtener todos los valores, incluyendo los campos deshabilitados
      const formValues = {
        ...this.formGroup.value,
        curp: this.formGroup.get('curp')?.value,
        birthDate: this.formGroup.get('birthDate')?.value,
        enrollment: this.formGroup.get('enrollment')?.value
      };
      
      const studentData = {
        enrollment: formValues.enrollment,
        user: {
          idUser: this.userId.toString(), 
          username: formValues.email,
          password: this.userPassword,
          role: {
            idRole: 2,
            role: 'ROLE_STUDENT'
          }
        },
        person: {
          curp: formValues.curp,
          firstName: formValues.firstName,
          secondName: formValues.secondName || '',
          firstLastName: formValues.firstLastName,
          secondLastName: formValues.secondLastName,
          phone: formValues.phone,
          birthDate: new Date(formValues.birthDate).toISOString().split('T')[0],
          email: formValues.email,
          gender: {
            idGender: parseInt(formValues.gender),
            gender: 'Masculino' // Valor temporal
          }
        },
        group: {
          id: parseInt(formValues.group),
          groupName: '',
          semesterNumber: formValues.semester.toString(), // Convertir a string
          career: {
            idCareer: formValues.career.toString(), // Convertir a string
            career: 'Licenciatura en Odontología'
          }
        }
      };

      const url = `${UriConstants.PATCH_STUDENT}${this.matricula}`;
      this.apiService.patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url,
        data: studentData,
      }).subscribe({
        next: (response) => {
          this.toastr.success('Estudiante actualizado con éxito', 'Éxito');
          this.router.navigate(['/admin/students']);
        },
        error: (error) => {
          this.toastr.error('Error al actualizar el estudiante: ' + error.message, 'Error');
        }
      });
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos', 'Advertencia');
    }
  }

  onCancel() {
    this.router.navigate(['/admin/students']);
  }
}
