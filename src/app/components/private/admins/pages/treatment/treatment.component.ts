import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import { ApiService } from '@mean/services';

import { dataTabs, TreatmentDetailResponse } from '@mean/models';
import {
  ID_PATIENT_CLINICAL_HISTORY,
  ID_TREATMENT_DETAIL,
  MEDICAL_RECORD_ID,
  PATIENT_UUID,
  PATIENT_UUID_TREATMENT,
  STATUS_TREATMENT,
  TAB_MEDICAL_RECORD,
} from 'src/app/models/shared/route.params.model';

import { MatListModule } from '@angular/material/list';
import {
  CardPatientDataComponent,
  DialogNewTreatmentComponent,
  FormUpdatePatientComponent,
  StudentsGeneralHistoryComponent,
} from '@mean/students';
import {STATUS_TREATMENTS, UriConstants} from '@mean/utils';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import {MatTooltip} from "@angular/material/tooltip";
import { ArrayToDatePipe } from '@mean/shared';
import { DialogUpdateTreatmentComponent } from '../../../students/components/dialog-update-treatment/dialog-update-treatment.component';
import { TableStudentsComponent } from "../../components/table-students/table-students.component";
import { TableAssignStudentComponent } from "../../components/table-assign-student/table-assign-student.component";
export interface TreatmentParams {
  idTreatmentDetail: number;
  patientClinicalHistoryId: number;
  medicalRecordId: number;
  patientUuid: string;
  tabMedicalRecord: string;
  selectedTreatment: TreatmentDetailResponse;
  status: string;
}
@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [
    MatListModule,
    MatButton,
    MatTabsModule,
    MatCardModule,
    CardPatientDataComponent,
    StudentsGeneralHistoryComponent,
    FormUpdatePatientComponent,
    MatTooltip,
    ArrayToDatePipe,
    TableStudentsComponent,
    TableAssignStudentComponent
],
  templateUrl: './treatment.component.html',
  styleUrl: './treatment.component.scss',
})
export class TreatmentComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  public readonly dialog = inject(MatDialog);

  public patientUuid!: string;
  public isLoading = false;
  public treatmentsPatient!: PaginatedData<TreatmentDetailResponse> | null;
  public viewTreatment = false;
  public tabMedicalRecord!: string;
  public patientClinicalHistoryId!: number;
  public medicalRecordId!: number;
  public medicalRecordLoaded = false;
  private suppressTabChangeLogic = false;
  private idTreatmentDetail!: number;
  public selectedTreatment!: TreatmentDetailResponse;
  public medicalRecordConfig!: dataTabs;
  public statusParam!: string;

  public isPatientLoading = false;
  public isPatientLastPage = false;
  public currentPatientPage = 0;
  STATUS = STATUS_TREATMENTS;

  ngOnInit(): void {
    this.routeParams();
    this.checkForPreselectedTreatment();
  }

  private checkForPreselectedTreatment(): void {
    const hasQueryParams =
      Object.keys(this.route.snapshot.queryParams).length > 0;

    if (hasQueryParams || history.state?.treatment) {
      this.route.queryParams.subscribe((params) => {
        const treatmentParams: TreatmentParams = {
          idTreatmentDetail: params[ID_TREATMENT_DETAIL],
          patientClinicalHistoryId: params[ID_PATIENT_CLINICAL_HISTORY],
          medicalRecordId: params[MEDICAL_RECORD_ID],
          patientUuid: params[PATIENT_UUID_TREATMENT],
          tabMedicalRecord: params[TAB_MEDICAL_RECORD],
          selectedTreatment: history.state.treatment,
          status: params[STATUS_TREATMENT],
        };

        if (
          treatmentParams.idTreatmentDetail ||
          treatmentParams.selectedTreatment
        ) {
          this.openTreatmentParams(treatmentParams);

          setTimeout(() => {
            this.suppressTabChangeLogic = true;
            this.tabGroup.selectedIndex = 1;
          }, 0);
        }
      });
    }
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

  openDialogNewTreatment(): void {
    const dialogRef = this.dialog.open(DialogNewTreatmentComponent, {
      data: {
        patientUuid: this.patientUuid,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTreatmentData();
      }
    });
  }

  public fetchTreatmentData(
    page: number = 0,
    resetPagination: boolean = false
  ): void {
    if (resetPagination) {
      this.currentPatientPage = 0;
      this.treatmentsPatient = null;
    }

    this.isPatientLoading = true;

    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_TREATMENT_BY_ID}/${this.patientUuid}?page=${page}&size=10`,
        data: {},
      })
      .subscribe({
        next: (response: PaginatedData<TreatmentDetailResponse>) => {
          this.handlePatientResponse(response, page);
          if (response.content.length > 0) {
            this.patientClinicalHistoryId =
              response.content[0].patient.idPatientMedicalRecord;
            this.idTreatmentDetail = response.content[0].idTreatmentDetail;
          }
        },
        error: (error) => {
          console.error('Error fetching patient treatments:', error);
          this.isPatientLoading = false;
        },
      });
  }

  private handlePatientResponse(
    response: PaginatedData<TreatmentDetailResponse>,
    page: number
  ): void {
    if (!this.treatmentsPatient || page === 0) {
      this.treatmentsPatient = response;
    } else {
      this.treatmentsPatient.content = [
        ...this.treatmentsPatient.content,
        ...response.content,
      ];
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

  navigateToTreatmentDetails(treatment: TreatmentDetailResponse): void {
    this.router.navigate([
      'students/treatment-details',
      treatment.idTreatmentDetail,
      'patient',
      treatment.patient.id,
    ]);
  }

  openTreatmentParams(treatment: TreatmentParams): void {
    this.viewTreatment = true;
    // Almacena el tratamiento para mostrarlo en el btn para enviar a revisión
    this.selectedTreatment = treatment.selectedTreatment;
    this.patientClinicalHistoryId = treatment.patientClinicalHistoryId;
    this.idTreatmentDetail = treatment.idTreatmentDetail;
    this.medicalRecordId = Number(treatment.medicalRecordId);
    this.tabMedicalRecord = treatment.tabMedicalRecord;
  }

  openUpdateTreatmentDialog(treatment: TreatmentDetailResponse): void {
    const dialogRef = this.dialog.open(DialogUpdateTreatmentComponent, {
      width: '800px',
      data: {
        treatment: treatment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTreatmentData();
      }
    });
  }
}
