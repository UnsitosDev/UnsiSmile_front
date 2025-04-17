import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-details-area',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './details-area.component.html',
  styleUrl: './details-area.component.scss',
  host: {
    'class': 'dialog-responsive'
  }
})
export class DetailsAreaComponent implements OnInit {
  data: any;
  private dataSharingService = inject(DataSharingService);
  private dialogRef = inject(MatDialogRef<DetailsAreaComponent>);

  ngOnInit(): void {
    this.dataSharingService.areaData$.subscribe(areaData => {
      this.data = areaData;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
