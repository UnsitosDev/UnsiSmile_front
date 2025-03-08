import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-form-update-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FieldComponentComponent
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
    this.route.params.subscribe(params => {
      this.matricula = params['matricula'];
      this.loadStudentData(this.matricula);
    });

    this.studentFields = this.studentService.getPersonalDataFields();
    this.formGroup = this.fb.group({});
    this.studentFields.forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });

    // Cargar opciones de género
    this.studentService.handleGenderClick({} as MouseEvent);
  }

  loadStudentData(matricula: string) {
    const url = `${UriConstants.GET_STUDENTS}?keyword=${matricula}`;
    this.apiService.getService({ url }).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa:', response);
        if (response.content && response.content.length > 0) {
          const student = response.content[0]; // Tomamos el primer estudiante del array
          console.log('Datos del estudiante:', student);
          
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
            gender: student.person.gender.idGender.toString(),
            career: student.group.career.idCareer,
            semester: student.group.semester.idSemester,
            group: student.group.idGroup.toString() // Convertimos a string y usamos idGroup
          });

          console.log('Valor del grupo asignado:', student.group.idGroup);
          console.log('Estado del formulario:', this.formGroup.value);

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
      const formValues = this.formGroup.value;
      
      // Asegurarnos de que todos los ID sean strings como espera la API
      const studentData = {
        enrollment: formValues.enrollment,
        user: {
          idUser: this.userId.toString(), // Convertir a string
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
            gender: ''
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

      // Agregar logs para depuración
      console.log('URL de actualización:', `${UriConstants.PUT_STUDENT}${this.matricula}`);
      console.log('Datos enviados:', JSON.stringify(studentData, null, 2));

      const url = `${UriConstants.PUT_STUDENT}${this.matricula}`;
      this.apiService.putService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url,
        data: studentData,
      }).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response); // Log de respuesta
          this.toastr.success('Estudiante actualizado con éxito', 'Éxito');
          this.router.navigate(['/admin/students']);
        },
        error: (error) => {
          console.error('Error completo:', error); // Log de error detallado
          this.toastr.error('Error al actualizar el estudiante: ' + error.message, 'Error');
        }
      });
    } else {
      this.toastr.warning('Por favor, complete todos los campos requeridos', 'Advertencia');
    }
  }
}
