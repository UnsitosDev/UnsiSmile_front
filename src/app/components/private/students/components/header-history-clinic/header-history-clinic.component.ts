import { Component, inject, Input } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MenuAssessMedicalHistoryComponent } from "../../../professor-clinical-area/components/menu-assess-medical-history/menu-assess-medical-history.component";
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
  @Input({ required: true }) currentSectionId!: number | null;
  @Input({ required: true }) currentStatus!: string | null;
  @Input({ required: true }) currentIndex!: number;
  @Input({ required: true }) role!: string;

  public dialog = inject(MatDialog);
  public STATUS = STATUS;
  public ROL = ROLES;

  statusMap: { [key: string]: string } = {
    IN_REVIEW: 'EN REVISIÓN <i class="fas fa-spinner"></i>',
    APPROVED: 'APROBADO <i class="fas fa-check-circle"></i>',
    REJECTED: 'RECHAZADO <i class="fas fa-times-circle"></i>',
    NOT_REQUIRED: '&nbsp;',
  };

  openConfirmDialog() {
    const currentTab = this.mappedHistoryData.tabs[this.currentIndex];
    const data = {
      idPatientClinicalHistory: +this.idPatientClinicalHistory,
      idFormSection: currentTab.idFormSection
    }
    const dialogRef = this.dialog.open(DialogConfirmSendToReviewComponent, {
      data: { idPatientClinicalHistory: +this.idPatientClinicalHistory, idFormSection: currentTab.idFormSection },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  translateStatus(status: string): string {
    return this.statusMap[status] || status;
  }
}
