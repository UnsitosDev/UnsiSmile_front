import { Component, OnInit, inject } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-details-admin',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatDialogModule,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './details-admin.component.html',
  styleUrl: './details-admin.component.scss',
  host: {
    'class': 'dialog-responsive'
  }
})
export class DetailsAdminComponent implements OnInit {
  data: any;
  private dataSharingService = inject(DataSharingService);
  private dialogRef = inject(MatDialogRef<DetailsAdminComponent>);

  ngOnInit(): void {
    this.dataSharingService.adminData$.subscribe(adminData => {
      this.data = adminData;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
