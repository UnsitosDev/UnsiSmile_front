import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '@mean/services';
import { ClinicalHistory, ClinicalHistoryCatalog, RelationHistoryPatient } from 'src/app/models/history-clinic/historyClinic';
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
  idPatientClinicalHistory: number = 0;
  patient: number = 0;
  clinicalHistoryId: number = 0;
  historyName: string = '';
  private apiService = inject(ApiService<ClinicalHistoryCatalog>);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<DialogHistoryClinicsComponent>);
  private data = inject(MAT_DIALOG_DATA);
  idClinicalHistoryCatalog!: 0;
  ngOnInit(): void {
    this.getConfigHistories();
  }

  clinicalHistoryCatalogRelation!: RelationHistoryPatient;
  postClinicalHistory(idClinicalHistoryCatalog: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_CLINICAL_HISTORY}?idPatient=${this.data.patientID}&idClinicalHistory=${idClinicalHistoryCatalog}`,
          data: {},
        })
        .subscribe({
          next: (response) => {
            this.clinicalHistoryCatalogRelation = response;
            const newHistoryId = this.clinicalHistoryCatalogRelation.idPatientClinicalHistory;
            resolve(newHistoryId);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  selectHistory(history: ClinicalHistory) {
    this.dialogRef.close();
    this.getConfigHistories();
  
    const existingHistory = this.patientConfigHistories.find(h =>
      h.clinicalHistoryName === history.clinicalHistoryName &&
      h.patientClinicalHistoryId !== 0 &&
      h.patientId !== 0
    );
  
    if (existingHistory) {
      // Usar el ID de la historia clínica existente
      this.idPatientClinicalHistory = existingHistory.patientClinicalHistoryId; 
      // Navegar a la historia clínica existente
      this.navigateToHistory(history, this.idPatientClinicalHistory);
    } else {
      // Crear una nueva historia clínica si no hay una existente
      this.postClinicalHistory(history.id).then((newHistoryId) => {
        this.idPatientClinicalHistory = newHistoryId; 
        // Navegar a la historia clínica recién creada
        this.navigateToHistory(history, this.idPatientClinicalHistory);
      }).catch((error) => {
        console.error('Error al crear la nueva historia clínica:', error);
      });
    }
  }

  navigateToHistory(history: ClinicalHistory, patientHistoryId: number) {
    switch (history.clinicalHistoryName) {
      case 'General':
        this.router.navigate(['/students/general', history.id, 'patient', this.data.patientID ,'patientHistoryId', patientHistoryId]);
        break;
      case 'Prótesis bucal':
        this.router.navigate(['/students/oralProsthesis', history.id, 'patient', this.data.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Periodoncia':
        this.router.navigate(['/students/periodontics', history.id, 'patient', this.data.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Operatoria dental':
        this.router.navigate(['/students/dentalOperation', history.id, 'patient', this.data.patientID,  'patientHistoryId', patientHistoryId]);
        break;
      case 'Cirugía bucal':
        this.router.navigate(['/students/oralSurgery', history.id, 'patient', this.data.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Odontología preventiva y salud pública':
        this.router.navigate(['/students/preventiveDentistryPublicHealth', history.id, 'patient', this.data.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      default:
        console.error('Historia clínica no válida');
        break;
    }
  }

  patientConfigHistories: ClinicalHistory[] = [];
  getConfigHistories() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CONFIG_HISTORY_CLINICS}?idPatient=${this.data.patientID}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.patientConfigHistories = response;
        },
        error: (error) => {
          console.error('Error al obtener las historias clínicas:', error);
        },
      });
  }


}
