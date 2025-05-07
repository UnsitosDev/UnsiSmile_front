import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';

// Componentes
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { CardPatientDataComponent } from "../../../components/card-patient-data/card-patient-data.component";

// Servicios
import { ApiService, AuthService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';

// Modelos
import { HttpHeaders } from '@angular/common/http';
import { ID_MEDICAL_RECORD, ID_PATIENT_MEDICAL_RECORD, ID_TREATMENT_DETAIL, PATIENT_UUID_ROUTE } from '@mean/models';
import { UriConstants } from '@mean/utils';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { ROLES } from 'src/app/utils/roles';
import { STATUS } from 'src/app/utils/statusToReview';
import { TabFormUpdateComponent } from "../../../../../../shared/components/tab-form-update/tab-form-update.component";
import { MenuAssessMedicalHistoryComponent } from "../../../../clinical-area-supervisor/components/menu-assess-medical-redord/menu-assess-medical-record.component";
import { HeaderHistoryClinicComponent } from "../../../components/header-history-clinic/header-history-clinic.component";
import { ProfilaxisComponent } from "../../../components/profilaxis/profilaxis.component";
import { DialogRateTreatmentComponent } from 'src/app/components/private/clinical-area-supervisor/components/dialog-rate-treatment/dialog-rate-treatment.component';

@Component({
  selector: 'app-preventive-dentistry-public-health',
  standalone: true,
  imports: [MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, CardPatientDataComponent, TabViewModule, TabFormUpdateComponent, MenuAssessMedicalHistoryComponent, ProfilaxisComponent, HeaderHistoryClinicComponent],
  templateUrl: './preventive-dentistry-public-health.component.html',
  styleUrl: './preventive-dentistry-public-health.component.scss'
})
export class PreventiveDentistryPublicHealthComponent {
  @Input() public patientUuid!: string;
  @Input() public patientMedicalRecord!: number;
  @Input() public medicalRecord!: number;

  // Se recibe desde el componente donde se calificaran tratamientos
  @Input() public patientClinicalHistoryId!: number;
  @Input() public patientUuidTreatment!: string;

  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private historyData = inject(GeneralHistoryService);
  private apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  private userService = inject(AuthService);
  public isSupervisorWithTreatment: boolean = false;

  public id!: number;
  public idpatient!: string;
  public currentIndex: number = 0;
  public mappedHistoryData!: dataTabs;
  public role!: string;
  public currentSectionId: number | null = null;
  public currentStatus: string | null = null;
  public idPatientClinicalHistory!: number;
  private idTreatmentDetail!: number;

  private token!: string;
  private tokenData!: TokenData;

  ROL = ROLES;

  constructor() { }

  ngOnInit(): void {
    this.initializeUserRole();
    this.initializeRouteParams();
  }

  private initializeUserRole(): void {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  private initializeRouteParams(): void {
    this.router.params.subscribe((params) => {
      // Asignación común para todos los casos excepto STUDENT
      if (this.role !== ROLES.STUDENT) {
        this.id = Number(params[ID_MEDICAL_RECORD]) || 0;
        this.idpatient = params[PATIENT_UUID_ROUTE] || '';
        this.idPatientClinicalHistory = Number(params[ID_PATIENT_MEDICAL_RECORD]) || 0;

        // Solo para CLINICAL_AREA_SUPERVISOR con tratamiento
        if (this.role === ROLES.CLINICAL_AREA_SUPERVISOR) {
          this.idTreatmentDetail = params[ID_TREATMENT_DETAIL] || '';
        }
      }
      // Caso específico para STUDENT
      else {
        this.id = this.medicalRecord;
        this.idpatient = this.patientUuid;
        this.idPatientClinicalHistory = this.patientMedicalRecord;
      }

      this.loadClinicalHistory();
    });
  }


  private loadClinicalHistory(): void {
    this.historyData.getHistoryClinics(this.idPatientClinicalHistory, this.idpatient).subscribe({
      next: (mappedData: dataTabs) => {
        this.mappedHistoryData = this.processMappedData(mappedData, this.role);
        this.currentSectionId = this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
        this.currentStatus = this.mappedHistoryData.tabs[this.currentIndex].status;
        this.getFirstTab();
        this.getStatusHc();
        this.isSupervisorWithTreatment = true;
        // Solo procesar tabs si no es supervisor con tratamiento
        if (!(this.role === ROLES.CLINICAL_AREA_SUPERVISOR && this.idTreatmentDetail)) {
          const processedData = this.getTabsforReview(this.mappedHistoryData);
          this.isSupervisorWithTreatment = false;
          if (processedData) {
            this.mappedHistoryData = processedData;
          }
        }
      }
    });
  }

  private getTabsforReview(historyData: dataTabs): dataTabs | null {
    if (this.role !== ROLES.CLINICAL_AREA_SUPERVISOR) {
      return historyData;
    }

    const filteredData = {
      ...historyData,
      tabs: historyData.tabs.filter(tab => tab.status === STATUS.IN_REVIEW)
    };

    if (filteredData.tabs.length === 0) {
      this.route.navigate(['/clinical-area-supervisor/history-clinics']);
      return null;
    }

    return filteredData;
  }

  getFirstTab() {
    if (this.mappedHistoryData.tabs.length > 0) {
      this.currentSectionId = this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
      this.currentStatus = this.mappedHistoryData.tabs[this.currentIndex].status;
    }
  }

  getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  private processMappedData(mappedData: dataTabs, role: string): dataTabs {
    let processedData = { ...mappedData };
    if (role === ROLES.PROFESSOR) {
      processedData.tabs = processedData.tabs.filter(tab => tab.status === STATUS.IN_REVIEW);
    }
    return processedData;
  }

  onTabChange(index: number) {
    this.currentIndex = index;
    this.getStatusHc();
  }

  opedDialogRateTreatment() {
    const dialogRef = this.dialog.open(DialogRateTreatmentComponent, {
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  getStatusHc(forceRequest: boolean = false) {
    const currentTab = this.mappedHistoryData.tabs[this.currentIndex];

    if (!forceRequest && (currentTab.status === STATUS.NOT_REQUIRED || currentTab.status === STATUS.NO_REQUIRED || currentTab.status === STATUS.NO_STATUS)) {
      return;
    }

    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CLINICAL_HISTORY_STATUS}/${this.id}/${currentTab.idFormSection}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          currentTab.status = response.status;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onNextTab(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.mappedHistoryData.tabs.length) {
      this.currentIndex = this.mappedHistoryData.tabs.length - 1;
    }
  }

  onPreviousTab(): void {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
  }
}

