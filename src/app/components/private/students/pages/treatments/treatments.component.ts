import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { CardPatientDataComponent } from "../../components/card-patient-data/card-patient-data.component";
import { MedicalRecordGeneralTreatmentsComponent } from "../medical-records-treatments/medical-record-general-treatments/medical-record-general-treatments.component";

import { ApiService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';

import { ClinicalHistory } from 'src/app/models/history-clinic/historyClinic';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { TreatmentDetailResponse, Treatments } from '@mean/models';
import { PATIENT_UUID } from 'src/app/models/shared/route.params.model';

import { UriConstants } from '@mean/utils';
import { DialogNewTreatmentComponent } from '../../components/dialog-new-treatment/dialog-new-treatment.component';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { MatListModule } from '@angular/material/list';
import { PreventiveDentistryPublicHealthComponent } from "../history-clinics/preventive-dentistry-public-health/preventive-dentistry-public-health.component";

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [MatListModule, MatButton, MatTabsModule, MatCardModule, CardPatientDataComponent, MedicalRecordGeneralTreatmentsComponent, PreventiveDentistryPublicHealthComponent],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss',
})
export class TreatmentsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  public readonly configMedicalRecord = inject(GeneralHistoryService);
  public readonly dialog = inject(MatDialog);

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

  public patientConfigHistories: ClinicalHistory[] = [];

  ngOnInit(): void {
    this.routeParams();
    this.fetchTreatmentData();
  }

  public routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
    });
  }

  public onTabChanged(event: any) {
    if (event.index === 1) {
      if (!this.medicalRecordLoaded) {
        this.getMedicalRecordGeneral();
      }
    }
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
        url: `${UriConstants.GET_CONFIG_HISTORY_CLINICS}?idPatient=${this.patientUuid}`,
        data: {},
      })
      .subscribe({
        next: (response: ClinicalHistory[]) => {
          this.patientConfigHistories = response.filter(
            (history) => history.clinicalHistoryName == "General"
          );
          this.idHistoryGeneral = this.patientConfigHistories[0].patientClinicalHistoryId;
          this.patientMedicalRecord = this.patientConfigHistories[0].patientClinicalHistoryId;
          this.checkMedicalRecordExistence();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private checkMedicalRecordExistence(): void {
    const generalHistory = this.patientConfigHistories.find(
      history => history.id === this.idHistoryGeneral && history.patientId == this.patientUuid
    );

    if (!generalHistory) {
      this.createMedicalRecord();
    }
  }

  private createMedicalRecord(): void {
    console.log('Creando nueva historia clínica general...');
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
}
