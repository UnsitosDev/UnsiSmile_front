import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService, AuthService } from '@mean/services';
import { MedicalRecord, MedicalRecordCatalog, RelationHistoryPatient } from 'src/app/models/history-clinic/medical-record.models';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importa MAT_DIALOG_DATA
import { HistoryData } from 'src/app/models/form-fields/form-field.interface';
import { ToastrService } from 'ngx-toastr';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { ROLES } from 'src/app/utils/roles';
import { STATUS } from 'src/app/utils/statusToReview';
@Component({
  selector: 'app-dialog-history-clinics',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatDividerModule, MatListModule],
  templateUrl: './dialog-history-clinics.component.html',
  styleUrl: './dialog-history-clinics.component.scss'
})
export class DialogHistoryClinicsComponent implements OnInit {
  idPatientClinicalHistory: number = 0;
  patient: number = 0;
  clinicalHistoryId: number = 0;
  historyName: string = '';
  private apiService = inject(ApiService<MedicalRecordCatalog>);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<DialogHistoryClinicsComponent>);
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);
  private token!: string;
  private tokenData!: TokenData;
  patientConfigMedicalRecord: MedicalRecord[] = [];
  ROL = ROLES;
  STATUS = STATUS;
  role!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public dataRoleAndObject: { objeto: any; role: string }) {
  }
  idClinicalHistoryCatalog!: 0;
  ngOnInit(): void {
    this.getRole();
    this.getHistoriClinicBasedOnRole();
  }

  getHistoriClinicBasedOnRole() {
    switch (this.role) {
      case ROLES.ADMIN:
        this.getConfigHistories();
        break;
      case ROLES.PROFESSOR:
        this.getConfigHistoriesToReview();
        break;
      case ROLES.STUDENT:
        this.getConfigHistories();
        break;
      case ROLES.CLINICAL_AREA_SUPERVISOR:
        this.getConfigHistoriesToReview();
        break;
      default:
        break;
    }
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
          url: `${UriConstants.POST_CLINICAL_HISTORY}?idPatient=${this.dataRoleAndObject.objeto.patientID}&idMedicalRecordCatalog=${idClinicalHistoryCatalog}`,
          data: {},
        })
        .subscribe({
          next: (response) => {
            this.clinicalHistoryCatalogRelation = response;
            const newHistoryId = this.clinicalHistoryCatalogRelation.idPatientMedicalRecord;
            resolve(newHistoryId);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  pushUrl = '';

  selectMedicalRecordStudent(history: MedicalRecord) {
    this.pushUrl = 'students'
    this.dialogRef.close();
    this.getConfigHistories();

    const existingHistory = this.patientConfigMedicalRecord.find(h =>
      h.medicalRecordName === history.medicalRecordName &&
      h.patientMedicalRecordId !== 0
    );

    if (existingHistory) {
      // Usar el ID de la historia clínica existente
      this.idPatientClinicalHistory = existingHistory.patientMedicalRecordId;
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

  selectMedicalRecordAdmin(history: MedicalRecord) {
    this.pushUrl = 'admin'
    this.dialogRef.close();
    this.getConfigHistories();
    const existingHistory = this.patientConfigMedicalRecord.find(h =>
      h.medicalRecordName === history.medicalRecordName &&
      h.patientMedicalRecordId !== 0 
    );

    if (existingHistory) {
      // Usar el ID de la historia clínica existente
      this.idPatientClinicalHistory = existingHistory.patientMedicalRecordId;
      // Navegar a la historia clínica existente
      this.navigateToHistory(history, this.idPatientClinicalHistory);
    } else {
      this.toastr.error("Historia clínica no disponible. Aún no ha sido creada por el alumno.");
    }
  }

  selectMedicalRecordProfessor(history: MedicalRecord) {
    this.pushUrl = 'professor'
    this.dialogRef.close();
    this.getConfigHistoriesToReview();
    const existingHistory = this.patientConfigMedicalRecord.find(h =>
      h.medicalRecordName === history.medicalRecordName &&
      h.patientMedicalRecordId !== 0 
    );

    if (existingHistory) {
      // Usar el ID de la historia clínica existente
      this.idPatientClinicalHistory = existingHistory.patientMedicalRecordId;
      // Navegar a la historia clínica existente
      this.navigateToHistory(history, this.idPatientClinicalHistory);
    } else {
      this.toastr.error("Historia clínica no disponible. Aún no ha sido creada por el alumno.");
    }
  }

  selectMedicalRecordReview(history: MedicalRecord) {
    this.pushUrl = 'clinical-area-supervisor'
    this.dialogRef.close();
    this.getConfigHistoriesToReview();
    const existingHistory = this.patientConfigMedicalRecord.find(h =>
      h.medicalRecordName === history.medicalRecordName &&
      h.patientMedicalRecordId !== 0
    );

    if (existingHistory) {
      // Usar el ID de la historia clínica existente
      this.idPatientClinicalHistory = existingHistory.patientMedicalRecordId;
      // Navegar a la historia clínica existente
      this.navigateToHistory(history, this.idPatientClinicalHistory);
    } else {
      this.toastr.error("Historia clínica no disponible. Aún no ha sido creada por el alumno.");
    }
  }

  navigateToHistory(history: MedicalRecord, patientHistoryId: number) {
    switch (history.medicalRecordName) {
      case 'General':
        this.router.navigate([`/${this.pushUrl}/general`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'medical-record-id', patientHistoryId]);
        break;
      case 'Prótesis bucal':
        this.router.navigate([`/${this.pushUrl}/oral-prosthesis`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'medical-record-id', patientHistoryId]);
        break;
      case 'Periodoncia':
        this.router.navigate([`/${this.pushUrl}/periodontics`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'medical-record-id', patientHistoryId]);
        break;
      case 'Operatoria dental':
        this.router.navigate([`/${this.pushUrl}/dental-operation`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'medical-record-id', patientHistoryId]);
        break;
      case 'Cirugía bucal':
        this.router.navigate([`/${this.pushUrl}/oral-surgery`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'medical-record-id', patientHistoryId]);
        break;
      case 'Odontología preventiva y salud pública':
        this.router.navigate([`/${this.pushUrl}/preventive-dentistry-public-health`, history.id, 'patient', this.dataRoleAndObject.objeto.patientID, 'medical-record-id', patientHistoryId]);
        break;
      default:
        console.error('Historia clínica no válida');
        break;
    }
  }

  getConfigHistories() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_MEDICAL_RECORDS_PATIENT}?idPatient=${this.dataRoleAndObject.objeto.patientID}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.patientConfigMedicalRecord = response;
        },
        error: (error) => {
          console.error('Error al obtener las historias clínicas:', error);
        },
      });
  }

  getConfigHistoriesToReview() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_MEDICAL_RECORDS_PATIENT}?idPatient=${this.dataRoleAndObject.objeto.patientID}&status=${this.STATUS.IN_REVIEW}`,
        data: {},
      })
      .subscribe({
        next: (response: MedicalRecord[]) => {
            this.patientConfigMedicalRecord = response.filter(
              (history) => history.patientMedicalRecordId !== 0 && history.patientId !== null
            );
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

}
