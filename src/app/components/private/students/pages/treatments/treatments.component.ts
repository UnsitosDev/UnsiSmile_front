import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CardPatientDataComponent } from "../../components/card-patient-data/card-patient-data.component";
import { ActivatedRoute } from '@angular/router';
import { PATIENT_UUID } from 'src/app/models/shared/route.params.model';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { ClinicalHistory } from 'src/app/models/history-clinic/historyClinic';
import { StudentsGeneralHistoryComponent } from "../history-clinics/general/students-general-history.component";
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { MedicalRecordGeneralTreatmentsComponent } from "../medical-records-treatments/medical-record-general-treatments/medical-record-general-treatments.component";

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, CardPatientDataComponent, StudentsGeneralHistoryComponent, MedicalRecordGeneralTreatmentsComponent],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss'
})
export class TreatmentsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private configMedicalRecord = inject(GeneralHistoryService);
  public medicalRecord!: dataTabs;
  public patientUuid!: string;
  public idHistoryGeneral!: number;
  public patientMedicalRecord!: number;
  public medicalRecordLoaded = false;
  public isLoading = false;

  public patientConfigHistories: ClinicalHistory[] = [];

  ngOnInit(): void {
    this.routeParams();
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
}
