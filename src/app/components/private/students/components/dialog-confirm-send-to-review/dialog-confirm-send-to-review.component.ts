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

interface sendToReview {
  idPatientClinicalHistory: number;
  idFormSection: number
}
@Component({
  selector: 'app-dialog-confirm-send-to-review',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './dialog-confirm-send-to-review.component.html',
  styleUrl: './dialog-confirm-send-to-review.component.scss'
})
export class DialogConfirmSendToReviewComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmSendToReviewComponent>);
  private apiService = inject(ApiService);
  public data = inject(MAT_DIALOG_DATA) as sendToReview;
  public professorAreasData!: PaginatedData<ProfessorClinicalAreaResponse>;

  ngOnInit(): void {
      this.professorAreas();
  }

  professorAreas(){
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PROFESSORS_AREAS}`, 
      data: {},
    }).subscribe({
      next:(response)=>{
        this.professorAreasData = response;
        console.log(this.professorAreasData);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  sendToReview() {
    this.apiService
      .putService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.PUT_CLINICAL_HISTORY_REVIEW}/${this.data.idPatientClinicalHistory}/${this.data.idFormSection}`, 
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.dialogRef.close(false);
        },
      });
  }
}
