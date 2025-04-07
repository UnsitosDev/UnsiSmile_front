import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Accion, getEntityPropiedades } from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-table-professor-admin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    TablaDataComponent,
    MatButtonModule,
    RouterLink,
    MatCardModule
  ],
  templateUrl: './table-professor-admin.component.html',
  styleUrls: ['./table-professor-admin.component.scss']
})
export class TableProfessorAdminComponent implements OnInit {
  professorsList: any[] = [];
  columns: string[] = [];
  title: string = 'Profesores';
  private apiService = inject(ApiService<any[]>);
  private searchSubject = new Subject<string>();
  private dataSharingService = inject(DataSharingService);

  currentPage = 0;
  itemsPerPage = 10;
  searchTerm: string = '';
  totalElements: number = 0;
  sortField: string = 'professor.person.firstName';
  sortAsc: boolean = true;
  sortableColumns = {
    'nombre': 'professor.person.firstName',
    'apellido': 'professor.person.firstLastName',
    'correo': 'professor.person.email',
    'numeroEmpleado': 'professor.employeeNumber',
    'estatus': 'professor.user.status'
  };

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = getEntityPropiedades('professor');
    this.getProfessors();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.getProfessors(this.currentPage, this.itemsPerPage, searchTerm);
    });
  }

  getProfessors(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword);
    const sortField = this.sortField.startsWith('professor.') ? this.sortField : `professor.${this.sortField}`;
    const url = `${UriConstants.GET_PROFESSORS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${sortField}&asc=${this.sortAsc}`;
    
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
          this.professorsList = response.content.map((professor: any) => ({
            nombre: professor.person?.firstName || 'N/A',
            apellido: `${professor.person?.firstLastName || ''} ${professor.person?.secondLastName || ''}`.trim() || 'N/A',
            correo: professor.person?.email || 'N/A',
            numeroEmpleado: professor.employeeNumber || 'N/A',
            estatus: professor.user?.status ? 'Activo' : 'Inactivo'
          }));
        } else {
          console.warn('Respuesta inesperada del servidor:', response);
          this.professorsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        console.error('Error al obtener profesores:', error);
        this.professorsList = [];
        this.totalElements = 0;
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    this.getProfessors(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getProfessors(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.searchSubject.next(keyword);
  }

  onSort(event: {field: string, asc: boolean}) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getProfessors(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.router.navigate(['/admin/professors/updateProfessor', accion.fila.numeroEmpleado]);
    }
  }
}