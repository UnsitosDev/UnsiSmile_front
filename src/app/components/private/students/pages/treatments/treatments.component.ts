import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import { CardPatientDataComponent } from "../../components/card-patient-data/card-patient-data.component";
import { MedicalRecordGeneralTreatmentsComponent } from "../medical-records-treatments/medical-record-general-treatments/medical-record-general-treatments.component";

import { ApiService } from '@mean/services';

import { TreatmentDetailResponse } from '@mean/models';
import { PATIENT_UUID } from 'src/app/models/shared/route.params.model';

import { MatListModule } from '@angular/material/list';
import { UriConstants } from '@mean/utils';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { STATUS_TREATMENTS } from 'src/app/utils/statusToReview';
import { LoadingComponent } from "../../../../../models/shared/loading/loading.component";
import { DialogNewTreatmentComponent } from '../../components/dialog-new-treatment/dialog-new-treatment.component';
import { StudentsDentalOperationComponent } from "../history-clinics/dental-operation/students-dental-operation.component";
import { OralProsthesisComponent } from "../history-clinics/oral-prosthesis/oral-prosthesis.component";
import { StudentsOralSurgeryHistoryComponent } from "../history-clinics/oral-surgery/students-oral-surgery-history.component";
import { StudentsPeriodonticsHistoryComponent } from "../history-clinics/periodontics/students-periodontics-history.component";
import { PreventiveDentistryPublicHealthComponent } from "../history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component";
import { StudentsGeneralHistoryComponent } from "../history-clinics/general/students-general-history.component";
import { DialogConfirmSendToReviewComponent } from '../../components/dialog-confirm-send-to-review/dialog-confirm-send-to-review.component';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [MatListModule, MatButton, MatTabsModule, MatCardModule, CardPatientDataComponent, MedicalRecordGeneralTreatmentsComponent, PreventiveDentistryPublicHealthComponent, StudentsOralSurgeryHistoryComponent, StudentsPeriodonticsHistoryComponent, OralProsthesisComponent, StudentsDentalOperationComponent, LoadingComponent, StudentsGeneralHistoryComponent],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss',
})
export class TreatmentsComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  public readonly dialog = inject(MatDialog);

  public patientUuid!: string;
  public isLoading = false;
  public treatmentsPatient!: PaginatedData<TreatmentDetailResponse> | null;
  public viewTreatment = false;
  public tabMedicalRecord!: string;
  public patientClinicalHistoryId!: number;
  public idMedicalRecordGeneral!: number;
  public medicalRecordId!: number;
  public medicalRecordLoaded = false;
  private suppressTabChangeLogic = false;
  private idTreatmentDetail!: number;
  public selectedTreatment!: TreatmentDetailResponse;


  public isPatientLoading = false;
  public isPatientLastPage = false;
  public currentPatientPage = 0;

  STATUS = STATUS_TREATMENTS;

  ngOnInit(): void {
    this.routeParams();
  }

  public onTabSelected(event: any): void {
    if (this.suppressTabChangeLogic) {
      this.suppressTabChangeLogic = false;
      return;
    }

    const tabIndex = event.index;
    switch (tabIndex) {
      case 0:
        break;
      case 1:
        this.getMedicalRecordGeneral();
        break;
      case 2:
        this.fetchTreatmentData();
        break;
      default:
        console.warn('Tab index not handled:', tabIndex);
    }
  }

  public routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
    });
  }

  public getMedicalRecordGeneral() {
    this.fetchMedicalRecordConfig();
  }

  public fetchMedicalRecordConfig() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_GENERAL_MEDICAL_RECORD}?idPatient=${this.patientUuid}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.medicalRecordLoaded = true;
          this.idMedicalRecordGeneral = response.idPatientMedicalRecord;
        },
        error: (errorResponse) => {
          if (errorResponse.status === 404) {
            this.createMedicalRecord();
          } else {
            console.error('Error:', errorResponse);
          }
        },
      });
  }

  createMedicalRecord(): void {
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_GENERAL_MEDICAL_RECORD}?idPatient=${this.patientUuid}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.fetchMedicalRecordConfig();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openDialogNewTreatment(): void {
    const dialogRef = this.dialog.open(DialogNewTreatmentComponent, {
      width: '800px',
      data: {
        patientUuid: this.patientUuid
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchTreatmentData();
      }
    });
  }

  public fetchTreatmentData(page: number = 0, resetPagination: boolean = false): void {
    if (resetPagination) {
      this.currentPatientPage = 0;
      this.treatmentsPatient = null;
    }

    this.isPatientLoading = true;

    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_TREATMENT_BY_ID}/${this.patientUuid}?page=${page}&size=10`,
      data: {},
    }).subscribe({
      next: (response: PaginatedData<TreatmentDetailResponse>) => {
        this.handlePatientResponse(response, page);
        if (response.content.length > 0) {
          this.patientClinicalHistoryId = response.content[0].patientClinicalHistoryId;
          this.idTreatmentDetail = response.content[0].idTreatmentDetail;
        }
      },
      error: (error) => {
        console.error('Error fetching patient treatments:', error);
        this.isPatientLoading = false;
      }
    });
  }


  private handlePatientResponse(response: PaginatedData<TreatmentDetailResponse>, page: number): void {
    if (!this.treatmentsPatient || page === 0) {
      this.treatmentsPatient = response;
    } else {
      this.treatmentsPatient.content = [...this.treatmentsPatient.content, ...response.content];
      this.treatmentsPatient.pageable = response.pageable;
      this.treatmentsPatient.last = response.last;
      this.treatmentsPatient.totalPages = response.totalPages;
    }

    this.isPatientLastPage = response.last;
    this.currentPatientPage = page;
    this.isPatientLoading = false;
  }

  public loadMorePatientTreatments(): void {
    if (!this.isPatientLoading && !this.isPatientLastPage) {
      this.fetchTreatmentData(this.currentPatientPage + 1);
    }
  }

  openTreatment(treatment: TreatmentDetailResponse): void {
    this.viewTreatment = true;
    // Almacena el tratamiento para mostrarlo en el btn para enviar a revisión
    this.selectedTreatment = treatment;
    this.patientClinicalHistoryId = treatment.patientClinicalHistoryId;
    this.idTreatmentDetail = treatment.idTreatmentDetail;
    this.medicalRecordId = treatment.treatment.clinicalHistoryCatalogId;
    this.tabMedicalRecord = treatment.treatment.clinicalHistoryCatalogName;
  }

  formatArrayDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) return 'Fecha inválida';

    const year = dateArray[0];
    const month = dateArray[1].toString().padStart(2, '0');
    const day = dateArray[2].toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  backToTreatments(): void {
    this.viewTreatment = false;
    this.suppressTabChangeLogic = true;
    setTimeout(() => {
      this.tabGroup.selectedIndex = 2;
      setTimeout(() => this.suppressTabChangeLogic = false, 100);
    });
  }

  openDialogSendToReview(): void {
    const sendTreatment = true;
    const dialogRef = this.dialog.open(DialogConfirmSendToReviewComponent, {
      width: '800px',
      data: {
        treatmentId: this.idTreatmentDetail,
        send: sendTreatment,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchTreatmentData();
      }
    });
  }

  openUpdateTreatmentDialog(treatment: TreatmentDetailResponse): void {
    const dialogRef = this.dialog.open(DialogNewTreatmentComponent, {
      width: '800px',
      data: {
        treatment: treatment,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchTreatmentData();
      }
    });
  }
}