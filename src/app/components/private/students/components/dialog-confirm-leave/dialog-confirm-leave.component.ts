import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-leave',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent],
  templateUrl: './dialog-confirm-leave.component.html',
  styleUrl: './dialog-confirm-leave.component.scss'
})
export class DialogConfirmLeaveComponent {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmLeaveComponent>);

}
