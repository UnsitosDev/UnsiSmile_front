import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';

interface sendToReview {
  idPatientClinicalHistory: number;
  idFormSection: number
}
@Component({
  selector: 'app-dialog-confirm-send-to-review',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-confirm-send-to-review.component.html',
  styleUrl: './dialog-confirm-send-to-review.component.scss'
})
export class DialogConfirmSendToReviewComponent {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmSendToReviewComponent>);
  private apiService = inject(ApiService);
  public data = inject(MAT_DIALOG_DATA) as sendToReview;

  sendToReview() {
    this.apiService
      .putService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PUT_CLINICAL_HISTORY_REVIEW}/${this.data.idPatientClinicalHistory}/${this.data.idFormSection}`, 
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          console.log('ok')
        },
        error: (error) => {
          this.dialogRef.close(false);
        },
      });
  }
}
