import { Component, OnInit, inject } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-details-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule,MatCardContent],
  templateUrl: './details-admin.component.html',
  styleUrl: './details-admin.component.scss'
})
export class DetailsAdminComponent implements OnInit {
  data: any;
  private dataSharingService = inject(DataSharingService);

  ngOnInit(): void {
    this.dataSharingService.adminData$.subscribe(adminData => {
      this.data = adminData;
      console.log('adminData', adminData);
    });
  }
}
