import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StatusService } from 'src/app/shared';
import { MedicalRecordsContainerComponent } from '../../../pages/medical-records-forms/medical-records-container/medical-records-container.component';

@Component({
  selector: 'app-medical-record-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MedicalRecordsContainerComponent
  ],
  templateUrl: './medical-record-detail.component.html',
  styleUrls: ['./medical-record-detail.component.scss']
})
export class MedicalRecordDetailComponent implements OnInit {  
  medicalRecordTypeId: number = 0;
  loading = true;
  error: string | null = null;
  patientId: string = '';
  patientMedicalRecordId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private statusService: StatusService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(): void {
    // Get route parameters using modern RxJS subscription with observer object
    this.route.paramMap.subscribe(params => {
      this.medicalRecordTypeId = Number(params.get('medicalRecordTypeId')) || 0;
      this.patientId = params.get('patientId') || '';
      this.patientMedicalRecordId = Number(params.get('id')) || 0;
    });  
  }
}
