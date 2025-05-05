import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { AllTreatmentDetailResponse } from '@mean/models';
import { ApiService, AuthService } from '@mean/services';
import { STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';

@Component({
  selector: 'app-patients-treatments',
  standalone: true,
  imports: [MatCardModule, MatListModule],
  templateUrl: './patients-treatments.component.html',
  styleUrl: './patients-treatments.component.scss'
})
export class PatientsTreatmentsComponent {
  private apiService = inject(ApiService);
  private userService = inject(AuthService);
  public router = inject(Router);

  private idStudent!: string;
  private token!: string;
  private tokenData!: TokenData;
  
  private medicalRecordId!: number;

  public patientUuid = '670ef320-ec8d-4eca-85e3-950661005d41';
  public treatments: PaginatedData<AllTreatmentDetailResponse> | null = null;
  STATUS = STATUS_TREATMENTS;

  ngOnInit(): void {
    this.getRole();
    this.fetchTreatments();
  }

  private getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.idStudent = this.tokenData.uuid;
    console.log('ID Student:', this.idStudent);
  }

  private fetchTreatments(): void {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_ALL_TREATMENTS}/${this.idStudent}`,
      data: {},
    })
      .subscribe({
        next: (response: PaginatedData<AllTreatmentDetailResponse>) => {
          this.treatments = response;
          console.log('Tratamientos:', response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openTreatment(treatment: AllTreatmentDetailResponse): void {
    const route = '/students/treatments/patient/' + this.patientUuid;
    this.router.navigate([route]);
  }
}
