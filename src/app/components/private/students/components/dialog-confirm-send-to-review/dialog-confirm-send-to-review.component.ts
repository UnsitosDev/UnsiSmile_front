import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TreatmentDetailResponse } from '@mean/models';
import { ApiService } from '@mean/services';
import { STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { ProfessorClinicalAreaResponse } from 'src/app/models/clinical-areas/clinical.areas.model';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { LoadingComponent } from "../../../../../models/shared/loading/loading.component";

interface sendToReview {
  idPatientMedicalRecord: number;
  idFormSection: string,
  send?: boolean;
  treatmentId?: number;
  treatment?: TreatmentDetailResponse;
}

@Component({
  selector: 'app-dialog-confirm-send-to-review',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatListModule, MatIconModule, LoadingComponent, MatCardModule, MatSelectModule, MatFormFieldModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
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
  public  selectedTeeth: string[] = [];
  private currentPage = 0;
  private readonly pageSize = 10;
  public isLoading = false;
  public STATUS = STATUS_TREATMENTS;

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

  sendToReviewTreatment() {

    if (this.data.send && this.data.treatment?.teeth && this.selectedTeeth.length === 0) {
      this.toastr.warning('Debe seleccionar al menos un diente para enviar a revisión.');
      return;
    }
    
    if (!this.professorClinicalAreaId) return;
    this.apiService
      .patchService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_TREATMENT_REVIEW}/${this.data.treatmentId}/revision?professorClinicalAreaId=${this.professorClinicalAreaId}`,
        data: {
          idTreatmentDetail: this.data.treatmentId,
          idTeeth: this.selectedTeeth,
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
    const patientMedicalRecordId = Number(this.data.idPatientMedicalRecord);
    // formSectionId is a string, so do not convert it.
    const formSectionId = this.data.idFormSection;
    const clinicalAreaId = Number(this.professorClinicalAreaId);

    if (isNaN(patientMedicalRecordId) || !formSectionId || isNaN(clinicalAreaId)) {
      console.error('Invalid parameters:', {
        patientMedicalRecordId,
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
        url: `${UriConstants.POST_CLINICAL_HISTORY_REVIEW}/${patientMedicalRecordId}/sections/${formSectionId}/review/${clinicalAreaId}`,
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
