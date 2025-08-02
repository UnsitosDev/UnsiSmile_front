import {HttpHeaders} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {TreatmentDetailResponse} from '@mean/models';
import {ApiService, AuthService} from '@mean/services';
import {StatusService} from 'src/app/services/status.service';
import {ArrayToDatePipe, LoadingComponent} from '@mean/shared';
import {STATUS_TREATMENTS, UriConstants} from '@mean/utils';
import {TokenData} from 'src/app/components/public/login/model/tokenData';
import {PaginatedData} from 'src/app/models/shared/pagination/pagination';
import {DialogNewTreatmentComponent} from '../../../../components/dialog-new-treatment/dialog-new-treatment.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-patients-treatments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatListModule, 
    LoadingComponent, 
    MatButtonModule, 
    MatTooltip, 
    ArrayToDatePipe,
    FontAwesomeModule
  ],
  templateUrl: './patients-treatments.component.html',
  styleUrl: './patients-treatments.component.scss',
})
export class PatientsTreatmentsComponent {
  private apiService = inject(ApiService);
  private userService = inject(AuthService);
  private statusService = inject(StatusService);
  private router = inject(Router);
  public readonly dialog = inject(MatDialog);

  private idStudent!: string;
  private token!: string;
  private tokenData!: TokenData;
  public isLoading = false;
  public isLastPage = false;
  public currentPage = 0;
  public treatments: PaginatedData<TreatmentDetailResponse> | null = null;
  readonly STATUS = STATUS_TREATMENTS;

  // Helper methods for template
  getStatusColor(status: string): string {
    return this.statusService.getStatusColor(status);
  }

  getStatusLabel(status: string): string {
    return this.statusService.getStatusLabel(status);
  }

  getStatusIcon(status: string): any {
    return this.statusService.getStatusIcon(status);
  }

  ngOnInit(): void {
    this.getRole();
    this.fetchTreatments();
  }

  private getRole() {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.idStudent = this.tokenData.uuid;
  }

  public fetchTreatments(
    page: number = 0,
    resetPagination: boolean = false
  ): void {
    if (resetPagination) {
      this.currentPage = 0;
      this.treatments = null;
    }

    this.isLoading = true;

    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_ALL_TREATMENTS}/${this.idStudent}?page=${page}&size=10`,
        data: {},
      })
      .subscribe({
        next: (response: PaginatedData<TreatmentDetailResponse>) => {
          this.handleResponse(response, page);
          this.treatments = response;
        },
        error: (error) => {
          console.error('Error fetching treatments:', error);
          this.isLoading = false;
        },
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

  navigateToTreatmentDetails(treatment: TreatmentDetailResponse): void {
    this.router.navigate([
      'students/treatment-details',
      treatment.idTreatmentDetail,
      'patient',
      treatment.patient.id,
    ]);
  }

  openUpdateTreatmentDialog(treatment: TreatmentDetailResponse): void {
      const dialogRef = this.dialog.open(DialogNewTreatmentComponent, {
        width: '800px',
        data: {
          treatment: treatment,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.fetchTreatments();
        }
      });
    }
}
