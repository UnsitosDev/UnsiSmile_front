import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ID_STATUS, ID_TREATMENT_DETAIL, MEDICAL_RECORD_ID, MEDICAL_RECORD_TYPES, PATIENT_UUID } from '@mean/models';
import { OralProsthesisComponent, PreventiveDentistryPublicHealthComponent, StudentsDentalOperationComponent, StudentsOralSurgeryHistoryComponent, StudentsPeriodonticsHistoryComponent } from '@mean/students';
import { StudentsGeneralHistoryComponent } from "../../../students/pages/medical-records-forms/general/students-general-history.component";
import { OdontogramContainerComponent } from '../../../students/pages/odontogram-container/odontogram-container.component';
import { DialogRateTreatmentComponent } from '../../components/dialog-rate-treatment/dialog-rate-treatment.component';
import { EndodonticMedicalRecordComponent } from "../../../students/pages/medical-records-forms/endodontic-medical-record/endodontic-medical-record.component";
import { PulpotomyMedicalRecordComponent } from "../../../students/pages/medical-records-forms/pulpotomy-medical-record/pulpotomy-medical-record.component";
import { PulpectomyMedicalRecordComponent } from "../../../students/pages/medical-records-forms/pulpectomy-medical-record/pulpectomy-medical-record.component";
import { DentalSurgeryMedicalRecordComponent } from "../../../students/pages/medical-records-forms/dental-surgery-medical-record/dental-surgery-medical-record.component";

@Component({
  selector: 'app-rate-treatment-container',
  standalone: true,
  imports: [OralProsthesisComponent, StudentsPeriodonticsHistoryComponent, StudentsDentalOperationComponent, StudentsPeriodonticsHistoryComponent, StudentsOralSurgeryHistoryComponent, PreventiveDentistryPublicHealthComponent, StudentsGeneralHistoryComponent, MatTabsModule, OdontogramContainerComponent, MatCardTitle, MatCard, EndodonticMedicalRecordComponent, PulpotomyMedicalRecordComponent, PulpectomyMedicalRecordComponent, DentalSurgeryMedicalRecordComponent],
  templateUrl: './rate-treatment-container.component.html',
  styleUrl: './rate-treatment-container.component.scss',
})
export class RateTreatmentContainerComponent implements OnInit{
  
  readonly dialog = inject(MatDialog);
  private router = inject(ActivatedRoute);
  
  private idTreatmentDetail!: number;
  public idPatient!: string;
  public medicalRecord!: number;
  public isLoading: boolean = true;
  public idStatus!: number;
  public medicalRecordType= MEDICAL_RECORD_TYPES;

  
  opedDialogRateTreatment() {
    const dialogRef = this.dialog.open(DialogRateTreatmentComponent, {
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
        idStatus: this.idStatus
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.idTreatmentDetail = params[ID_TREATMENT_DETAIL]
      this.idPatient = params[PATIENT_UUID];
      this.medicalRecord = Number( params[MEDICAL_RECORD_ID]);
      this.idStatus = params[ID_STATUS];
    });
    this.isLoading = false;
  }

}
