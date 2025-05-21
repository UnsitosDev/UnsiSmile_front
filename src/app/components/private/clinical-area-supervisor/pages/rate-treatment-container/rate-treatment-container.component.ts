import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ID_TREATMENT_DETAIL, MEDICAL_RECORD_ID, PATIENT_UUID } from '@mean/models';
import { OralProsthesisComponent, PreventiveDentistryPublicHealthComponent, StudentsDentalOperationComponent, StudentsOralSurgeryHistoryComponent, StudentsPeriodonticsHistoryComponent } from '@mean/students';
import { DialogRateTreatmentComponent } from '../../components/dialog-rate-treatment/dialog-rate-treatment.component';

@Component({
  selector: 'app-rate-treatment-container',
  standalone: true,
  imports: [OralProsthesisComponent, StudentsPeriodonticsHistoryComponent, StudentsDentalOperationComponent, StudentsPeriodonticsHistoryComponent, StudentsOralSurgeryHistoryComponent, PreventiveDentistryPublicHealthComponent],
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

  
  opedDialogRateTreatment() {
    const dialogRef = this.dialog.open(DialogRateTreatmentComponent, {
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
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
      console.log(this.medicalRecord, this.idPatient)
    });
    this.isLoading = false;
  }

}
