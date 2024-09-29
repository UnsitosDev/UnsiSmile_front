import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { studentsTableData } from 'src/app/models/shared/students';
import {
  Accion,
  getEntityPropiedades,
} from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { StudentsGeneralHistoryComponent } from '../../../students/pages/history-clinics/general/students-general-history.component';
import { studentRequest } from 'src/app/shared/components/interfaces/student/student';

@Component({
  selector: 'app-table-students',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './table-students.component.html',
  styleUrls: ['./table-students.component.scss']
})

export class TableStudentsComponent implements OnInit {
  studentsList: studentsTableData[] = [];
  columns: string[] = [];
  title: string = 'Estudiantes';
  private apiService = inject(ApiService<studentRequest[]>);

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = getEntityPropiedades('student');
    this.getAlumnos();
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto,
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.edit(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'MostrarAlerta') {
      this.showAlert();
    }
  }

  edit(objeto: any) {
    this.router.navigate(['/students', 'historyClinic', objeto.user.id]);
  }

  delete(nombre: string) {
    console.log('eliminar', nombre);
  }

  showAlert() {
    alert('¡Haz clic en un icono!');
  }

  getAlumnos() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_STUDENTS}`,
      data: {},
    }).subscribe({
      next: (response) => {
        if (Array.isArray(response.content)) {
          this.studentsList = response.content.map((student: studentRequest) => {
            const person = student.person;
            const user = student.user;
            const studen = student;
            return {
              nombre: person.firstName,
              apellido: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              matricula: studen.enrollment,
            };
          });
        } else {
          console.error('La respuesta no contiene un array en content.');
        }
      },
      error: (error) => {
        console.error('Error en la autenticación:', error);
      },
    });
  }
  
  
}
