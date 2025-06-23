import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { ToastrService } from 'ngx-toastr';
import { AssignStudentComponent } from '../assign-student/assign-student.component';
import { TablaDataComponent } from '@mean/shared';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';

interface StudentResponse {
  enrollment: string;
  user: {
    id: string;
    username: string;
    role: {
      idRole: number;
      role: string;
    };
    status: boolean;
    profilePictureId: string | null;
  };
  person: {
    curp: string;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    phone: string;
    birthDate: number[];
    email: string;
    gender: {
      idGender: number;
      gender: string;
    };
    fullName: string;
  };
  group: {
    idGroup: number;
    name: string;
  } | null;
  studentStatus: string;
}

interface StudentTableData {
  matricula: string;
  nombre: string;
  correo: string;
  telefono: string;
}

@Component({
  selector: 'app-table-assign-student',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatCheckboxModule, 
    MatInputModule, 
    TablaDataComponent, 
    MatButtonModule, 
    RouterLink, 
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './table-assign-student.component.html',
  styleUrl: './table-assign-student.component.scss'
})
export class TableAssignStudentComponent implements OnInit {
  @Input() patientUuid!: string;

  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  
  columnas: string[] = ['matricula', 'nombre', 'correo', 'telefono'];
  title: string = 'Estudiantes asignados';
  private searchSubject = new Subject<string>();

  studentsList: StudentTableData[] = [];
  isLoading = false;
  totalElements = 0;
  currentPage = 0;
  itemsPerPage = 10;
  searchTerm = '';
  sortField = 'student.enrollment';
  sortAsc = true;
  
  sortableColumns = {
    'matricula': 'student.enrollment',
    'nombre': 'student.person.firstName',
    'correo': 'student.person.email',
    'telefono': 'student.person.phone'
  };

  ngOnInit(): void {
    this.loadStudents();

    // Configurar debounce para búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.loadStudents();
    });
  }

  loadStudents(): void {
    if (!this.patientUuid) {
      this.toastr.error('No se encontró el ID del paciente');
      return;
    }

    this.isLoading = true;
    const encodedKeyword = encodeURIComponent(this.searchTerm);
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PATIENTS}/${this.patientUuid}/students?page=${this.currentPage}&size=${this.itemsPerPage}&order=${this.sortField}&asc=${this.sortAsc}&keyword=${encodedKeyword}`,
      data: {},
    }).subscribe({
      next: (response: PaginatedData<StudentResponse>) => {
        this.studentsList = response.content.map(student => ({
          matricula: student.enrollment,
          nombre: `${student.person.firstName} ${student.person.secondName || ''} ${student.person.firstLastName} ${student.person.secondLastName || ''}`.trim(),
          correo: student.person.email,
          telefono: student.person.phone || 'No disponible'
        }));
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching assigned students:', error);
        this.toastr.error('Error al cargar los estudiantes asignados');
        this.isLoading = false;
        this.studentsList = [];
      }
    });
  }

  onPageChange(event: number): void {
    this.currentPage = event - 1;
    this.loadStudents();
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.loadStudents();
  }

  onSort(event: {field: string, asc: boolean}): void {
    this.sortField = this.sortableColumns[event.field as keyof typeof this.sortableColumns] || event.field;
    this.sortAsc = event.asc;
    this.loadStudents();
  }

  onSearch(keyword: string): void {
    this.searchTerm = keyword;
    this.searchSubject.next(keyword);
  }

  onAction(accion: Accion): void {
    if (accion.accion === 'Eliminar') {
      this.removeStudent(accion.fila);
    }
  }

  openAssignStudentDialog(): void {
    const dialogRef = this.dialog.open(AssignStudentComponent, {
      width: '500px',
      data: {
        patientId: this.patientUuid
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();
      }
    });
  }

  removeStudent(student: StudentTableData): void {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro que deseas desasignar al estudiante ${student.nombre}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.GET_PATIENTS}/${this.patientUuid}/students/${student.matricula}`,
          data: {}
        }).subscribe({
          next: () => {
            this.toastr.success('Estudiante desasignado correctamente');
            this.loadStudents();
          },
          error: (error) => {
            console.error('Error al desasignar estudiante:', error);
            this.toastr.error('Error al desasignar al estudiante');
          }
        });
      }
    });
  }
}
