import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@mean/services';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { ROLES } from 'src/app/utils/roles';
import { STATUS } from 'src/app/utils/statusToReview';
import { MenuAssessMedicalHistoryComponent } from '../../../clinical-area-supervisor/components/menu-assess-medical-redord/menu-assess-medical-record.component';
import { DialogConfirmSendToReviewComponent } from '../dialog-confirm-send-to-review/dialog-confirm-send-to-review.component';

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

  private userService = inject(AuthService);
  private token!: string;
  private tokenData!: TokenData;
  public userRole!: string;

  ngOnInit(): void {
  }
  
  private getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.userRole = this.tokenData.role[0].authority;
  }

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
    const dialogRef = this.dialog.open(DialogConfirmSendToReviewComponent, {
      data: { idPatientClinicalHistory: +this.idPatientClinicalHistory, idFormSection: this.currentSectionId },
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
