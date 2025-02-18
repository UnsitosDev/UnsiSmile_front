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
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AdminTableData } from 'src/app/models/shared/admin/admin';


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
    RouterLink
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

  currentPage = 0;
  itemsPerPage = 10;
  isChecked: boolean = false;
  searchTerm: string = '';
  totalElements: number = 0;

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
    if (accion.accion === 'Editar') {
      this.edit(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.nombre);
    }
  }

  edit(objeto: any) {
    console.log('Editar admin', objeto);
  }

  delete(nombre: string) {
    console.log('eliminar admin', nombre);
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
    const url = `${UriConstants.GET_ADMIN}?page=${page}&size=${size}&keyword=${encodedKeyword}`;
    
    console.log('URL de la petición:', url);
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response);
        
        if (response && response.content && Array.isArray(response.content)) {
          this.totalElements = response.totalElements;
          this.adminList = response.content.map((admin: AdminResponse) => {
            const adminData: AdminTableData = {
              nombre: admin.person.firstName || '',
              apellido: `${admin.person.firstLastName || ''} ${admin.person.secondLastName || ''}`.trim(),
              correo: admin.person.email || '',
              numeroEmpleado: admin.employeeNumber || ''
            };
            console.log('Admin procesado:', adminData);
            return adminData;
          });
          console.log('Lista final de admins:', this.adminList);
        } else {
          console.warn('Respuesta vacía o inválida:', response);
          this.adminList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        console.error('Error al obtener administradores:', error);
        this.adminList = [];
        this.totalElements = 0;
      },
    });
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    this.getAdmins(this.currentPage, this.itemsPerPage, this.searchTerm);
  }
}
