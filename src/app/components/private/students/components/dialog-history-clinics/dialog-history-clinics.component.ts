import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService, AuthService } from '@mean/services';
import { ClinicalHistory, ClinicalHistoryCatalog, RelationHistoryPatient } from 'src/app/models/history-clinic/historyClinic';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importa MAT_DIALOG_DATA
import { HistoryData } from 'src/app/models/form-fields/form-field.interface';
import { ToastrService } from 'ngx-toastr';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
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
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);
  private token!: string;
  private tokenData!: TokenData;
  role!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public dataRoleAndObject: { objeto: any; role: string }) {
  }
  idClinicalHistoryCatalog!: 0;
  ngOnInit(): void {
    this.getConfigHistories();
    this.getRole();
  }

  getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  clinicalHistoryCatalogRelation!: RelationHistoryPatient;
  postClinicalHistory(idClinicalHistoryCatalog: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.apiService
        .postService({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          url: `${UriConstants.POST_CLINICAL_HISTORY}?idPatient=${this.dataRoleAndObject.objeto.patientID}&idClinicalHistory=${idClinicalHistoryCatalog}`,
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

  pushUrl = '';

  selectHistory(history: ClinicalHistory) {
    this.pushUrl = 'students'
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

  selectHistoryAdmin(history: ClinicalHistory) {
    this.pushUrl = 'admin'
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
      this.toastr.error("Historia clínica no disponible. Aún no ha sido creada por el alumno.");
    }
  }

  selectHistoryToReview(history: ClinicalHistory) {
    this.pushUrl = 'professor'
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
      this.toastr.error("Historia clínica no disponible. Aún no ha sido creada por el alumno.");
    }
  }

  navigateToHistory(history: ClinicalHistory, patientHistoryId: number) {
    switch (history.clinicalHistoryName) {
      case 'General':
        this.router.navigate([`/${this.pushUrl}/general`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Prótesis bucal':
        this.router.navigate([`/${this.pushUrl}/oralProsthesis`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Periodoncia':
        this.router.navigate([`/${this.pushUrl}/periodontics`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Operatoria dental':
        this.router.navigate([`/${this.pushUrl}/dentalOperation`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Cirugía bucal':
        this.router.navigate([`/${this.pushUrl}/oralSurgery`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'patientHistoryId', patientHistoryId]);
        break;
      case 'Odontología preventiva y salud pública':
        this.router.navigate([`/${this.pushUrl}/preventiveDentistryPublicHealth`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'patientHistoryId', patientHistoryId]);
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
        url: `${UriConstants.GET_CONFIG_HISTORY_CLINICS}?idPatient=${this.dataRoleAndObject.objeto.patientID}`,
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
