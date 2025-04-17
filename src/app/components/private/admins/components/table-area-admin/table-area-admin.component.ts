import { Component, OnInit, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { MatDialog } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { DetailsAreaComponent } from '../details-area/details-area.component';

@Component({
  selector: 'app-table-area-admin',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink, MatCardModule],
  templateUrl: './table-area-admin.component.html',
  styleUrl: './table-area-admin.component.scss'
})
export class TableAreaAdminComponent implements OnInit {
  areasList: any[] = [];
  columns: string[] = ['nombre'];  // Mantener solo la columna de nombre
  title: string = 'Áreas Clínicas';
  private apiService = inject(ApiService);
  private searchSubject = new Subject<string>();
  private dialog = inject(MatDialog);
  private dataSharingService = inject(DataSharingService);

  currentPage = 0;
  itemsPerPage = 10;
  searchTerm: string = '';
  totalElements: number = 0;
  sortField: string = 'clinicalArea';
  sortAsc: boolean = true;
  sortableColumns = {
    'nombre': 'clinicalArea'
  };
  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getAreas();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.getAreas(this.currentPage, this.itemsPerPage, searchTerm);
    });
  }

  getAreas(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `${UriConstants.GET_CLINICAL_AREAS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.totalElements = response.totalElements;
          this.areasList = response.content.map((area: any) => ({
            nombre: area.clinicalArea,
            id: area.idClinicalArea
          }));
        }
      },
      error: (error) => {
        console.error('Error al cargar áreas:', error);
        this.areasList = [];
        this.totalElements = 0;
      }
    });
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    this.getAreas(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getAreas(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

    onAction(accion: Accion) {
      if (accion.accion === 'Insertar') {
        this.openInsertArea(accion.fila);
      } else if (accion.accion === 'Modificar') {
        this.edit(accion.fila);
      } else if (accion.accion === 'Detalles') {
        this.openDetailsDialog(accion.fila);
      }
    }

    openInsertArea(objeto: any){
      const areaId = objeto.id;
      if (areaId) {
        this.router.navigate(['/admin/clinicalArea', areaId]);
      } else {
        console.error('Id de area no encontrado');
      }
    }

    edit(objeto: any) {
    }
 
  openDetailsDialog(area: any): void {
    // Primero mostramos los datos básicos del área
    this.dataSharingService.setAreaData({
      clinicalArea: {
        idClinicalArea: area.id,
        clinicalArea: area.nombre
      },
      professors: []
    });
    
    // Abrimos el diálogo
    const dialogRef = this.dialog.open(DetailsAreaComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });

    // Obtenemos los profesores asignados al área
    const url = `${UriConstants.GET_PROFESSOR_CLINICAL_AREAS}`;
    
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content) {
          // Filtramos los profesores que corresponden al área seleccionada
          const areaProfs = response.content.filter((prof: any) => 
            prof.clinicalArea && prof.clinicalArea.idClinicalArea === area.id
          );
          
          // Actualizamos los datos con la lista filtrada de profesores
          this.dataSharingService.setAreaData({
            clinicalArea: {
              idClinicalArea: area.id,
              clinicalArea: area.nombre
            },
            professors: areaProfs
          });
        }
      },
      error: (error) => {
        this.dataSharingService.setAreaData({
          clinicalArea: {
            idClinicalArea: area.id,
            clinicalArea: area.nombre
          },
          professors: []
        });
      }
    });
  }

  onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.searchSubject.next(keyword);
  }

  onSort(event: { field: string, asc: boolean }) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getAreas(this.currentPage, this.itemsPerPage, this.searchTerm);
  }
}
