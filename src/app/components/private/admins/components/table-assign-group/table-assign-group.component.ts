import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { PaginatedData } from 'src/app/shared/models/shared/pagination/pagination';
import { ToastrService } from 'ngx-toastr';
import { DialogAssignGroupComponent } from '../dialog-assign-group/dialog-assign-group.component';
import { TablaDataComponent } from '@mean/shared';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Accion } from 'src/app/shared/models/tabla/tabla-columna';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';

interface ProfessorGroup {
  idProfessorGroup: number;
  professorName: string;
  group: {
    idGroup: number;
    groupName: string;
    career: {
      idCareer: string;
      career: string;
    };
    semester: {
      idSemester: number;
      semesterName: string;
      fechaInicio: string;
      fechaFin: string;
      cycle: {
        idCycle: number;
        cycleName: string;
      };
    };
  };
}

interface GroupTableData {
  idProfessorGroup: number;
  idGroup: number;
  nombre: string;
  semestre: string;
  ciclo: string;
  carrera: string;
}

@Component({
  selector: 'app-table-assign-group',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatCheckboxModule, 
    MatInputModule, 
    TablaDataComponent, 
    MatButtonModule,  
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './table-assign-group.component.html',
  styleUrl: './table-assign-group.component.scss'
})
export class TableAssignGroupComponent implements OnInit {
  @Input() professorId!: string;

  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  
  columnas: string[] = ['nombre', 'semestre', 'ciclo', 'carrera'];
  title: string = 'Grupos asignados';
  private searchSubject = new Subject<string>();

  groupsList: GroupTableData[] = [];
  isLoading = false;
  totalElements = 0;
  currentPage = 0;
  itemsPerPage = 10;
  searchTerm = '';
  sortField = 'group.groupName';
  sortAsc = true;
  
  sortableColumns = {
    'nombre': 'group.groupName',
    'semestre': 'group.semester.semesterName',
    'ciclo': 'group.semester.cycle.cycleName',
    'carrera': 'group.career.career'
  };

  ngOnInit(): void {
    this.loadGroups();

    // Configurar debounce para búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.loadGroups();
    });
  }

  loadGroups(): void {
    if (!this.professorId) {
      this.toastr.error('No se encontró el ID del profesor');
      return;
    }

    this.isLoading = true;
    const encodedKeyword = encodeURIComponent(this.searchTerm);
    
    // Usar el endpoint definido en UriConstants
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PROFESSOR_GROUP}${this.professorId}?page=${this.currentPage}&size=${this.itemsPerPage}&order=${this.sortField}&asc=${this.sortAsc}`,
      data: {},
    }).subscribe({
      next: (response: PaginatedData<ProfessorGroup>) => {
        if (response && response.content) {
          this.groupsList = response.content.map(item => ({
            idProfessorGroup: item.idProfessorGroup,
            idGroup: item.group.idGroup,
            nombre: item.group.groupName,
            semestre: item.group.semester.semesterName,
            ciclo: item.group.semester.cycle.cycleName,
            carrera: item.group.career.career
          }));
          this.totalElements = response.totalElements;
        } else {
          this.groupsList = [];
          this.totalElements = 0;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching assigned groups:', error);
        this.toastr.error('Error al cargar los grupos asignados');
        this.isLoading = false;
        this.groupsList = [];
      }
    });
  }

  onPageChange(event: number): void {
    this.currentPage = event - 1;
    this.loadGroups();
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.loadGroups();
  }

  onSort(event: {field: string, asc: boolean}): void {
    this.sortField = this.sortableColumns[event.field as keyof typeof this.sortableColumns] || event.field;
    this.sortAsc = event.asc;
    this.loadGroups();
  }

  onSearch(keyword: string): void {
    this.searchTerm = keyword;
    this.searchSubject.next(keyword);
  }

  onAction(accion: Accion): void {
    if (accion.accion === 'Eliminar') {
      this.removeGroup(accion.fila);
    }
  }

  openAssignGroupDialog(): void {
    const dialogRef = this.dialog.open(DialogAssignGroupComponent, {
      width: '500px',
      data: {
        employeeNumber: this.professorId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
      }
    });
  }

  removeGroup(group: GroupTableData): void {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro que deseas desasignar el grupo ${group.nombre}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.HOST}/professors/professor-groups/${group.idProfessorGroup}`,
          data: {}
        }).subscribe({
          next: () => {
            this.toastr.success('Grupo desasignado correctamente');
            this.loadGroups();
          },
          error: (error) => {
            console.error('Error al desasignar grupo:', error);
            this.toastr.error('Error al desasignar el grupo');
          }
        });
      }
    });
  }
}

