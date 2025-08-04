import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';

import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { HistoryInitialBagComponent } from '../../../components/form-history-initial-bag/history-initial-bag.component';

import { ApiService, AuthService } from '@mean/services';

// Modelos
import { HttpHeaders } from '@angular/common/http';
import { dataTabs } from '@mean/models';
import { TokenData } from '@mean/public';
import { ROLES, UriConstants } from '@mean/utils';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { TabFormUpdateComponent } from '../../../../../../shared/components/tab-form-update/tab-form-update.component';
import { mapMedicalRecordToDataTabs } from '../../../adapters/medical-record.adapter';
import { HeaderHistoryClinicComponent } from '../../../components/header-history-clinic/header-history-clinic.component';
import { ProgressNotesComponent } from '../../../components/progress-notes/progress-notes.component';

@Component({
  selector: 'app-students-general-history',
  standalone: true,
  templateUrl: './students-general-history.component.html',
  styleUrl: './students-general-history.component.scss',
  imports: [
    MatInputModule,
    TabFormComponent,
    MatTabsModule,
    MatDialogModule,
    MatTabsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    TabViewModule,
    HistoryInitialBagComponent,
    TabFormUpdateComponent,
    ProgressNotesComponent,
    HeaderHistoryClinicComponent,
  ],
})
export class StudentsGeneralHistoryComponent implements OnInit {
  @Input() public patientUuid!: string; // PatientUuid
  public medicalRecordData!: dataTabs; // Configuracion de la historia clinica

  private readonly route = inject(Router); // Servicio de routing de Angular
  private readonly apiService = inject(ApiService); // Servicio para estado de historias clínica
  private readonly userService = inject(AuthService); // Servicio de autenticación y roles

  public patientData!: cardPatient; // Información completa del paciente
  public patientMedicalRecord!: number; // patientMedicalRecord para enviar a componente tabform
  public medicalRecordId!: number; // medicalRecordId para enviar a notas de evolución

  public currentIndex: number = 0; // State tabs
  public currentSectionId!: string;
  public currentStatus: string | null = null;

  public role!: string; // Auth
  private token!: string;
  private tokenData!: TokenData;

  ROL = ROLES; // Roles de usuario disponibles

  constructor() {}

  ngOnInit(): void {
    this.initializeUserRole();
    this.fetchMedicalRecordConfig();
  }

  // Obtiene configuración de HC General usando patientUuid
  public fetchMedicalRecordConfig() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_GENERAL_MEDICAL_RECORD}?idPatient=${this.patientUuid}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.medicalRecordData = mapMedicalRecordToDataTabs(response);
          this.patientMedicalRecord =
          this.medicalRecordData.idPatientMedicalRecord;
          this.medicalRecordId =
          this.medicalRecordData.idMedicalRecordCatalog;
          this.onTabChange(0);
        },
        error: (errorResponse) => {
          if (errorResponse.status === 404) {
            this.createMedicalRecord();
          } else {
            console.error('Error:', errorResponse);
          }
        },
      });
  }

  // Crea HC General de un paciente
  createMedicalRecord(): void {
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_GENERAL_MEDICAL_RECORD}?idPatient=${this.patientUuid}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.fetchMedicalRecordConfig();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private initializeUserRole(): void {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  private getTabsforReview(historyData: dataTabs): dataTabs | null {
    if (this.role !== ROLES.CLINICAL_AREA_SUPERVISOR) {
      return historyData;
    }

    const filteredData = {
      ...historyData
    };

    if (filteredData.tabs.length === 0) {
      this.route.navigate(['/clinical-area-supervisor/history-clinics']);
      return null;
    }

    return filteredData;
  }

  getFirstTab() {
    if (this.medicalRecordData.tabs.length > 0) {
      this.currentSectionId =
        this.medicalRecordData.tabs[this.currentIndex].idFormSection;
    }
  }

  getRole() {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  onTabChange(index: number): void {
    this.currentIndex = index;
    if (this.medicalRecordData?.tabs?.length > index) {
      this.currentSectionId = this.medicalRecordData.tabs[index].idFormSection;
    }
  }

  onNextTab(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.medicalRecordData.tabs.length) {
      this.currentIndex = this.medicalRecordData.tabs.length - 1;
    }
  }

  onPreviousTab(): void {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
  }
}
