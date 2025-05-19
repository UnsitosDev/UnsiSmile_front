import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import { CardPatientDataComponent } from '../../../components/card-patient-data/card-patient-data.component';


import { TreatmentDetailResponse } from '@mean/models';

import { MatListModule } from '@angular/material/list';
import { LoadingComponent } from '@mean/shared';
import { ClinicalHistoryCatalog } from 'src/app/models/history-clinic/historyClinic';
import { STATUS_TREATMENTS } from 'src/app/utils/statusToReview';
import { DialogConfirmSendToReviewComponent } from '../../../components/dialog-confirm-send-to-review/dialog-confirm-send-to-review.component';
import { DialogNewTreatmentComponent } from '../../../components/dialog-new-treatment/dialog-new-treatment.component';
import { StudentsDentalOperationComponent } from '../../history-clinics/dental-operation/students-dental-operation.component';
import { StudentsGeneralHistoryComponent } from '../../history-clinics/general/students-general-history.component';
import { OralProsthesisComponent } from '../../history-clinics/oral-prosthesis/oral-prosthesis.component';
import { StudentsOralSurgeryHistoryComponent } from '../../history-clinics/oral-surgery/students-oral-surgery-history.component';
import { StudentsPeriodonticsHistoryComponent } from '../../history-clinics/periodontics/students-periodontics-history.component';
import { PreventiveDentistryPublicHealthComponent } from '../../history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component';
import { MedicalRecordRepositoryService } from '../repository/medical-record-repository.service';
import { TreatmentRepositoryService } from '../repository/treatment-repository.service';
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
    PreventiveDentistryPublicHealthComponent,
    StudentsOralSurgeryHistoryComponent,
    StudentsPeriodonticsHistoryComponent,
    OralProsthesisComponent,
    StudentsDentalOperationComponent,
    LoadingComponent,
    StudentsGeneralHistoryComponent,
  ],
  templateUrl: './treatment-details.component.html',
  styleUrl: './treatment-details.component.scss',
})
export class TreatmentDetailsComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private readonly medicalRecordRepositoryService = inject(
    MedicalRecordRepositoryService
  );
  public readonly dialog = inject(MatDialog);
  private readonly treatmentService = inject(TreatmentRepositoryService);

  public patientClinicalHistoryId!: number;
  public patientUuid!: string;
  public medicalRecordId!: number;
  public idMedicalRecordGeneral: number = 1;
  public medicalRecordConfig!: ClinicalHistoryCatalog;
  public isLoading = true;
  public isLoadingGeneralMedicalRecord = true;

  private suppressTabChangeLogic = false;
  private idTreatmentDetail!: number;
  STATUS = STATUS_TREATMENTS;

  treatmentDetails!: TreatmentDetailResponse;
  selectedIndex = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.patientUuid = this.route.snapshot.params['idPatient'];
    this.idTreatmentDetail = this.route.snapshot.params['idTreatmentDetail'];
    this.loadTreatmentDetails(String(this.idTreatmentDetail));
    this.getMedicalRecordGeneral(this.patientUuid);
  }

  private loadTreatmentDetails(idTreatment: string): void {
    this.treatmentService.getTreatmentDetails(idTreatment).subscribe({
      next: (response) => {
        this.treatmentDetails = response;
        this.idTreatmentDetail = response.idTreatmentDetail;
        this.patientClinicalHistoryId = response.patientClinicalHistoryId;
        this.medicalRecordId = response.treatment.clinicalHistoryCatalogId;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading treatment details:', error);
        this.router.navigate(['/students/all-treatments']);
      },
    });
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
        this.getMedicalRecordGeneral(this.patientUuid);
        break;
      case 2:
        break;
      default:
        console.warn('Tab index not handled:', tabIndex);
    }
  }

  public getMedicalRecordGeneral(idPatient: string): void {
    this.medicalRecordRepositoryService
      .getMedicalRecordByPatientId(idPatient)
      .subscribe({
        next: (response) => {
          this.medicalRecordConfig = response;
          this.idMedicalRecordGeneral = response.idPatientMedicalRecord;
          this.isLoadingGeneralMedicalRecord = false;
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
    this.medicalRecordRepositoryService
      .createMedicalRecord(this.patientUuid)
      .subscribe({
        next: () => {
          this.getMedicalRecordGeneral(this.patientUuid);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  backToTreatments(): void {
    this.router.navigate(['/students/all-treatments']);
  }

  openDialogSendToReview(): void {
    const sendTreatment = true;
    this.dialog.open(DialogConfirmSendToReviewComponent, {
      data: {
        treatmentId: this.idTreatmentDetail,
        send: sendTreatment,
      },
    });
  }

  openUpdateTreatmentDialog(treatment: TreatmentDetailResponse): void {
    this.dialog.open(DialogNewTreatmentComponent, {
      width: '800px',
      data: {
        treatment: treatment,
      },
    });
  }
}
