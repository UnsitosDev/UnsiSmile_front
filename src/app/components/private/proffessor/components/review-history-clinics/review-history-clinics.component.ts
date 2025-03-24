import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { patientsTableDataProfessor } from 'src/app/models/shared/patients';
import { Patient, PatientResponse } from 'src/app/models/shared/patients/patient/patient';
import { Accion, getEntityPropiedades } from 'src/app/models/tabla/tabla-columna';
import { Router } from '@angular/router';
import { DialogHistoryClinicsComponent } from '../../../students/components/dialog-history-clinics/dialog-history-clinics.component';

@Component({
  selector: 'app-review-history-clinics',
  standalone: true,
  imports: [MatCardModule, TablaDataComponent],
  templateUrl: './review-history-clinics.component.html',
  styleUrl: './review-history-clinics.component.scss',
})
export class ReviewHistoryClinicsComponent implements OnInit {
  private readonly apiService = inject(ApiService<PatientResponse>);
  private readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  patientsList: patientsTableDataProfessor[] = [];
  title = 'Pacientes con historias clínicas por revisar';
  columns: string[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  searchTerm = '';
  totalElements = 0;
  sortField = 'person.firstName';
  sortAsc = true;

  readonly sortableColumns = {
    nombres: 'person.firstName',
    apellidos: 'person.firstLastName',
    curp: 'person.curp',
  };

  ngOnInit(): void {
    this.columns = [...getEntityPropiedades('professor')];
    this.getClinicalHistoriesToReview();
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.getListHc(accion.fila);
    }
  }

  getListHc(objeto: any) {
    console.log(objeto);
    this.dialog.open(DialogHistoryClinicsComponent, {
      width: '650px',
      data: { objeto },
    });
  }

  getClinicalHistoriesToReview(): void {
    const status = 'IN_REVIEW';
    const params = {
      status,
      page: 0,
      size: 10,
      order: 'patientClinicalHistory.idPatientClinicalHistory',
      asc: true,
    };

    this.apiService
      .getService({
        url: `${UriConstants.GET_HC_TO_REVIEW}`,
        params,
      })
      .subscribe({
        next: (response) => {
          if (Array.isArray(response.content)) {
            this.totalElements = response.totalElements;
            this.patientsList = response.content.map((patient: Patient) => {
              const { person, medicalRecordNumber } = patient;
              return {
                nombres: `${person.firstName} ${person.secondName}`,
                apellidos: `${person.firstLastName} ${person.secondLastName}`,
                curp: person.curp,
                expediente: medicalRecordNumber 
              };
            });
          } else {
            this.patientsList = [];
            this.totalElements = 0;
          }
        },
        error: (error) => {
          console.error(error);
          this.patientsList = [];
          this.totalElements = 0;
        },
      });
  }

  onSearch(keyword: string): void {
    this.searchTerm = keyword;
    this.currentPage = 0;
    this.getClinicalHistoriesToReview();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.getClinicalHistoriesToReview();
  }
  
  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getClinicalHistoriesToReview();
  }
  
  onSort(event: { field: string; asc: boolean }): void {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getClinicalHistoriesToReview();
  }
}