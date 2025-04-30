import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { TreatmentDetailResponse } from '@mean/models';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { PATIENT_UUID } from 'src/app/models/shared/route.params.model';

@Component({
  selector: 'app-patient-treatment',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './patient-treatment.component.html',
  styleUrl: './patient-treatment.component.scss'
})
export class PatientTreatmentComponent {
private apiService = inject(ApiService);
public route = inject(ActivatedRoute);
public patientUuid!: string;
public treatmentsPatient: PaginatedData<TreatmentDetailResponse> | null = null;

ngOnInit(): void {
  this.routeParams();
  this.fetchTreatmentData();
}

routeParams() {
  this.route.params.subscribe((params) => {
    this.patientUuid = params[PATIENT_UUID];
  });
}

public fetchTreatmentData() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_TREATMENT_BY_ID}/${this.patientUuid}`,
      data: {},
    })
      .subscribe({
        next: (response: PaginatedData<TreatmentDetailResponse>) => {
          this.treatmentsPatient = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  formatArrayDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) return 'Fecha inválida';
    
    const year = dateArray[0];
    const month = dateArray[1].toString().padStart(2, '0');
    const day = dateArray[2].toString().padStart(2, '0');
    
    return `${day}/${month}/${year}`;
  }
}
