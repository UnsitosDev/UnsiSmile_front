import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { TreatmentDetailResponse } from '@mean/models';
import { ApiService, AuthService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';

@Component({
  selector: 'app-review-treatment',
  standalone: true,
  imports: [MatListModule, MatCardModule],
  templateUrl: './review-treatment.component.html',
  styleUrl: './review-treatment.component.scss'
})
export class ReviewTreatmentComponent {
  private readonly apiService = inject(ApiService);
  private token!: string;
  private tokenData!: TokenData;
  private userService = inject(AuthService);
  private professorId!: string;

  public treatments: PaginatedData<TreatmentDetailResponse> | null = null;

  ngOnInit() {
    this.getRole();
    this.fetchTreatments();
  }

  private getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.professorId = this.tokenData.sub;
  }

  fetchTreatments() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_TREATMENT_REVIEW}/${this.professorId}`,
      data: {},
    }).subscribe({
      next: (response: PaginatedData<TreatmentDetailResponse>) => {
        this.treatments = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
