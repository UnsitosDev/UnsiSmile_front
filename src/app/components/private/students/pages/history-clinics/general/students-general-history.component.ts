import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';

// Componentes
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { CardPatientDataComponent } from "../../../components/card-patient-data/card-patient-data.component";
import { HistoryInitialBagComponent } from "../../../components/form-history-initial-bag/history-initial-bag.component";
import { StudentsOdontogramComponent } from '../../../components/odontogram/students-odontogram.component';

// Servicios
import { ApiService, AuthService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';

// Modelos
import { ID_MEDICAL_RECORD, ID_PATIENT_MEDICAL_RECORD, PATIENT_UUID_ROUTE, StatusClinicalHistoryResponse, StudentItems } from '@mean/models';
import { UriConstants } from '@mean/utils';
import { Subscription } from 'rxjs';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { TabFormUpdateComponent } from "../../../../../../shared/components/tab-form-update/tab-form-update.component";
import { DialogConfirmLeaveComponent } from '../../../components/dialog-confirm-leave/dialog-confirm-leave.component';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { ProgressNotesComponent } from "../../../components/progress-notes/progress-notes.component";
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { HttpHeaders } from '@angular/common/http';
import { STATUS } from 'src/app/utils/statusToReview';
import { ROLES } from 'src/app/utils/roles';
import { HeaderHistoryClinicComponent } from "../../../components/header-history-clinic/header-history-clinic.component";
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students-general-history',
  standalone: true,
  templateUrl: './students-general-history.component.html',
  styleUrl: './students-general-history.component.scss',
  imports: [StudentsOdontogramComponent, MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, CardPatientDataComponent, TabViewModule, HistoryInitialBagComponent, TabFormUpdateComponent, ProgressNotesComponent, HeaderHistoryClinicComponent],
})

export class StudentsGeneralHistoryComponent implements OnInit {
  @Input() public patientUuid!: string;
  @Input() public patientMedicalRecord!: number;
  @Input() public medicalRecord!: number;

  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private historyData = inject(GeneralHistoryService);
  private apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  private userService = inject(AuthService);
  public patientData!: cardPatient;
  public patientUuidParam!: string;

  public id!: number;
  public idpatient!: string;
  public currentIndex: number = 0;
  public mappedHistoryData!: dataTabs;
  public role!: string;
  public currentSectionId: number | null = null;
  public currentStatus: string | null = null;
  public idPatientClinicalHistory!: number;

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
      if (this.role === ROLES.STUDENT) {
        this.id = this.medicalRecord;
        this.idpatient = this.patientUuid;
        this.idPatientClinicalHistory = this.patientMedicalRecord;
      } else {
        this.id = params[ID_MEDICAL_RECORD];
        this.idpatient = params[PATIENT_UUID_ROUTE];
        this.idPatientClinicalHistory = params[ID_PATIENT_MEDICAL_RECORD];
      }

      this.patientUuidParam = this.idpatient;
      this.loadClinicalHistory();
    });
  }

  private loadClinicalHistory(): void {
    this.historyData.getHistoryClinics(this.idpatient, this.id).subscribe({
      next: (mappedData: dataTabs) => {
        this.mappedHistoryData = this.processMappedData(mappedData, this.role);
        this.currentSectionId = this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
        this.currentStatus = this.mappedHistoryData.tabs[this.currentIndex].status;
        this.getFirstTab();
        this.getStatusHc();

        const processedData = this.getTabsforReview(this.mappedHistoryData);
        if (processedData) {
          this.mappedHistoryData = processedData;
        } else if (this.role === ROLES.CLINICAL_AREA_SUPERVISOR) {
          return;
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
        url: `${UriConstants.GET_CLINICAL_HISTORY_STATUS}/${this.idPatientClinicalHistory}/${currentTab.idFormSection}`,
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

