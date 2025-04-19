import { Component, inject, Input } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MenuAssessMedicalHistoryComponent } from "../../../proffessor/components/menu-assess-medical-history/menu-assess-medical-history.component";
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { STATUS } from 'src/app/utils/statusToReview';
import { ROLES } from 'src/app/utils/roles';
import { DialogConfirmSendToReviewComponent } from '../dialog-confirm-send-to-review/dialog-confirm-send-to-review.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header-history-clinic',
  standalone: true,
  imports: [MatCardModule, MenuAssessMedicalHistoryComponent],
  templateUrl: './header-history-clinic.component.html',
  styleUrl: './header-history-clinic.component.scss'
})
export class HeaderHistoryClinicComponent {
  @Input({ required: true }) mappedHistoryData!: dataTabs;
  @Input({ required: true }) idPatientClinicalHistory!: number;
  @Input() currentSectionId!: number;
  @Input() currentStatus!: string;
  public dialog = inject(MatDialog);
  public currentIndex: number = 0;
  public STATUS = STATUS;
  public ROL = ROLES;
  public role!: string;

  openConfirmDialog() {
    const currentTab = this.mappedHistoryData.tabs[this.currentIndex];
    const data = {
      idPatientClinicalHistory : +this.idPatientClinicalHistory,
      idFormSection : currentTab.idFormSection
    }
    const dialogRef = this.dialog.open(DialogConfirmSendToReviewComponent, {
      width: '300px',
      data: { idPatientClinicalHistory: +this.idPatientClinicalHistory, idFormSection: currentTab.idFormSection },
    });
    console.log(data);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Confirmed:', result);
      }
    });
  }
}
