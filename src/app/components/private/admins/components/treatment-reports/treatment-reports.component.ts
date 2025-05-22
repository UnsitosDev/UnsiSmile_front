import {Component, inject} from '@angular/core';
import {ApiService} from "@mean/services";
import {UriConstants} from "@mean/utils";

@Component({
  selector: 'app-treatment-reports',
  standalone: true,
  imports: [],
  templateUrl: './treatment-reports.component.html',
  styleUrl: './treatment-reports.component.scss'
})
export class TreatmentReportsComponent {
  private apiService = inject(ApiService);          // Servicio para hacer peticiones a la API

  ngOnInit() {
    this.fetchTreatments();
  }

  public fetchTreatments() {
    this.apiService
      .getService({
        url: `${UriConstants.GET_TREATMENT_DETAIL_REPORTS}`,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }
}
