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
import { ProfessorTableData } from 'src/app/models/shared/professor/professor';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { DetailsAdminComponent } from '../details-admin/details-admin.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '@mean/shared';
import { DialogAssignGroupComponent } from '../dialog-assign-group/dialog-assign-group.component';

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
    MatCardModule,
    LoadingComponent
  ],
  templateUrl: './table-professor-admin.component.html',
  styleUrls: ['./table-professor-admin.component.scss']
})
export class TableProfessorAdminComponent implements OnInit {
  professorsList: ProfessorTableData[] = [];
  columns: string[] = [];
  title: string = 'Profesores';
  private apiService = inject(ApiService<any[]>);
  private searchSubject = new Subject<string>();
  private dataSharingService = inject(DataSharingService);
  private toastr = inject(ToastrService);
  

  currentPage = 0;
  itemsPerPage = 10;
  searchTerm: string = '';
  totalElements: number = 0;
  sortField: string = 'person.firstName';
  sortAsc: boolean = true;
  sortableColumns = {
    'nombre': 'person.firstName',
    'apellido': 'person.firstLastName',
    'correo': 'person.email',
    'numeroEmpleado': 'employeeNumber',
    'estatus': 'user.status'
  };

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.columns = ['nombre', 'apellido', 'correo', 'numero empleado', 'estatus'];
    this.getProfessors();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.getProfessors(this.currentPage, this.itemsPerPage, searchTerm);
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Modificar') {
      this.edit(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsPage(accion.fila);
    } else if (accion.accion === 'Asignar') {
      this.openAssignGroupDialog(accion.fila['numero empleado']);
    }
  }

  openAssignGroupDialog(employeeNumber: string): void {
    const dialogRef = this.dialog.open(DialogAssignGroupComponent, {
      width: '500px',
      data: { employeeNumber: employeeNumber }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success('Grupo asignado correctamente', 'Éxito');
      }
    });
  }

  openDetailsPage(professor: ProfessorTableData): void {
    const professorId = professor['numero empleado'];
    
    // Usar navigateByUrl en lugar de navigate para asegurar una URL limpia
    this.router.navigateByUrl(`/admin/professors/details/professor/${professorId}`);
  }

  edit(objeto: any) {
    this.router.navigate(['/admin/professors/updateProfessor', objeto['numero empleado']]);
  }

  delete(nombre: string) {
  }



  getProfessors(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `${UriConstants.GET_PROFESSORS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;
        
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
          this.professorsList = response.content.map((professor: any) => {
            return {
              nombre: professor.person.firstName,
              apellido: `${professor.person.firstLastName} ${professor.person.secondLastName || ''}`.trim(),
              correo: professor.person.email,
              'numero empleado': professor.employeeNumber,
              estatus: professor.user.status ? 'Activo' : 'Inactivo',
              curp: professor.person.curp,
              telefono: professor.person.phone,
              fechaNacimiento: professor.person.birthDate
            };
          });
        } else {
          this.professorsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de profesores', 'Error');
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

  onSort(event: { field: string, asc: boolean }) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getProfessors(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onStatusChange(event: { row: ProfessorTableData, newStatus: string }) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro de que deseas cambiar el estatus a ${event.newStatus}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const employeeNumber = event.row['numero empleado'];
        const url = `${UriConstants.PATCH_PROFESSORS}/${employeeNumber}/toggle-status`;

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
            this.toastr.error('Error al cambiar el estado del profesor', 'Error', {
            });
          }
        });
      }
    });
  }
}