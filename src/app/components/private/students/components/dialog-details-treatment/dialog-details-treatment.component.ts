import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TreatmentDetailResponse } from '@mean/models';
import { ArrayToDatePipe } from '@mean/shared';
import { DialogConfirmSendToReviewComponent } from '../dialog-confirm-send-to-review/dialog-confirm-send-to-review.component';
import { MatCardModule } from '@angular/material/card';

export interface TreatmentDetail {
    treatment: TreatmentDetailResponse;
}

@Component({
  selector: 'app-dialog-details-treatment',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ArrayToDatePipe, MatCardModule],
  templateUrl: './dialog-details-treatment.component.html',
  styleUrl: './dialog-details-treatment.component.scss'
})
export class DialogDetailsTreatmentComponent implements OnInit {
  public readonly dialogRef = inject(MatDialogRef<DialogDetailsTreatmentComponent>);
  public readonly data: TreatmentDetail = inject(MAT_DIALOG_DATA);
  public readonly dialog = inject(MatDialog);

  ngOnInit(): void { }

  openDialogSendToReview(): void {
    const sendTreatment = true;
    const dialogRef = this.dialog.open(DialogConfirmSendToReviewComponent, {
      data: {
        treatmentId: this.data.treatment.idTreatmentDetail,
        send: sendTreatment,
        treatment: this.data.treatment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.closeDialog();
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }  
}
