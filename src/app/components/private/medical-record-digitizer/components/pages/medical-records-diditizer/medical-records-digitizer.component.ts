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
import { CardPatientDataComponent, FormUpdatePatientComponent, OdontogramListComponent, StudentsOdontogramComponent } from "@mean/students";
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medical-records-diditizer',
  standalone: true,
  imports: [CardPatientDataComponent, MatCardModule, MatTabsModule, MatListModule, MatDivider, FormUpdatePatientComponent, MatButtonModule, StudentsOdontogramComponent, OdontogramListComponent],
  templateUrl: './medical-records-digitizer.component.html',
  styleUrl: './medical-records-digitizer.component.scss'
})
export class MedicalRecordsDigitizerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastrService);
  public patientUuid!: string;
  public medicalRecords: MedicalRecordsDigitizer[] = [];
  public creatingOdontogram = false;


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

  public createMedicalRecord(idPatient: string, idMedicalRecordCatalog: number) {
    this.apiService.postService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.POST_RELATIONSHIP_MEDICAL_RECORDS}?idPatient=${idPatient}&idMedicalRecordCatalog=${idMedicalRecordCatalog}`,
      data: {},
    }).subscribe({
      next: (response) => {
        this.toast.success('Historia clínica creada exitosamente', 'Éxito');
        this.goToMedicalRecord(idMedicalRecordCatalog, response.idPatientMedicalRecord);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  public navigateToMedicalRecord(medicalRecord: MedicalRecordsDigitizer): void {
    const alreadyExists = this.medicalRecords.some(
      mr => mr.id === medicalRecord.id && mr.patientId === this.patientUuid
    );

    if (alreadyExists) {
      this.goToMedicalRecord(medicalRecord.id, medicalRecord.patientMedicalRecordId ?? 0);
    } else {
      this.createMedicalRecord(this.patientUuid, medicalRecord.id);
    }
  }

  private goToMedicalRecord(medicalRecordId: number, patientMedicalRecordId: number): void {
    this.router.navigate([
      'medical-record-digitizer/medical-record',
      medicalRecordId,
      'patient',
      this.patientUuid]);
  }

}
