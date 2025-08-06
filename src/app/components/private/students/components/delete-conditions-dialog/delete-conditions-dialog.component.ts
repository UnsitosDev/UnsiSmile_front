
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ITooth } from 'src/app/shared/models';

interface DialogData {
  tooth: ITooth;
}

@Component({
  selector: 'app-delete-conditions-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
],
  templateUrl: './delete-conditions-dialog.component.html',
  styleUrl: './delete-conditions-dialog.component.scss',
})
export class DeleteConditionsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConditionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Agregar propiedad selected a las condiciones
    this.data.tooth.conditions.forEach((c) => ((c as any).selected = false));
    this.data.tooth.faces.forEach((face) =>
      (face.conditions ?? []).forEach((c) => ((c as any).selected = false))
    );
  }

  onConfirmDelete(): void {
    const selectedConditions = {
      toothConditions: this.data.tooth.conditions.filter(
        (c) => (c as any).selected
      ),
      faceConditions: this.data.tooth.faces.map((face) => ({
        idFace: face.idFace,
        conditions: (face.conditions ?? []).filter((c) => (c as any).selected),
      })),
    };
    this.dialogRef.close(selectedConditions);
  }
}
