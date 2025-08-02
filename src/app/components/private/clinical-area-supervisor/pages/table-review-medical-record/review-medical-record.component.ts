import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { LoadingComponent } from '@mean/shared';
import { REVIEW_TABLE_DATA, ReviewAsigneds } from '@mean/supervisors';
import { UriConstants } from '@mean/utils';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { TablaDataComponent } from 'src/app/shared/components/tabla-data/tabla-data.component';
import { STATUS } from 'src/app/utils/statusToReview';

@Component({
  selector: 'app-review-history-clinics',
  standalone: true,
  imports: [MatCardModule, TablaDataComponent, MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule, LoadingComponent],
  templateUrl: './review-medical-record.component.html',
  styleUrl: './review-medical-record.component.scss',
})
export class ReviewMedicalRecordComponent implements OnInit {
  private readonly apiService = inject(ApiService<ReviewAsigneds>);
  private readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  public selectedStatus!: string; 
  public statusControl = new FormControl(STATUS.IN_REVIEW); 
  public STATUS = STATUS;
  public patientsList = [];
  public title = '';
  public columns: string[] = [];
  public currentPage = 0;
  public itemsPerPage = 10;
  public searchTerm = '';
  public totalElements = 0;
  public sortField = 'person.firstName';
  public sortAsc = true;
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly sortableColumns = {
    curp: 'patient.person.curp',
  };

  ngOnInit(): void {
    this.columns = [...REVIEW_TABLE_DATA];
    this.getClinicalHistoriesToReview();
  }

  onAction(accion: Accion) {
    if (accion.accion === 'Editar') {
      this.navigateToReview(accion.fila);
    }
  }

  navigateToReview(row: any): void {
    this.router.navigate([
      '/clinical-area-supervisor/review-section',
      row.formSectionId,
      'patient-medical-record',
      row.Expediente,
      'patient',
      row.idPatient,
      'review',
      row.idReviewStatus
    ]);
  }
  
  

  getClinicalHistoriesToReview(): void {
    const status = this.statusControl.value;
    this.setTitleBasedOnStatus(status);
    const params = {
      status,
      page: 0,
      size: 10,
      order: 'patientMedicalRecord.idPatientMedicalRecord',
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
            this.patientsList = response.content.map((reviewAsigned: ReviewAsigneds) => {
              return {
                idPatient: reviewAsigned.patient.id, 
                Paciente: reviewAsigned.patient.name,
                CURP: reviewAsigned.patient.curp,
                Expediente: reviewAsigned.idPatientMedicalRecord, 
                Estudiante: reviewAsigned.studentName,
                formSectionId: reviewAsigned.idSection,
                idReviewStatus: reviewAsigned.idReviewStatus
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