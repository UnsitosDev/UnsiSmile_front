import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-authorization-treatment',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDialogModule, FormsModule, MatFormFieldModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dialog-authorization-treatment.component.html',
  styleUrl: './dialog-authorization-treatment.component.scss'
})
export class DialogAuthorizationTreatmentComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<DialogAuthorizationTreatmentComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    console.log('Dialog data:', this.data.idTreatmentDetail);
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public rejectedTreatment(){

  }
}
