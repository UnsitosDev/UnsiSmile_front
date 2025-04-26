import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationStart, Router } from '@angular/router';
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
import { StudentItems } from '@mean/models';
import { UriConstants, Constants } from '@mean/utils';
import { Subscription } from 'rxjs';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { cardGuardian, cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { Patient } from 'src/app/models/shared/patients/patient/patient';
import { TabFormUpdateComponent } from "../../../../../../shared/components/tab-form-update/tab-form-update.component";
import { DialogConfirmLeaveComponent } from '../../../components/dialog-confirm-leave/dialog-confirm-leave.component';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { ProgressNotesComponent } from "../../../components/progress-notes/progress-notes.component";
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { HttpHeaders } from '@angular/common/http';
import { STATUS } from 'src/app/utils/statusToReview';
import { ROLES } from 'src/app/utils/roles';
import { HeaderHistoryClinicComponent } from "../../../components/header-history-clinic/header-history-clinic.component";

@Component({
  selector: 'app-medical-record-general-treatments',
  standalone: true,
  imports: [StudentsOdontogramComponent, MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, CardPatientDataComponent, TabViewModule, HistoryInitialBagComponent, TabFormUpdateComponent, ProgressNotesComponent, HeaderHistoryClinicComponent],
  templateUrl: './medical-record-general-treatments.component.html',
  styleUrl: './medical-record-general-treatments.component.scss'
})
export class MedicalRecordGeneralTreatmentsComponent {
  @Input() idPatient: number = 0;
  @Input() medicalRecord!: dataTabs;
  @Output() tabChange = new EventEmitter<{ firstLabel: string, previousLabel: string }>();
  private route = inject(Router);
  private historyData = inject(GeneralHistoryService);
  private apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  public patientData!: cardPatient;
  private token!: string;
  private tokenData!: TokenData;
  public medicalRecordNumber!: number;
  public id!: number;
  public idpatient!: string;
  public nextpage: boolean = true;
  public mappedHistoryData!: dataTabs;
  public idPatientClinicalHistory!: number;
  private navigationSubscription!: Subscription;
  private navigationTarget: string = '';
  private navigationInProgress: boolean = false;
  private isNavigationPrevented: boolean = true;
  private navigationComplete: boolean = false;
  private additionalRoutes = ['/students/user'];
  public role!: string;
  public currentSectionId: number | null = null;
  public currentStatus: string | null = null;
  currentIndex = 0;

  ngOnInit(): void {
    console.log('hc', this.medicalRecord);

    this.getRole();

    this.historyData.getHistoryClinics(this.idpatient, this.id).subscribe({
      next: (mappedData: dataTabs) => {
        this.mappedHistoryData = this.processMappedData(mappedData, this.role);
        this.medicalRecordNumber = this.mappedHistoryData.medicalRecordNumber;
        this.getFirstTab();
        this.getStatusHc();
        const processedData = this.getTabsforReview(this.mappedHistoryData);
        if (processedData) {
          this.mappedHistoryData = processedData;
        } else if (this.role === ROLES.CLINICAL_AREA_SUPERVISOR) {
          return;
        }
        console.log('Mapped Data:', this.mappedHistoryData);
      }
    });

    const allRoutes = [
      ...StudentItems.map(item => item.routerlink),
      ...this.additionalRoutes
    ];

    this.navigationSubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.navigationInProgress && !this.navigationComplete) {
        const targetUrl = event.url;

        if (allRoutes.includes(targetUrl)) {
          this.navigationTarget = targetUrl;
          this.openDialog('300ms', '200ms', Messages.CONFIRM_LEAVE_HC_GENERAL);
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, message: string): void {
    if (this.isNavigationPrevented) {
      this.route.navigateByUrl(this.route.url);
    }

    const dialogRef = this.dialog.open(DialogConfirmLeaveComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { message }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.navigationInProgress = false;
      if (result) {
        this.isNavigationPrevented = false;
        this.navigationComplete = true;
        setTimeout(() => {
          this.route.navigateByUrl(this.navigationTarget);
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  onTabChange(index: number): void {
    this.currentIndex = index;
    this.currentSectionId = this.mappedHistoryData.tabs[index].idFormSection;
  }

  getStatusHc(forceRequest: boolean = false) {
    const currentTab = this.mappedHistoryData.tabs[this.currentIndex];

    if (!forceRequest && (currentTab.status === 'NO_STATUS' || currentTab.status === 'NO_REQUIRED')) {
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
          this.cdr.detectChanges();
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
