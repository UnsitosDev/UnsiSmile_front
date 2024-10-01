import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '@mean/services';
import { ClinicalHistory, ClinicalHistoryCatalog } from 'src/app/models/history-clinic/historyClinic';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importa MAT_DIALOG_DATA
import { HistoryData } from 'src/app/models/form-fields/form-field.interface';
@Component({
  selector: 'app-dialog-history-clinics',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatDividerModule, DatePipe, MatListModule],
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
    this.getPatientHistories();
  }

  historyClinics: ClinicalHistoryCatalog[] = []

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
    // Verifica si la historia clínica ya está creada para el paciente
    const exists = this.patientHistories.some(
      (pxHistory) =>
        pxHistory.patientId === this.data.patientID && // Verifica si el ID del paciente coincide
        pxHistory.patientClinicalHistoryId === history.idClinicalHistoryCatalog // Verifica si el ID de la historia clínica coincide
    );

    // Si no existe, crea la historia clínica
    if (!exists) {
      this.postClinicalHistory(history);
    }

    this.dialogRef.close();
    const patientID = this.data.patientID;
    // Navegar a la ruta correspondiente según el nombre de la historia clínica
    switch (history.clinicalHistoryName) {
      case 'General':
        this.router.navigate(['/students/historyClinic', history.idClinicalHistoryCatalog, { patientID: patientID }]); // General
        break;
      case 'Prótesis bucal':
        this.router.navigate(['/students/OralSurgery']); // Cirugía bucal
        break;
      case 'Periodoncia':
        this.router.navigate(['/students/periodontics']); // Periodoncia
        break;
      case 'Operatoria dental':
        this.router.navigate(['/students/DentalOperation']); // Operatoria dental
        break;
      case 'Cirugía bucal':
        this.router.navigate(['/students/OralSurgery']); // Cirugía bucal
        break;
    }
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

  patientHistories: ClinicalHistory[] = []
  getPatientHistories() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PATIENT_HISTORIES}?idPatient=${this.data.patientID}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.patientHistories = response;
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
