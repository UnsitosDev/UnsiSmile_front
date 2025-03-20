import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { patientsTableData } from 'src/app/models/shared/patients';
import { Patient, PatientResponse } from 'src/app/models/shared/patients/patient/patient';
import { getEntityPropiedades } from 'src/app/models/tabla/tabla-columna';

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

  patientsList: patientsTableData[] = [];
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
    correo: 'person.email',
    curp: 'person.curp',
    estatus: 'user.status',
  };

  ngOnInit(): void {
    this.columns = [...getEntityPropiedades('patients'), 'estatus'];
    this.getClinicalHistoriesToReview();
    this.getPatients();
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

    this.apiService.getService({
      url: `${UriConstants.GET_HC_TO_REVIEW}`,
      params,
    }).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getPatients(page: number = 0, size: number = 10, keyword: string = ''): void {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const url = `${UriConstants.GET_PATIENTS}?page=${page}&size=${size}&keyword=${encodedKeyword}&order=${this.sortField}&asc=${this.sortAsc}`;

    this.apiService.getService({
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      url,
      data: {},
    }).subscribe({
      next: (response) => {
        if (Array.isArray(response.content)) {
          this.totalElements = response.totalElements;
          this.patientsList = response.content.map((patient: Patient) => {
            const { person } = patient;
            return {
              patientID: patient.idPatient,
              nombres: person.firstName,
              apellidos: `${person.firstLastName} ${person.secondLastName}`,
              correo: person.email,
              curp: person.curp,
              telefono: person.phone,
              fechaNacimiento: person.birthDate,
              estatus: 'Activo',
            };
          });
        } else {
          this.patientsList = [];
          this.totalElements = 0;
        }
      },
      error: (error) => {
        console.log(error);
        this.patientsList = [];
        this.totalElements = 0;
      },
    });
  }

  onSearch(keyword: string): void {
    this.searchTerm = keyword;
    this.currentPage = 0;
    this.getPatients(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.getPatients(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 0;
    this.getPatients(this.currentPage, this.itemsPerPage, this.searchTerm);
  }

  onSort(event: { field: string; asc: boolean }): void {
    this.sortField = event.field;
    this.sortAsc = event.asc;
    this.getPatients(this.currentPage, this.itemsPerPage, this.searchTerm);
  }
}
