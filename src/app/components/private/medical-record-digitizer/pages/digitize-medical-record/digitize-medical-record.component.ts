import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from "@angular/material/card";
import { ActivatedRoute } from '@angular/router';
import { ID_MEDICAL_RECORD_DIGITIZER, MEDICAL_RECORD_TYPES, PATIENT_UUID } from '@mean/models';
import { CardPatientDataComponent, OralProsthesisComponent, PreventiveDentistryPublicHealthComponent, StudentsDentalOperationComponent, StudentsGeneralHistoryComponent, StudentsOralSurgeryHistoryComponent, StudentsPeriodonticsHistoryComponent } from "@mean/students";
import { EndodonticMedicalRecordComponent } from "../../../students/pages/medical-records-forms/endodontic-medical-record/endodontic-medical-record.component";
import { PulpotomyMedicalRecordComponent } from "../../../students/pages/medical-records-forms/pulpotomy-medical-record/pulpotomy-medical-record.component";
import { PulpectomyMedicalRecordComponent } from "../../../students/pages/medical-records-forms/pulpectomy-medical-record/pulpectomy-medical-record.component";
import { DentalSurgeryMedicalRecordComponent } from "../../../students/pages/medical-records-forms/dental-surgery-medical-record/dental-surgery-medical-record.component";

@Component({
  selector: 'app-digitize-medical-record',
  standalone: true,
  imports: [OralProsthesisComponent, StudentsPeriodonticsHistoryComponent, StudentsDentalOperationComponent, StudentsOralSurgeryHistoryComponent, PreventiveDentistryPublicHealthComponent, MatCard, CardPatientDataComponent, StudentsGeneralHistoryComponent, MatButtonModule, EndodonticMedicalRecordComponent, PulpotomyMedicalRecordComponent, PulpectomyMedicalRecordComponent, DentalSurgeryMedicalRecordComponent],
  templateUrl: './digitize-medical-record.component.html',
  styleUrl: './digitize-medical-record.component.scss'
})
export class DigitizeMedicalRecordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  public patientUuid!: string;
  public medicalRecordId!: number;
  public medicalRecordType = MEDICAL_RECORD_TYPES;

  ngOnInit(): void {
    this.routeParams();
  }

  public routeParams() {
    this.route.params.subscribe((params) => {
      this.patientUuid = params[PATIENT_UUID];
      this.medicalRecordId = +params[ID_MEDICAL_RECORD_DIGITIZER];
    });
  }

  back(): void {
    this.location.back();
  }
}
