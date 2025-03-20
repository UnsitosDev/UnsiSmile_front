import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';

@Component({
  selector: 'app-review-history-clinics',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './review-history-clinics.component.html',
  styleUrl: './review-history-clinics.component.scss'
})
export class ReviewHistoryClinicsComponent implements OnInit {

  public hcToReview = inject(ApiService);

  ngOnInit(): void {
    this.getListHc();
  }

  getListHc() {
    const status = 'IN_REVIEW';
    const params = {
      status: status,
      page: 0,
      size: 10,
      order: 'patientClinicalHistory.idPatientClinicalHistory',
      asc: true
    };

    this.hcToReview
      .getService({
        url: `${UriConstants.GET_HC_TO_REVIEW}`,
        params: params
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

}
