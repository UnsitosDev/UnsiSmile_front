import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Accion, getEntityPropiedades } from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { AdminResponse, User } from 'src/app/models/shared/admin/admin.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AdminTableData } from 'src/app/models/shared/admin/admin';
import { MatCardModule } from '@angular/material/card';
import { DetailsAdminComponent } from '../details-admin/details-admin.component';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '@mean/shared';

@Component({
  selector: 'app-table-admin',
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
  templateUrl: './table-admin.component.html',
  styleUrls: ['./table-admin.component.scss']
})
export class TableAdminComponent implements OnInit {
  adminList: AdminTableData[] = [];
  columns: string[] = [];
  title: string = 'Administradores';
  private apiService = inject(ApiService<any>);
  private searchSubject = new Subject<string>();
  private dataSharingService = inject(DataSharingService);
  private toastr = inject(ToastrService);
  

  currentPage = 0;
  itemsPerPage = 10;
  isChecked: boolean = false;
  searchTerm: string = '';
  totalElements: number = 0;
  sortField: string = 'person.firstName';
  sortAsc: boolean = true;
  sortableColumns = {
    'nombre': 'person.firstName',
    'apellido': 'person.firstLastName',
    'correo': 'person.email',
    'numero empleado': 'employeeNumber',  // Cambiado de 'numeroEmpleado' a 'numero empleado'
    'estatus': 'user.status'
  };

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = getEntityPropiedades('admin');
    this.getAdmins();

    // Configurar el observable para la búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.getAdmins(this.currentPage, this.itemsPerPage, searchTerm);
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Modificar') {  // Cambiado de 'Editar' a 'Modificar'
      this.edit(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    } else if (accion.accion === 'Restablecer') {
      this.reset(accion.fila);
    }
  }


  reset(objeto: any) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro de que deseas restablecer la contraseña de ${objeto.nombre}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        objeto.numeroEmpleado = objeto['numero empleado']; // Cambiado de 'numeroEmpleado' a 'numero empleado'
        const enrollment = objeto.numeroEmpleado; // Cambiado de 'numeroEmpleado' a 'numero empleado'
        const url = `${UriConstants.PATCH_AUTH}?username=${enrollment}`;
        this.apiService.patchService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url,
          data: {}
        }).subscribe({
          next: () => {
            this.toastr .success('Contraseña restablecida con éxito', 'Éxito');
          },
          error: (error) => {
            this.toastr.error('Error al restablecer la contraseña: ' + error.message, 'Error');
          }
        });
      }
    });
  }

  edit(objeto: any) {
    this.router.navigate(['/admin/admins/updateAdmin', objeto['numero empleado']]);
  }

  delete(nombre: string) {
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getAdmins(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.searchSubject.next(keyword);
  }

  getAdmins(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `${UriConstants.GET_ADMIN}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;
        
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
          this.adminList = response.content.map((admin: AdminResponse) => {
            return {
              nombre: admin.person.firstName,
              apellido: `${admin.person.firstLastName} ${admin.person.secondLastName || ''}`.trim(),
              correo: admin.person.email,
              'numero empleado': admin.employeeNumber,  // Cambiado de numeroEmpleado a 'numero empleado'
              estatus: admin.user.status ? 'Activo' : 'Inactivo',
              curp: admin.person.curp,
              telefono: admin.person.phone,
              fechaNacimiento: admin.person.birthDate
            };
          });
        } else {
          this.adminList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de administradores', 'Error');
        this.adminList = [];
        this.totalElements = 0;
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    this.getAdmins(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  // Agregar método para manejar acciones específicas de status
  onStatusChange(event: { row: any, newStatus: string }) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro de que deseas cambiar el estatus a ${event.newStatus}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const employeeNumber = event.row['numero empleado'];
        const url = `${UriConstants.PATCH_ADMIN}/${employeeNumber}/toggle-status`;

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
            this.toastr.error('Error al cambiar el estado del administrador: ' + error.message, 'Error');
          }
        });
      }
    });
  }

  // Agregar el método onSort
  onSort(event: {field: string, asc: boolean}) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getAdmins(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  // Agregar método para abrir el diálogo de detalles
  openDetailsDialog(admin: AdminTableData): void {
    this.dataSharingService.setAdminData(admin);
    const dialogRef = this.dialog.open(DetailsAdminComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh', // Limita la altura al 90% de la ventana
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
