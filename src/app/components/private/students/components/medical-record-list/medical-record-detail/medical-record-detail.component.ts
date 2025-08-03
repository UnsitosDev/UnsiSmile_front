import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { BaseNavigationComponent } from '../../../../../../core/base/base-navigation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
export class MedicalRecordDetailComponent extends BaseNavigationComponent implements OnInit {  
  medicalRecordTypeId: number = 0;
  loading = true;
  error: string | null = null;
  patientId: string = '';
  patientMedicalRecordId: number = 0;

  private route = inject(ActivatedRoute);

  constructor() {
    super();
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
