import { ChangeDetectionStrategy, Component, inject, Input, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-assess-medical-history',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './menu-assess-medical-record.component.html',
  styleUrl: './menu-assess-medical-record.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuAssessMedicalHistoryComponent {
  @Input() idMedicalRecordPatient!: number;
  @Input() status: string | null = null;
  @Input() idReviewStatus: number | null = null;

  readonly dialog = inject(MatDialog);

  data!: {
    idMedicalRecordPatient: number;
    status: string | null;
    idReviewStatus: number | null;
  };

  openDialog(): void {
    this.data = { idMedicalRecordPatient: this.idMedicalRecordPatient, status: this.status, idReviewStatus: this.idReviewStatus };
    const dialogRef = this.dialog.open(DialogSendReview, { data: this.data });
    dialogRef.afterClosed().subscribe(result => { });
  }
}

interface IsaveReview {
  status: string;
  message: string;
  idReviewStatus: number
}

@Component({
  selector: 'app-dialog-review',
  templateUrl: './app-dialog-review.html',
  styleUrl: './menu-assess-medical-record.component.scss',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatCardModule, MatRadioModule, FormsModule, MatFormFieldModule, MatInputModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSendReview {
  readonly dialogRef = inject(MatDialogRef<DialogSendReview>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly apiService = inject(ApiService)
  readonly toastr = inject(ToastrService);

  public newStatus = '';
  public message = '';
  public idReviewStatus = this.data.idReviewStatus;

  saveReviewHc() {
    const data: IsaveReview = {
      status: this.newStatus,
      message: this.message,
      idReviewStatus: this.idReviewStatus
    };

    this.apiService
      .patchService({
        url: `${UriConstants.SAVE_REVIEW_HC}`,
        data: data
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('La revisión se envió con éxito')
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}