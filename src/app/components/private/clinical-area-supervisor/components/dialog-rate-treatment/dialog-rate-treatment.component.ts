import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-rate-treatment',
  standalone: true,
  imports: [],
  templateUrl: './dialog-rate-treatment.component.html',
  styleUrl: './dialog-rate-treatment.component.scss'
})
export class DialogRateTreatmentComponent {
  readonly dialogRef = inject(MatDialogRef<DialogRateTreatmentComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  ngOnInit(){
    console.log('data', this.data);
  }

}
