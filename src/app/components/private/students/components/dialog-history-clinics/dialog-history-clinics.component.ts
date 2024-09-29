import {Component, inject, OnInit} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '@mean/services';
import { ClinicalHistoryCatalog, HistoryData } from 'src/app/models/history-clinic/historyClinic';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';


export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-dialog-history-clinics',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatDividerModule, DatePipe, MatListModule],
  templateUrl: './dialog-history-clinics.component.html',
  styleUrl: './dialog-history-clinics.component.scss'
})
export class DialogHistoryClinicsComponent implements OnInit {
  private apiService = inject(ApiService<ClinicalHistoryCatalog>);

  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];

  ngOnInit(): void {
      this.getHistoriClinics();
  }

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
         console.log(response)
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
