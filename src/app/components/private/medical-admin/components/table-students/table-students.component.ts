import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { studentsTableData } from 'src/app/shared/models/shared/students';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  Accion,
  getEntityPropiedades,
} from 'src/app/shared/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { StudentsGeneralHistoryComponent } from '../../../students/pages/medical-records-forms/general/students-general-history.component';
import { studentRequest } from 'src/app/shared/models/student/student';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { DataSharingService } from 'src/app/shared/services/data-sharing.service';
import { DetailsStudentComponent } from '../details-student/details-student.component';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "@mean/shared";


@Component({
  selector: 'app-table-students',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, TablaDataComponent, MatButtonModule, RouterLink, MatCardModule, LoadingComponent],
  templateUrl: './table-students.component.html',
  styleUrls: ['./table-students.component.scss']
})
export class TableStudentsComponent implements OnInit {
  studentsList: studentsTableData[] = [];
  columns: string[] = [];
  title: string = 'Estudiantes';
  private apiService = inject(ApiService<studentRequest[]>);
  private searchSubject = new Subject<string>();
  private dataSharingService = inject(DataSharingService);
  private toastr = inject(ToastrService);
  

  currentPage = 0;
  itemsPerPage = 10;
  isChecked: boolean = false;
  searchTerm: string = '';
  totalElements: number = 0;
  sortField: string = 'student.person.firstName';
  sortAsc: boolean = true;
  sortableColumns = {
    'nombre': 'student.person.firstName',
    'apellido': 'student.person.firstLastName',
    'correo': 'student.person.email',
    'matricula': 'student.enrollment',
    'estatus': 'student.user.status'  // Agregado el campo estatus
  };

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = getEntityPropiedades('student');
    this.getAlumnos();
    
    // Configurar el observable para la búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.getAlumnos(this.currentPage, this.itemsPerPage, searchTerm);
    });
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto,
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {  // Cambiado de 'Editar' a 'Modificar'
      this.editar(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    }  else if (accion.accion === 'Modificar') {
      this.edit(accion.fila);
    } else if (accion.accion === 'Restablecer') {
    this.reset(accion.fila);
  }
  }
  
   editar(objeto: any) {
    }

    reset(objeto: any) {
      const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
        width: '300px',
        data: { message: `¿Estás seguro de que deseas restablecer la contraseña de ${objeto.nombre}?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const enrollment = objeto.matricula;
          const url = `${UriConstants.PATCH_AUTH}?username=${enrollment}`;
          this.apiService.patchService({
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            url,
            data: {}
          }).subscribe({
            next: () => {
              this.toastr.success('Contraseña restablecida con éxito', 'Éxito');
            },
            error: (error) => {
              this.toastr.error('Error al restablecer la contraseña: ' + error.message, 'Error');
            }
          });
        }
      });
    }

  edit(objeto: any) {
    this.router.navigate(['/medical-admin/students/updateStudent', objeto.matricula]);
  }

  delete(nombre: string) {
  }

  showAlert() {
    alert('¡Haz clic en un icono!');
  }

  check(event: any) {
    this.isChecked = event.checked;
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0; // Resetear a la primera página
    this.getAlumnos(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.currentPage = 0; // Resetear a la primera página cuando se busca
    this.getAlumnos(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  getAlumnos(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword);
    const sortField = this.sortField.startsWith('student.') ? this.sortField : `student.${this.sortField}`;
    const url = `${UriConstants.GET_STUDENTS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${sortField}&asc=${this.sortAsc}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content && Array.isArray(response.content)) {
          this.totalElements = response.totalElements;
          this.studentsList = response.content.map((student: studentRequest) => ({
            nombre: student.person?.firstName || 'N/A',
            apellido: `${student.person?.firstLastName || ''} ${student.person?.secondLastName || ''}`.trim() || 'N/A',
            correo: student.person?.email || 'N/A',
            matricula: student.enrollment || 'N/A',
            estatus: student.user?.status ? 'Activo' : 'Inactivo',
            curp: student.person?.curp || 'N/A',
            telefono: student.person?.phone || 'N/A',
            fechaNacimiento: student.person?.birthDate || 'N/A'
          }));
        } else {
          this.studentsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de estudiantes', 'Error');
        this.studentsList = [];
        this.totalElements = 0;
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event - 1; 
    this.getAlumnos(this.currentPage, this.itemsPerPage, this.searchTerm); 
  }

  onSort(event: {field: string, asc: boolean}) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getAlumnos(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  openDetailsDialog(student: any): void {
    this.dataSharingService.setAdminData(student);
    const dialogRef = this.dialog.open(DetailsStudentComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });

  }

  onStatusChange(event: { row: any, newStatus: string }) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro de que deseas cambiar el estatus a ${event.newStatus}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const enrollment = event.row.matricula;
        const url = `${UriConstants.POST_STUDENTS}/${enrollment}/toggle-status`;

        this.apiService.patchService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url,
          data: {}
        }).subscribe({
          next: () => {
            event.row.estatus = event.newStatus;
          },
          error: (error) => {
            this.toastr.error('Error al cambiar el estado del estudiante', 'Error');
          }
        });
      }
    });
  }

  updateStudent(student: any) {
    this.router.navigate(['/medical-admin/updateStudent', student.matricula]);
  }
}
