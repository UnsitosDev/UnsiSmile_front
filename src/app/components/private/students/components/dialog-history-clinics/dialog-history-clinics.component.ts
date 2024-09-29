import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '@mean/services';
import { ClinicalHistoryCatalog, HistoryData } from 'src/app/models/history-clinic/historyClinic';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importa MAT_DIALOG_DATA

@Component({
  selector: 'app-dialog-history-clinics',
  standalone: true,
  imports: [ MatGridListModule, MatIconModule, MatDividerModule, DatePipe, MatListModule],
  templateUrl: './dialog-history-clinics.component.html',
  styleUrl: './dialog-history-clinics.component.scss'
})
export class DialogHistoryClinicsComponent implements OnInit {
  private apiService = inject(ApiService<ClinicalHistoryCatalog>);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<DialogHistoryClinicsComponent>); 
  private data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.getHistoryClinics();
  }

  historyClinics: ClinicalHistoryCatalog[]=[]

  getHistoryClinics() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_HISTORY_CLINICS}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.historyClinics = response;
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
  selectHistory(history: ClinicalHistoryCatalog) {
    this.postClinicalHistory(history);
  
    // this.router.navigate(['/students/historyClinic', history.idClinicalHistoryCatalog]);
    this.dialogRef.close(); 
  } 

  postClinicalHistory(history: ClinicalHistoryCatalog) {
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_CLINICAL_HISTORY}?idPatient=${this.data.patientID}&idClinicalHistory=${history.idClinicalHistoryCatalog}`, 
        data: {}, 
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
