import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ID_MEDICAL_RECORD_DIGITIZER, ID_PATIENT_MEDICAL_RECORD_DIGITIZER, PATIENT_UUID } from '@mean/models';
import { OralProsthesisComponent, StudentsPeriodonticsHistoryComponent, StudentsDentalOperationComponent, StudentsOralSurgeryHistoryComponent, PreventiveDentistryPublicHealthComponent, CardPatientDataComponent, StudentsGeneralHistoryComponent } from "@mean/students";
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-digitize-medical-record',
  standalone: true,
  imports: [OralProsthesisComponent, StudentsPeriodonticsHistoryComponent, StudentsDentalOperationComponent, StudentsOralSurgeryHistoryComponent, PreventiveDentistryPublicHealthComponent, MatCard, CardPatientDataComponent, StudentsGeneralHistoryComponent],
  templateUrl: './digitize-medical-record.component.html',
  styleUrl: './digitize-medical-record.component.scss'
})
export class DigitizeMedicalRecordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public patientUuid!: string;
  public medicalRecordId!: number;
  public patientMedicalRecordId!: number;

  ngOnInit(): void {
    this.routeParams();
    console.log('medicalRecordId:', this.medicalRecordId);
  }

  public routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
      this.medicalRecordId = +params[ID_MEDICAL_RECORD_DIGITIZER];
      this.patientMedicalRecordId = params[ID_PATIENT_MEDICAL_RECORD_DIGITIZER];
    });
  }
}
