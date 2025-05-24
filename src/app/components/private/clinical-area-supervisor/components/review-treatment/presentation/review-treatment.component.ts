import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { TreatmentDetailResponse } from '@mean/models';
import { ApiService, AuthService } from '@mean/services';
import { STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { treatmentsListNotifications } from '../components/treatments-list-notifications.component';
import {LoadingComponent} from "@mean/shared";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-review-treatment',
  standalone: true,
  imports: [MatListModule, MatCardModule, LoadingComponent, MatButtonModule],
  templateUrl: './review-treatment.component.html',
  styleUrl: './review-treatment.component.scss'
})
export class ReviewTreatmentComponent extends treatmentsListNotifications {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private token!: string;
  private tokenData!: TokenData;
  private userService = inject(AuthService);
  private professorId!: string;
  public STATUS = STATUS_TREATMENTS;
  public treatments: PaginatedData<TreatmentDetailResponse> | null = null;
  public treatmentData!: TreatmentDetailResponse;

  private idTreatmentDetail!: number;
  private patientClinicalHistoryId!: number;
  private patientUuid!: string;
  private clinicalHistoryCatalogId!: number;

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
        this.connectToTreatmentDetailsList(this.professorId);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message);
      }
    });
  }

  rateTreatment(treatment: TreatmentDetailResponse): void {
    this.idTreatmentDetail = treatment.idTreatmentDetail;
    this.patientClinicalHistoryId = treatment.patient.idPatientMedicalRecord;
    this.patientUuid = treatment.patient.id ?? "";
    this.clinicalHistoryCatalogId = treatment.treatment.clinicalHistoryCatalogId;
    this.router.navigate([
      'clinical-area-supervisor',
      'rate-treatment',
      'treatment-detail',
      this.idTreatmentDetail,
      'patient',
      this.patientUuid,
      'medical-record',
      this.clinicalHistoryCatalogId
    ]);
  }

  protected override onTreatmentsNotification(): void {
    this.fetchTreatments();
  }

}
