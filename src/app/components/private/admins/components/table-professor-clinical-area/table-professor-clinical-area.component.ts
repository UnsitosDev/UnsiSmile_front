import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Accion } from 'src/app/models/tabla/tabla-columna';

import { LoadingComponent } from '@mean/shared';

interface ClinicalArea {
  idClinicalArea: number;
  clinicalArea: string;
}

interface ProfessorArea {
  'nombre profesor': string;
  'área clínica': string;
  idProfessorClinicalArea: number;
  idClinicalArea: number;
}

@Component({
  selector: 'app-table-professor-clinical-area',
  standalone: true,
  imports: [
    TablaDataComponent,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent
],
  templateUrl: './table-professor-clinical-area.component.html',
  styleUrl: './table-professor-clinical-area.component.scss'
})
export class TableProfessorClinicalAreaComponent implements OnInit {
  professorsList: ProfessorArea[] = []; // Lista filtrada para mostrar
  allProfessorsList: ProfessorArea[] = []; // Lista completa de todos los profesores
  clinicalAreas: ClinicalArea[] = [];
  selectedAreaControl = new FormControl();
  
  columns: string[] = ['nombre profesor', 'área clínica'];
  title: string = 'Profesores por Área Clínica';
  loading: boolean = false;
  
  // Parámetros de paginación
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  sortField = 'clinicalArea.clinicalArea';
  sortAsc = true;

  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadClinicalAreas();
    this.loadAllProfessors();
    
    this.selectedAreaControl.valueChanges.subscribe(value => {
      this.currentPage = 0;
      this.filterProfessors(value);
    });
  }

  loadClinicalAreas() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_CLINICAL_AREAS}`,
      data: {},
    }).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.clinicalAreas = response.content;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar las áreas clínicas');
      }
    });
  }

  loadAllProfessors() {
    this.loading = true;
    const url = `${UriConstants.GET_PROFESSORS_AREAS}?page=0&size=1000&order=${this.sortField}&asc=${this.sortAsc}`;
  
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.content) {
          // Guardamos todos los profesores
          this.allProfessorsList = response.content.map((item: any) => {
            return {
              'nombre profesor': item.professorName || '',
              'área clínica': item.clinicalArea?.clinicalArea || '',
              idProfessorClinicalArea: item.idProfessorClinicalArea,
              idClinicalArea: item.clinicalArea?.idClinicalArea
            };
          });
          
          // Inicialmente mostramos todos
          this.updateDisplayedProfessors();
        } else {
          this.toastr.error('La respuesta del servidor no contiene datos válidos');
          this.allProfessorsList = [];
          this.professorsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        this.loading = false;
        this.allProfessorsList = [];
        this.professorsList = [];
        this.totalElements = 0;
        this.toastr.error('Error al cargar los profesores por área');
      }
    });
  }

  filterProfessors(areaName: string | null) {
    // Si no hay filtro, mostramos todos
    if (!areaName) {
      this.updateDisplayedProfessors();
      return;
    }

    // Filtramos localmente por el nombre del área
    const filteredList = this.allProfessorsList.filter(
      prof => prof['área clínica'] === areaName
    );
    
    this.totalElements = filteredList.length;
    
    // Aplicamos paginación local
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.professorsList = filteredList.slice(startIndex, endIndex);
  }

  updateDisplayedProfessors() {
    this.totalElements = this.allProfessorsList.length;
    
    // Aplicamos paginación local
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.professorsList = this.allProfessorsList.slice(startIndex, endIndex);
  }

  onPageChange(event: number) {
    this.currentPage = event - 1;
    const selectedArea = this.selectedAreaControl.value;
    
    if (selectedArea) {
      this.filterProfessors(selectedArea);
    } else {
      this.updateDisplayedProfessors();
    }
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 0;
    
    const selectedArea = this.selectedAreaControl.value;
    if (selectedArea) {
      this.filterProfessors(selectedArea);
    } else {
      this.updateDisplayedProfessors();
    }
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Eliminar') {
      this.deleteProfessorArea(accion.fila);
    } else if (accion.accion === 'search') {
      // Corregido para usar la propiedad 'fila' que contiene el término de búsqueda
      this.searchProfessors(accion.fila as string || '');
    }
  }

  searchProfessors(searchTerm: string) {
    if (!searchTerm) {
      // Si no hay término de búsqueda, aplicamos solo el filtro de área si existe
      const selectedArea = this.selectedAreaControl.value;
      if (selectedArea) {
        this.filterProfessors(selectedArea);
      } else {
        this.updateDisplayedProfessors();
      }
      return;
    }

    // Convertimos a minúsculas para búsqueda insensible a mayúsculas/minúsculas
    const term = searchTerm.toLowerCase();
    
    // Primero filtramos por área si hay una seleccionada
    let baseList = this.allProfessorsList;
    const selectedArea = this.selectedAreaControl.value;
    
    if (selectedArea) {
      baseList = baseList.filter(prof => prof['área clínica'] === selectedArea);
    }
    
    // Luego filtramos por término de búsqueda
    const searchResults = baseList.filter(prof => 
      prof['nombre profesor'].toLowerCase().includes(term) || 
      prof['área clínica'].toLowerCase().includes(term)
    );
    
    this.totalElements = searchResults.length;
    
    // Reseteamos a la primera página y aplicamos paginación
    this.currentPage = 0;
    this.professorsList = searchResults.slice(0, this.pageSize);
  }

  deleteProfessorArea(professor: any) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar al profesor "${professor['nombre profesor']}" del área clínica "${professor['área clínica']}"?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && professor.idProfessorClinicalArea) {
        this.apiService.deleteService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.DELETE_PROFESSOR_CLINICAL_AREAS}${professor.idProfessorClinicalArea}`,
          data: {}
        }).subscribe({
          next: () => {
            this.toastr.success('Profesor eliminado del área clínica con éxito');
            
            // Actualizamos los datos locales eliminando el profesor
            this.allProfessorsList = this.allProfessorsList.filter(
              prof => prof.idProfessorClinicalArea !== professor.idProfessorClinicalArea
            );
            
            // Actualizamos la vista
            const selectedArea = this.selectedAreaControl.value;
            if (selectedArea) {
              this.filterProfessors(selectedArea);
            } else {
              this.updateDisplayedProfessors();
            }
          },
          error: (error) => {
            this.toastr.error('Error al eliminar el profesor del área clínica');
          }
        });
      }
    });
  }

  clearFilter() {
    this.selectedAreaControl.setValue(null);
  }
}
