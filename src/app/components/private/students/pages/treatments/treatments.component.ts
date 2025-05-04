import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { CardPatientDataComponent } from "../../components/card-patient-data/card-patient-data.component";
import { MedicalRecordGeneralTreatmentsComponent } from "../medical-records-treatments/medical-record-general-treatments/medical-record-general-treatments.component";

import { ApiService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';

import { ClinicalHistory } from 'src/app/models/history-clinic/historyClinic';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { StudentItems, TreatmentDetailResponse, Treatments } from '@mean/models';
import { PATIENT_UUID } from 'src/app/models/shared/route.params.model';

import { UriConstants } from '@mean/utils';
import { DialogNewTreatmentComponent } from '../../components/dialog-new-treatment/dialog-new-treatment.component';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { MatListModule } from '@angular/material/list';
import { PreventiveDentistryPublicHealthComponent } from "../history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component";
import { StudentsOralSurgeryHistoryComponent } from "../history-clinics/oral-surgery/students-oral-surgery-history.component";
import { StudentsPeriodonticsHistoryComponent } from "../history-clinics/periodontics/students-periodontics-history.component";
import { OralProsthesisComponent } from "../history-clinics/oral-prosthesis/oral-prosthesis.component";
import { StudentsDentalOperationComponent } from "../history-clinics/dental-operation/students-dental-operation.component";
import { NavigationGuardService } from 'src/app/services/navigation.guard.service';
import { STATUS_TREATMENTS } from 'src/app/utils/statusToReview';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [MatListModule, MatButton, MatTabsModule, MatCardModule, CardPatientDataComponent, MedicalRecordGeneralTreatmentsComponent, PreventiveDentistryPublicHealthComponent, StudentsOralSurgeryHistoryComponent, StudentsPeriodonticsHistoryComponent, OralProsthesisComponent, StudentsDentalOperationComponent],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss',
})
export class TreatmentsComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  public readonly configMedicalRecord = inject(GeneralHistoryService);
  public readonly dialog = inject(MatDialog);
  private navigationGuard = inject(NavigationGuardService);

  public medicalRecord!: dataTabs;
  public medicalRecordId!: number;
  public patientUuid!: string;
  public idHistoryGeneral!: number;
  public patientMedicalRecord!: number;
  public medicalRecordLoaded = false;
  public isLoading = false;
  public treatmentsData!: Treatments[];
  public treatmentsPatient!: PaginatedData<TreatmentDetailResponse> | null;
  public viewTreatment: boolean = false;
  public tabMedicalRecord!: string;
  public patientClinicalHistoryId!: number;

  public patientConfigHistories: ClinicalHistory[] = [];
  STATUS = STATUS_TREATMENTS;
  ngOnInit(): void {
    this.routeParams();
    this.fetchTreatmentData();
    //this.navigationGuard.initialize(StudentItems.map(item => item.routerlink));
  }

  public onTabSelected(event: any): void {
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
    if (this.medicalRecordLoaded) {
      return;
    }

    this.isLoading = true;
    this.fetchMedicalRecordConfig();

    setTimeout(() => {
      this.medicalRecordLoaded = true;
      this.isLoading = false;
    }, 200);
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
          
        },
        error: (error) => {
          if (error.status === 404) {
            this.createMedicalRecord();
          } else {
            this.createMedicalRecord();
            console.error(error);
          }
        },
      });
  }

  public fetchIdMedicalRecordConfig() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CONFIG_HISTORY_CLINICS}?idPatient=${this.patientUuid}`,
        data: {},
      })
      .subscribe({
        next: (response: ClinicalHistory[]) => {
          this.patientConfigHistories = response.filter(
            (history) => history.clinicalHistoryName == "General"
          );
          this.patientMedicalRecord = this.patientConfigHistories[0].patientClinicalHistoryId;
        },
        error: (error) => {
          console.error(error);
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

  public fetchTreatmentData() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_TREATMENT_BY_ID}/${this.patientUuid}`,
      data: {},
    })
      .subscribe({
        next: (response: PaginatedData<TreatmentDetailResponse>) => {
          this.treatmentsPatient = response;
          this.patientClinicalHistoryId = this.treatmentsPatient.content[0].patientClinicalHistoryId;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openTreatment(treatment: TreatmentDetailResponse): void {
    this.viewTreatment = true;
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
    setTimeout(() => {
      this.tabGroup.selectedIndex = 2;
    });
  }
}
