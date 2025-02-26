import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-confirmation-alert',
  standalone: true,
  imports: [MatDialogModule,MatCardModule],
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
