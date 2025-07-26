import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { digitizersTableData, DigitizersResponse, IDigitizers } from 'src/app/models/shared/digitizers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  Accion,
  getEntityPropiedades,
} from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { DigitizerRequest } from 'src/app/shared/interfaces/digitizer/digitizer';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "@mean/shared";
import { ConfirmationAlertComponent } from '../confirmation-alert/confirmation-alert.component';

@Component({
  selector: 'app-table-digitizers',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, TablaDataComponent, MatButtonModule, RouterLink, MatCardModule, LoadingComponent],
  templateUrl: './table-digitizers.component.html',
  styleUrl: './table-digitizers.component.scss'
})
export class TableDigitizersComponent implements OnInit {
  digitizersList: digitizersTableData[] = [];
  columns: string[] = [];
  title: string = 'Capturadores';
  private apiService = inject(ApiService<DigitizersResponse>);
  private searchSubject = new Subject<string>();
  private dataSharingService = inject(DataSharingService);
  private toastr = inject(ToastrService);
  
  currentPage = 0;
  itemsPerPage = 10;
  isChecked: boolean = false;
  searchTerm: string = '';
  totalElements: number = 0;
  // Actualización de sortField y sortableColumns para enviar parámetros correctos a la API
  sortField: string = 'user.username'; // actualizado de 'username' o 'student.person.firstName'
  sortAsc: boolean = true;
  sortableColumns = {
    'id': 'idMedicalRecordDigitizer',
    'nombreCompleto': 'digitizerName', 
    'matricula': 'user.username',
    'fechaInicio': 'startDate',
    'fechaFin': 'endDate',
    'estatus': 'status' // Agregado el campo estatus
  };

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.columns = getEntityPropiedades('digitizers');
    this.getDigitizers();
    
    // Configurar el observable para la búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.getDigitizers(this.currentPage, this.itemsPerPage, searchTerm);
    });
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion === 'Eliminar') {
      this.delete(accion.fila.id);
    } else if (accion.accion === 'Detalles') {
      this.openDetailsDialog(accion.fila);
    }
  }
  
  editar(objeto: any) {
    // Implementar lógica de edición
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: '¿Estás seguro de que deseas eliminar este capturador?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const url = `${UriConstants.DELETE_DIGITIZER}/${id}`;

        this.apiService.deleteService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url,
          data: {}
        }).subscribe({
          next: () => {
            this.toastr.success('Capturador eliminado correctamente', 'Éxito');
            this.getDigitizers(this.currentPage, this.itemsPerPage, this.searchTerm);
          },
          error: (error) => {
            this.toastr.error('Error al eliminar el capturador', 'Error');
            console.error('Error al eliminar:', error);
          }
        });
      }
    });
  }

  showAlert() {
    alert('¡Haz clic en un icono!');
  }

  check(event: any) {
    this.isChecked = event.checked;
  }

  onPageSizeChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getDigitizers(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onSearch(keyword: string) {
    this.searchTerm = keyword;
    this.currentPage = 0;
    this.getDigitizers(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  getDigitizers(page: number = 0, size: number = 10, keyword: string = '') {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `${UriConstants.GET_DIGITIZERS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;
    
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
          this.digitizersList = response.content.map((digitizer: IDigitizers) => ({
            id: digitizer.idMedicalRecordDigitizer,
            nombreCompleto: digitizer.digitizerName || 'N/A',
            matricula: digitizer.username || 'N/A',
            fechaInicio: Array.isArray(digitizer.startDate)
              ? digitizer.startDate.join('-')
              : digitizer.startDate || 'N/A',
            estatus: digitizer.status ? 'Activo' : 'Inactivo'
          }));
        } else {
          this.digitizersList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar la lista de capturadores', 'Error');
        this.digitizersList = [];
        this.totalElements = 0;
      },
    });
  }

  private mapStatus(status: string): string {
    switch (status) {
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVO':
        return 'Inactivo';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return 'Inactivo';
    }
  }

  onPageChange(event: number) {
    this.currentPage = event - 1; 
    this.getDigitizers(this.currentPage, this.itemsPerPage, this.searchTerm); 
  }

  onSort(event: {field: string, asc: boolean}) {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getDigitizers(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  openDetailsDialog(digitizer: any): void {
    this.dataSharingService.setAdminData(digitizer);
    // Aquí podrías abrir un diálogo de detalles específico para digitizers
    // const dialogRef = this.dialog.open(DetailsDigitizerComponent, {
    //   width: '800px',
    //   maxWidth: '90vw',
    //   maxHeight: '90vh',
    //   height: 'auto',
    //   panelClass: 'custom-dialog-container'
    // });
  }

  onStatusChange(event: { row: any, newStatus: string }) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      width: '300px',
      data: { message: `¿Estás seguro de que deseas cambiar el estatus a ${event.newStatus}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const digitizerId = event.row.id;
        const url = `${UriConstants.PATCH_DIGITIZER_STATUS}/${digitizerId}/status`;

        this.apiService.patchService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url,
          data: {} // El endpoint requiere solo el ID en la URL, no datos en el cuerpo
        }).subscribe({
          next: () => {
            // Actualizar el estado localmente
            event.row.estatus = event.newStatus;
            // Recargar los datos para asegurar consistencia
            this.getDigitizers(this.currentPage, this.itemsPerPage, this.searchTerm);
            this.toastr.success('Estado del capturador actualizado correctamente', 'Éxito');
          },
          error: (error) => {
            this.toastr.error('Error al cambiar el estado del capturador', 'Error');
            console.error('Error al cambiar estado:', error);
          }
        });
      }
    });
  }
}
