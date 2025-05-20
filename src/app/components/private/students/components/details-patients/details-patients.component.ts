import { Component, OnInit, inject } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-patients',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatDialogModule,
  ],
  templateUrl: './details-patients.component.html',
  styleUrl: './details-patients.component.scss',
  host: {
    'class': 'dialog-responsive'
  }
})
export class DetailsPatientsComponent implements OnInit {
  data: any;
  private dataSharingService = inject(DataSharingService);
  private dialogRef = inject(MatDialogRef<DetailsPatientsComponent>);

  ngOnInit(): void {
    this.dataSharingService.patientData$.subscribe(patientData => {
      this.data = patientData;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
