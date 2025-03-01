import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  sendToReview() {
    this.apiService
      .putService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PUT_CLINICAL_HISTORY_REVIEW}/${this.data.idPatientClinicalHistory}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          // aqui tengo que llamar a getStatus 
        },
        error: (error) => {
          console.error('Error al enviar a revisión:', error);
          this.dialogRef.close(false); 
        },
      });
  }
}
