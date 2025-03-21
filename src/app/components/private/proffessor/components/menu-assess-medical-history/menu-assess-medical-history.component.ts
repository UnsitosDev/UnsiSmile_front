import { ChangeDetectionStrategy, Component, inject, Input, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-menu-assess-medical-history',
  standalone: true,
  imports: [],
  templateUrl: './menu-assess-medical-history.component.html',
  styleUrl: './menu-assess-medical-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuAssessMedicalHistoryComponent {
  @Input() idClinicalHistoryPatient!: number;
  @Input() selectedIndex: number | null = null;
  readonly dialog = inject(MatDialog);

  data!: {
    idClinicalHistoryPatient: number;
    selectedIndex: number | null;
  };

  openDialog(): void {
    this.data = { idClinicalHistoryPatient: this.idClinicalHistoryPatient, selectedIndex: this.selectedIndex };
    const dialogRef = this.dialog.open(DialogSendReview, { data: this.data });
    dialogRef.afterClosed().subscribe(result => { });
  }
}

@Component({
  selector: 'app-dialog-review',
  templateUrl: './app-dialog-review.html',
  styleUrl: './menu-assess-medical-history.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatCardModule, MatRadioModule, FormsModule, MatFormFieldModule, MatInputModule, ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSendReview implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogSendReview>);
  readonly data = inject(MAT_DIALOG_DATA);

  idClinicalHistoryPatient = this.data.idClinicalHistoryPatient;
  selectedIndex = this.data.selectedIndex;

  ngOnInit(): void {

  }
}