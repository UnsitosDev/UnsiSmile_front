import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Tooth, TreatmentDetailResponse } from '@mean/models';
import { ApiService, AuthService } from '@mean/services';
import { ArrayToDatePipe, LoadingComponent } from "@mean/shared";
import { STATUS, STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { treatmentsListNotifications } from '../components/treatments-list-notifications.component';
import { DialogAuthorizationTreatmentComponent } from '../../dialog-authorization-treatment/dialog-authorization-treatment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-review-treatment',
  standalone: true,
  imports: [MatListModule, MatCardModule, LoadingComponent, MatButtonModule, ArrayToDatePipe, MatSelectModule, ReactiveFormsModule],
  templateUrl: './review-treatment.component.html',
  styleUrl: './review-treatment.component.scss'
})
export class ReviewTreatmentComponent extends treatmentsListNotifications {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly dialog = inject(MatDialog);

  private token!: string;
  private tokenData!: TokenData;
  private userService = inject(AuthService);
  private professorId!: string;
  public STATUS = STATUS_TREATMENTS;
  public treatments: PaginatedData<TreatmentDetailResponse> | null = null;
  public treatmentData!: TreatmentDetailResponse;
  public statusControl = new FormControl(STATUS.IN_REVIEW);

  private idTreatmentDetail!: number;
  private patientClinicalHistoryId!: number;
  private patientUuid!: string;
  private clinicalHistoryCatalogId!: number;

  public currentPage: number = 0;
  public isLastPage: boolean = false;
  public isLoading: boolean = false;
  public readonly STATUS_APPROVED = STATUS_TREATMENTS.APPROVED;
  ngOnInit() {
    this.getRole();
    this.fetchTreatments();
  }

  private getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.professorId = this.tokenData.sub;
  }

  fetchTreatments(
    page: number = 0,
    resetPagination: boolean = false
  ): void {
    if (resetPagination) {
      this.currentPage = 0;
      this.treatments = null;
      this.isLastPage = false;
    }

    this.isLoading = true;

    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_TREATMENT_REVIEW}/${this.professorId}?reviewStatus=${this.statusControl.value}&page=${page}&size=10`,
      data: {},
    }).subscribe({
      next: (response: PaginatedData<TreatmentDetailResponse>) => {
        this.handleResponse(response, page);
        this.connectToTreatmentDetailsList(this.professorId);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message);
        this.isLoading = false;
      }
    });
  }

  private handleResponse(
    response: PaginatedData<TreatmentDetailResponse>,
    page: number
  ): void {
    if (!this.treatments || page === 0) {
      this.treatments = response;
    } else {
      this.treatments.content = [
        ...this.treatments.content,
        ...response.content,
      ];
      this.treatments.pageable = response.pageable;
      this.treatments.last = response.last;
      this.treatments.totalPages = response.totalPages;
    }

    this.isLastPage = response.last;
    this.currentPage = page;
    this.isLoading = false;
  }

  public loadMoreTreatments(): void {
    if (!this.isLoading && !this.isLastPage) {
      this.fetchTreatments(this.currentPage + 1);
    }
  }

  public opedDialogAuthorizationTreatment(idTreatmentDetail: number) {
    const dialogRef = this.dialog.open(DialogAuthorizationTreatmentComponent, {
      data: {
        idTreatmentDetail: idTreatmentDetail,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTreatments(0, true);
      }
    });
  }

  public approvedTreatment(idTreatmentDetail: number) {
    this.apiService.patchService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.PATCH_AUTHORIZATION_TREATMENT}/${idTreatmentDetail}/status`, 
      data: {
        status: STATUS_TREATMENTS.APPROVED,
        comments: '',
      },
    }).subscribe({
      next: (response) => {
        this.toastr.success('Tratamiento aprovado');
        this.fetchTreatments();
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
    this.clinicalHistoryCatalogId = treatment.treatment.medicalRecordCatalogId;
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
