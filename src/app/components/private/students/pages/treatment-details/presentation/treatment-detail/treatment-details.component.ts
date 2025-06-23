import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import {
  CardPatientDataComponent,
  DialogConfirmSendToReviewComponent,
  DialogNewTreatmentComponent,
  OdontogramListComponent,
  OralProsthesisComponent,
  PreventiveDentistryPublicHealthComponent,
  StudentsDentalOperationComponent,
  StudentsGeneralHistoryComponent,
  StudentsOdontogramComponent,
  StudentsOralSurgeryHistoryComponent,
  StudentsPeriodonticsHistoryComponent,
  treatmentsNotifications,
} from '@mean/students';

import { MatListModule } from '@angular/material/list';
import { ClinicalHistoryCatalog, TreatmentDetailResponse } from '@mean/models';
import { LoadingComponent } from '@mean/shared';
import { STATUS_TREATMENTS } from '@mean/utils';
import { MedicalRecordRepositoryService } from '../../repository/medical-record-repository.service';
import { TreatmentRepositoryService } from '../../repository/treatment-repository.service';

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
    StudentsOdontogramComponent,
    OdontogramListComponent,
  ],
  templateUrl: './treatment-details.component.html',
  styleUrl: './treatment-details.component.scss',
})
export class TreatmentDetailsComponent
  extends treatmentsNotifications
  implements OnInit
{
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
  public creatingOdontogram = false;
  public readonlyTreatment : boolean = false; 
  
  private suppressTabChangeLogic = false;
  private idTreatmentDetail!: number;
  STATUS = STATUS_TREATMENTS;

  treatmentDetails!: TreatmentDetailResponse;
  selectedIndex = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

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
        this.patientClinicalHistoryId = response.patient.idPatientMedicalRecord;
        this.medicalRecordId = response.treatment.clinicalHistoryCatalogId;
        this.connectToTreatmentDetails(
          String(this.idTreatmentDetail),
          this.patientUuid
        );
        this.isLoading = false;
        if (this.treatmentDetails.status === this.STATUS.FINISHED) {
          this.readonlyTreatment = true;
        }
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
        treatment: this.treatmentDetails,
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

  changeOdontogramViewStatus() {
    this.creatingOdontogram = !this.creatingOdontogram;
  }

  transactionCarriedOut(): void {
    this.changeOdontogramViewStatus();
  }

  cancelOdontogramCreation(): void {
    this.changeOdontogramViewStatus();
  }
    
  protected override onTreatmentsNotification(): void {
    // Refresh treatment details when a notification is received
      this.loadTreatmentDetails(String(this.idTreatmentDetail));
      console.log('Treatment details updated');
  }
}
