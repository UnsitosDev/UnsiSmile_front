import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-comments-treatments',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-comments-treatments.component.html',
  styleUrl: './dialog-comments-treatments.component.scss'
})
export class DialogCommentsTreatmentsComponent implements OnInit{
  public readonly data = inject(MAT_DIALOG_DATA);
  ngOnInit(): void { }
}
