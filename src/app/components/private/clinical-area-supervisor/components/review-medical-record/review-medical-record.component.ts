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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { STATUS } from 'src/app/utils/statusToReview';

@Component({
  selector: 'app-review-history-clinics',
  standalone: true,
  imports: [MatCardModule, TablaDataComponent, MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule],
  templateUrl: './review-medical-record.component.html',
  styleUrl: './review-medical-record.component.scss',
})
export class ReviewMedicalRecordComponent implements OnInit {
  private readonly apiService = inject(ApiService<PatientResponse>);
  private readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  public selectedStatus!: string; 
  public statusControl = new FormControl(STATUS.IN_REVIEW); 
  public STATUS = STATUS;
  public patientsList: patientsTableDataProfessor[] = [];
  public title = '';
  public columns: string[] = [];
  public currentPage = 0;
  public itemsPerPage = 10;
  public searchTerm = '';
  public totalElements = 0;
  public sortField = 'person.firstName';
  public sortAsc = true;

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
    this.dialog.open(DialogHistoryClinicsComponent, {
      width: '650px',
      data: { objeto },
    });
  }

  getClinicalHistoriesToReview(): void {
    const status = this.statusControl.value;
    this.setTitleBasedOnStatus(status);
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
                patientID: patient.idPatient, 
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

  setTitleBasedOnStatus(status: string | null): void {
    switch (status) {
      case STATUS.IN_REVIEW:
        this.title = 'Historias Clínicas en Revisión';
        break;
      case STATUS.REJECTED:
        this.title = 'Historias Clínicas Rechazadas';
        break;
      case STATUS.APPROVED:
        this.title = 'Historias Clínicas Aprobadas';
        break;
      default:
        this.title = 'Historias Clínicas';
    }
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