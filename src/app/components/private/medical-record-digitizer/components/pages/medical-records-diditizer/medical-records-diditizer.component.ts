import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordsDigitizer, PATIENT_UUID } from '@mean/models';
import { ApiService } from '@mean/services';
import { CardPatientDataComponent, FormUpdatePatientComponent } from "@mean/students";
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-medical-records-diditizer',
  standalone: true,
  imports: [CardPatientDataComponent, MatCardModule, MatTabsModule, MatListModule, MatDivider, FormUpdatePatientComponent, MatButtonModule],
  templateUrl: './medical-records-diditizer.component.html',
  styleUrl: './medical-records-diditizer.component.scss'
})
export class MedicalRecordsDiditizerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private router = inject(Router);
  public patientUuid!: string;
  public medicalRecords: MedicalRecordsDigitizer[] = [];

  ngOnInit(): void {
    this.routeParams();
  }

  public routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
    });
    this.approvedTreatment(this.patientUuid);
  }

  public approvedTreatment(patientUuid: string) {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_MEDICAL_RECORDS_BY_ID}?idPatient=${patientUuid}`,
      data: {},
    }).subscribe({
      next: (response) => {
        this.medicalRecords = response;
        console.log('Medical Records:', this.medicalRecords);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  navigateToMedicalRecord(medicalRecord: MedicalRecordsDigitizer): void{
      // this.router.navigate([
      //   'students/treatment-details',
      //   medicalRecord.id,
      //   'patient',
      //   medicalRecord.patientId,
      // ]);
      console.log('Navigating to medical record:', medicalRecord);
  }
}
