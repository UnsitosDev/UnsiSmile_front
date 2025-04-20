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

interface sendToReview {
  idPatientClinicalHistory: number;
  idFormSection: number
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
  public professorAreasData!: PaginatedData<ProfessorClinicalAreaResponse>;
  public selectedProfessorId: number | null = null;
  private currentPage = 0;
  private readonly pageSize = 10;
  public isLoading = false;

  ngOnInit(): void {
    this.professorAreas();
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
    this.selectedProfessorId = id;
  }

  sendToReview() {
    if (!this.selectedProfessorId) return;

    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_CLINICAL_HISTORY_REVIEW}/${+this.data.idPatientClinicalHistory}/sections/${+this.data.idFormSection}/professor-clinical-areas/${+this.selectedProfessorId}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          console.log('ok', response);
        },
        error: (error) => {
          this.dialogRef.close(false);
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
