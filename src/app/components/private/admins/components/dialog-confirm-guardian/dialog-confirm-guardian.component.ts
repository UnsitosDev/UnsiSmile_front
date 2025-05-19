import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-confirm-guardian',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dialog-confirm-guardian.component.html',
  styleUrls: ['./dialog-confirm-guardian.component.scss']
})
export class DialogConfirmGuardianComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmGuardianComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
