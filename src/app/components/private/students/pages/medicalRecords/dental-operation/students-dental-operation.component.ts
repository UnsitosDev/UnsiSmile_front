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

// Servicios
import { ApiService, AuthService } from '@mean/services';
import { GeneralMedicalRecordService } from 'src/app/services/history-clinics/general/medical-records.service';

// Modelos
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { DialogRateTreatmentComponent } from 'src/app/components/private/clinical-area-supervisor/components/dialog-rate-treatment/dialog-rate-treatment.component';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { EMedicalRecords } from 'src/app/models/history-clinic/historyClinic';
import { ROLES } from 'src/app/utils/roles';
import { STATUS } from 'src/app/utils/statusToReview';
import { TabFormUpdateComponent } from '../../../../../../shared/components/tab-form-update/tab-form-update.component';
import { HeaderHistoryClinicComponent } from '../../../components/header-history-clinic/header-history-clinic.component';

@Component({
  selector: 'app-students-dental-operation',
  standalone: true,
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
    TabFormUpdateComponent,
    HeaderHistoryClinicComponent,
  ],
  templateUrl: './students-dental-operation.component.html',
  styleUrl: './students-dental-operation.component.scss',
})
export class StudentsDentalOperationComponent {
  @Input() public patientUuid!: string;

  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private historyData = inject(GeneralMedicalRecordService);
  private apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  private userService = inject(AuthService);

  public patientMedicalRecord!: number;
  public currentIndex: number = 0;
  public mappedHistoryData!: dataTabs;
  public role!: string;
  public currentSectionId!: string;
  public currentStatus: string | null = null;
  public patientUuidParam!: string;
  private idTreatmentDetail!: number;
  public viewCardTreatments: boolean = false;

  private token!: string;
  private tokenData!: TokenData;

  ROL = ROLES;

  constructor() {}

  ngOnInit(): void {
    this.initializeUserRole();
    
  }

  private initializeUserRole(): void {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  private getMedicalRecord(): void {
    this.historyData
      .getMedicalRecord(EMedicalRecords.OPERATORIA_DENTAL, this.patientUuid)
      .subscribe({
        next: (mappedData: dataTabs) => {
          this.mappedHistoryData = this.processMappedData(
            mappedData,
            this.role
          );
          this.currentSectionId =
            this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
          this.currentStatus =
            this.mappedHistoryData.tabs[this.currentIndex].status;
          this.getFirstTab();
          this.getStatusHc();
          this.patientMedicalRecord = mappedData.idPatientMedicalRecord;
          // Solo procesar tabs si no es supervisor con tratamiento
          if (
            !(
              this.role === ROLES.CLINICAL_AREA_SUPERVISOR &&
              this.idTreatmentDetail
            )
          ) {
          }
        },
      });
  }

  getFirstTab() {
    if (this.mappedHistoryData.tabs.length > 0) {
      this.currentSectionId =
        this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
      this.currentStatus =
        this.mappedHistoryData.tabs[this.currentIndex].status;
    }
  }

  getRole() {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  private processMappedData(mappedData: dataTabs, role: string): dataTabs {
    let processedData = { ...mappedData };
    if (role === ROLES.PROFESSOR) {
      processedData.tabs = processedData.tabs.filter(
        (tab) => tab.status === STATUS.IN_REVIEW
      );
    }
    return processedData;
  }

  onTabChange() {
    this.currentSectionId =
      this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
    this.getStatusHc();
  }

  opedDialogRateTreatment() {
    const dialogRef = this.dialog.open(DialogRateTreatmentComponent, {
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getStatusHc(forceRequest: boolean = false) {
    const currentTab = this.mappedHistoryData.tabs[this.currentIndex];

    if (
      !forceRequest &&
      (currentTab.status === STATUS.NOT_REQUIRED ||
        currentTab.status === STATUS.NO_REQUIRED ||
        currentTab.status === STATUS.NO_STATUS)
    ) {
      return;
    }

    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CLINICAL_HISTORY_STATUS}/${this.patientMedicalRecord}/${currentTab.idFormSection}`,
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
