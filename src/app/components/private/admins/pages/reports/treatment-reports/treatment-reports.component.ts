import { HttpHeaders } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Accion, studentsTableData } from "src/app/shared/models";
import { ApiService } from "src/app/shared/services";
import { LoadingComponent, studentRequest, TablaDataComponent } from "@mean/shared";
import { UriConstants } from "@mean/utils";
import { ToastrService } from "ngx-toastr";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";

@Component({
  selector: 'app-treatment-reports',
  standalone: true,
  imports: [
    LoadingComponent,
    TablaDataComponent,
    MatCardModule
  ],
  templateUrl: './treatment-reports.component.html',
  styleUrl: './treatment-reports.component.scss'
})
export class TreatmentReportsComponent {
  private apiService = inject(ApiService<studentRequest[]>);    // Servicio para hacer peticiones HTTP a la API
  private searchSubject = new Subject<string>();                // Subject para manejar búsquedas con debounce
  private toastr = inject(ToastrService);                       // Servicio para mostrar notificaciones toast
  private readonly dialog = inject(MatDialog);
  private router = inject(Router);
  public studentsList: studentsTableData[] = [];                // Lista de estudiantes para mostrar en la tabla
  public columns: string[] = [];                                // Nombres de las columnas a mostrar en la tabla
  public title: string = 'Estudiantes';                         // Título que se muestra arriba de la tabla
  public currentPage = 0;                                       // Página actual en la paginación (base 0)
  public itemsPerPage = 10;                                     // Cantidad de ítems por página
  public searchTerm: string = '';                               // Término de búsqueda para filtrar estudiantes
  public totalElements: number = 0;                             // Total de estudiantes disponibles (para paginación)
  public sortField: string = 'student.person.firstName';        // Campo por el cual se ordenan los resultados
  public sortAsc: boolean = true;                               // Dirección del ordenamiento (ascendente/descendente)

  public sortableColumns = {                                    // Mapeo de columnas ordenables con sus respectivos campos en el backend
    'nombre': 'student.person.firstName',
    'apellido': 'student.person.firstLastName',
    'matricula': 'student.enrollment',
  };


  ngOnInit(): void {
    this.columns = ['nombre', 'apellido', 'matricula'];
    this.fetchStudents();
    this.setupSearchSubscription();                             // Configura el observable para búsquedas
  }

  // Configura observable de búsqueda con debounce
  private setupSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({
      next: (searchTerm) => {
        this.currentPage = 0;
        this.fetchStudents(this.currentPage, this.itemsPerPage, searchTerm);
      },
      error: (err) => {
        this.toastr.error('Error al procesar la búsqueda');
      }
    });
  }

  // Maneja cambio de página
  public onPageChange(event: number) {
    this.currentPage = event - 1;
    this.fetchStudents(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  // Maneja ordenamiento de columnas
  public onSort(event: { field: string, asc: boolean }) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.fetchStudents(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  // Cambia cantidad de items por página
  public onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.fetchStudents(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  // Procesa acciones CRUD
  public onAction(accion: Accion) {
    const idStudent = accion.fila.matricula;
    this.navigateToTreatmentsReportDetails(idStudent);
  }

  public navigateToTreatmentsReportDetails(idStudent: string) {
    this.router.navigate(['/admin/treatments-reports', idStudent]);
  }
  // Ejecuta búsqueda de estudiantes
  public onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.currentPage = 0;
    this.fetchStudents(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  // Obtiene estudiantes paginados del servidor
  public fetchStudents(page: number = 0, size: number = 10, keyword: string = '') {
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
}
