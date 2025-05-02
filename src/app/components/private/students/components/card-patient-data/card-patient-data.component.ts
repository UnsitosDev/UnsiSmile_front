import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { PatientResponse } from 'src/app/models/card-info-patient/card.info.patient';
import { mapToCardPatientView } from 'src/app/models/card-info-patient/card.info.patient.mapper';
import { cardGuardian } from 'src/app/models/shared/patients/cardPatient';

export interface PatientSummary {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  address: string;
  email: string;
  admissionDate: string;
  curp: string;
  medicalRecord: number;
}

@Component({
  selector: 'app-card-patient-data',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card-patient-data.component.html',
  styleUrl: './card-patient-data.component.scss'
})
export class CardPatientDataComponent implements OnInit {
  @Input() patientUuid!: string;
  @Input() data!: PatientSummary;
  @Input() guardianData: cardGuardian | null = null;
  private patientService = inject(ApiService);

  ngOnInit(): void {
    this.getInfoPatient();
  }

  getInfoPatient() {
    if (this.patientUuid !== undefined) {
      this.patientService.getService({
        url: `${UriConstants.GET_PATIENTS}/${this.patientUuid}`,
      }).subscribe({
        next: (response: PatientResponse) => {
          const mappedData = mapToCardPatientView(response);
          this.data = mappedData;
        },
        error: (error) => {
          console.error('Error fetching patient data:', error);
        },
      });
    }
  }
}
