import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ProfessorClinicalAreaResponse } from 'src/app/models/clinical-areas/clinical.areas.model';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { LoadingComponent } from "../../../../../models/shared/loading/loading.component";
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';

interface sendToReview {
  idPatientClinicalHistory: number;
  idFormSection: string,
  send?: boolean;
  treatmentId?: number;
}
@Component({
  selector: 'app-dialog-confirm-send-to-review',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatListModule, MatIconModule, LoadingComponent, MatCardModule],
  templateUrl: './dialog-confirm-send-to-review.component.html',
  styleUrl: './dialog-confirm-send-to-review.component.scss'
})
export class DialogConfirmSendToReviewComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmSendToReviewComponent>);
  private apiService = inject(ApiService);
  public data = inject(MAT_DIALOG_DATA) as sendToReview;
  public toastr = inject(ToastrService);
  public professorAreasData!: PaginatedData<ProfessorClinicalAreaResponse>;
  public professorClinicalAreaId: number = 0; 
  private currentPage = 0;
  private readonly pageSize = 10;
  public isLoading = false;

  ngOnInit(): void {
    this.professorAreas();
  }

  checkSendToReview() {
    this.data.send ? this.sendToReviewTreatment() : this.sendToReview();
  }

  professorAreas(loadMore: boolean = false) {
    if (this.isLoading) return;

    this.isLoading = true;

    if (!loadMore) {
      this.currentPage = 0;
    } else {
      this.currentPage++;
    }

    const params = {
      page: this.currentPage.toString(),
      size: this.pageSize.toString()
    };

    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PROFESSORS_AREAS}`,
      params: params,
      data: {},
    }).subscribe({
      next: (response) => {
        if (loadMore) {
          this.professorAreasData.content = [
            ...this.professorAreasData.content,
            ...response.content
          ];
          this.professorAreasData.pageable = response.pageable;
          this.professorAreasData.last = response.last;
        } else {
          this.professorAreasData = response;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  selectProfessor(id: number) {
    this.professorClinicalAreaId = id;
  }

  sendToReviewTreatment(){
    if (!this.professorClinicalAreaId) return;
    this.apiService
      .patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_TREATMENT_REVIEW}/${this.data.treatmentId}/revision`,
        data: {
          professorClinicalAreaId: this.professorClinicalAreaId,
          comments: '',
        },
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Tratamiento enviado a revisión');
          this.dialogRef.close(true);
        }
        , error: (error) => {
          this.dialogRef.close(false);
          this.toastr.error(error);
        }
      });
  }

  sendToReview() {
    if (!this.professorClinicalAreaId) return;

    // Convert and validate parameters
    const patientClinicalHistoryId = Number(this.data.idPatientClinicalHistory);
    // formSectionId is a string, so do not convert it.
    const formSectionId = this.data.idFormSection;
    const clinicalAreaId = Number(this.professorClinicalAreaId);

    if (isNaN(patientClinicalHistoryId) || !formSectionId || isNaN(clinicalAreaId)) {
      console.error('Invalid parameters:', {
        patientClinicalHistoryId,
        formSectionId,
        clinicalAreaId,
      });
      this.toastr.error('Datos inválidos para enviar a revisión.');
      return;
    }

    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_CLINICAL_HISTORY_REVIEW}/${patientClinicalHistoryId}/sections/${formSectionId}/review/${clinicalAreaId}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Enviado a revisión');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.dialogRef.close(false);
          this.toastr.error(error);
        },
      });
  }

  onScroll() {
    if (this.professorAreasData && !this.professorAreasData.last && !this.isLoading) {
      this.professorAreas(true);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
