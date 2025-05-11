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

@Component({
  selector: 'app-review-treatment',
  standalone: true,
  imports: [MatListModule, MatCardModule],
  templateUrl: './review-treatment.component.html',
  styleUrl: './review-treatment.component.scss'
})
export class ReviewTreatmentComponent {
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
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message);
      }
    });
  }

  rateTreatment(treatment: TreatmentDetailResponse): void {
    this.idTreatmentDetail = treatment.idTreatmentDetail;
    this.patientClinicalHistoryId = treatment.patientClinicalHistoryId;
    this.patientUuid = treatment.patientId ?? "";
    this.clinicalHistoryCatalogId = treatment.treatment.clinicalHistoryCatalogId;
    switch (this.clinicalHistoryCatalogId) {
      case 6: // odontologia preventiva
        const routePreventive = `/clinical-area-supervisor/preventive-dentistry-public-health/${this.clinicalHistoryCatalogId}/patient/${this.patientUuid}/medical-record-id/${this.patientClinicalHistoryId}/treatment-detail/${this.idTreatmentDetail}`;
        this.router.navigate([routePreventive]);
        break;
      case 2: // protesis bucal
        const routeOralProthesis = `/clinical-area-supervisor/oral-prosthesis/${this.clinicalHistoryCatalogId}/patient/${this.patientUuid}/medical-record-id/${this.patientClinicalHistoryId}/treatment-detail/${this.idTreatmentDetail}`;
        this.router.navigate([routeOralProthesis]);
        break;
      case 3: // periodoncia
        const routePeriodontics = `/clinical-area-supervisor/periodontics/${this.clinicalHistoryCatalogId}/patient/${this.patientUuid}/medical-record-id/${this.patientClinicalHistoryId}/treatment-detail/${this.idTreatmentDetail}`;
        this.router.navigate([routePeriodontics]);
        break;
      case 4: // operatoria dental
        const routeDentalOperation = `/clinical-area-supervisor/dental-operation/${this.clinicalHistoryCatalogId}/patient/${this.patientUuid}/medical-record-id/${this.patientClinicalHistoryId}/treatment-detail/${this.idTreatmentDetail}`;
        this.router.navigate([routeDentalOperation]);
        break;
      case 5: // cirujia bucal
        const routeOralSurgery = `/clinical-area-supervisor/oral-surgery/${this.clinicalHistoryCatalogId}/patient/${this.patientUuid}/medical-record-id/${this.patientClinicalHistoryId}/treatment-detail/${this.idTreatmentDetail}`;
        this.router.navigate([routeOralSurgery]);
        break;
      default:
        break;
    }
  }
}
