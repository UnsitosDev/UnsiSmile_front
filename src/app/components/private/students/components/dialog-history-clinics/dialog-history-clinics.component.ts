import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '@mean/services';
import { ClinicalHistoryCatalog, HistoryData } from 'src/app/models/history-clinic/historyClinic';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
@Component({
  selector: 'app-dialog-history-clinics',
  standalone: true,
  imports: [ MatGridListModule, MatIconModule, MatDividerModule, DatePipe, MatListModule],
  templateUrl: './dialog-history-clinics.component.html',
  styleUrl: './dialog-history-clinics.component.scss'
})
export class DialogHistoryClinicsComponent implements OnInit {
  private apiService = inject(ApiService<ClinicalHistoryCatalog>);

  ngOnInit(): void {
    this.getHistoriClinics();
  }

  historyClinics: ClinicalHistoryCatalog[]=[]
  
  getHistoriClinics() {
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
          console.log(this.historyClinics)
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
