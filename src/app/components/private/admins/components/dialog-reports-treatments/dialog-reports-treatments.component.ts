import {Component, inject} from '@angular/core';
import {ApiService} from "@mean/services";
import {HttpHeaders} from "@angular/common/http";
import {UriConstants} from "@mean/utils";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-reports-treatments',
  standalone: true,
  imports: [],
  templateUrl: './dialog-reports-treatments.component.html',
  styleUrl: './dialog-reports-treatments.component.scss'
})
export class DialogReportsTreatmentsComponent {
  private readonly apiService = inject(ApiService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private idStudent!: string;

  ngOnInit() {
    this.idStudent = this.data.idStudent;
    this.fetchTreatmentStudent();
  }

  public fetchTreatmentStudent() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PATIENTS_FOR_REPORTS}/${this.idStudent}?idTreatment=${2}`,
      data: {},
    }).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
