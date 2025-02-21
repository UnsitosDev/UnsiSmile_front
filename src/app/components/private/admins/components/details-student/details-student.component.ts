import { Component, OnInit, inject } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-details-student',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatDialogModule,  
  ],
  templateUrl: './details-student.component.html',
  styleUrl: './details-student.component.scss',
  host: {
    'class': 'dialog-responsive'
  }
})
export class DetailsStudentComponent implements OnInit {
  data: any;
  private dataSharingService = inject(DataSharingService);

  ngOnInit(): void {
    this.dataSharingService.adminData$.subscribe(studentData => {
      this.data = studentData;
      console.log('studentData', studentData);
    });
  }
}
