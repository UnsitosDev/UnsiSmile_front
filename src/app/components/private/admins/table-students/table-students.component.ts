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
import { TablaDataComponent } from 'src/app/shared/tabla-data/tabla-data.component';
import { StudentsGeneralHistoryComponent } from '../../students/pages/history-clinics/general/students-general-history.component';
import { studentRequest } from 'src/app/shared/interfaces/student/student';

@Component({
  selector: 'app-table-students',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './table-students.component.html',
  styleUrls: ['./table-students.component.scss']
})

export class TableStudentsComponent implements OnInit {
  studentsList: studentsTableData[] = [];
  columnas: string[] = [];
  title: string = 'Estudiantes';
  private apiService = inject(ApiService<studentRequest[]>);

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('student');
    this.getAlumnos();
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto,
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.eliminar(accion.fila.nombre);
    } else if (accion.accion === 'MostrarAlerta') {
      this.mostrarAlerta();
    }
  }

  editar(objeto: any) {
    this.router.navigate(['/students', 'historyClinic', objeto.user.id]);
  }

  eliminar(nombre: string) {
    console.log('eliminar', nombre);
  }

  mostrarAlerta() {
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
        console.log('Respuesta del servidor:', response);
        if (Array.isArray(response)) {
          this.studentsList = response.map((student: studentRequest) => {
            const person = student.person;
            const user = student.user;
            return {
              nombre: person.firstName,
              apellido: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              matricula: user.username
            };
          });
          console.log('Lista de estudiantes:', this.studentsList);
        } else {
          console.error('La respuesta no es un array.');
        }
      },
      error: (error) => {
        console.error('Error en la autenticación:', error);
      },
    });
  }
}
