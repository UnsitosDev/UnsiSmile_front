// Angular Core
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

// Componentes
import { DialogConfirmLeaveComponent } from '../../../components/dialog-confirm-leave/dialog-confirm-leave.component';
import { HeaderHistoryClinicComponent } from "../../../components/header-history-clinic/header-history-clinic.component";
import { HistoryInitialBagComponent } from "../../../components/form-history-initial-bag/history-initial-bag.component";
import { ProgressNotesComponent } from "../../../components/progress-notes/progress-notes.component";
import { StudentsOdontogramComponent } from '../../../components/odontogram/students-odontogram.component';
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { TabFormUpdateComponent } from "../../../../../../shared/components/tab-form-update/tab-form-update.component";

// Servicios
import { ApiService, AuthService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';
import { ToastrService } from 'ngx-toastr';

// Modelos e Interfaces
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { StudentItems } from '@mean/models';

// Constantes y Utilidades
import { UriConstants } from '@mean/utils';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { STATUS } from 'src/app/utils/statusToReview';
import { ROLES } from 'src/app/utils/roles';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';

@Component({
  selector: 'app-medical-record-general-treatments',
  standalone: true,
  imports: [StudentsOdontogramComponent, MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, HistoryInitialBagComponent, TabFormUpdateComponent, ProgressNotesComponent, HeaderHistoryClinicComponent],
  templateUrl: './medical-record-general-treatments.component.html',
  styleUrl: './medical-record-general-treatments.component.scss'
})
export class MedicalRecordGeneralTreatmentsComponent {
  @Input() idPatient: number = 0;
  @Input() patientUuid: string = '';
  @Input() idHistoryGeneral: number = 0;
  @Input() patientMedicalRecord: number = 0;
  @Output() tabChange = new EventEmitter<{ firstLabel: string; previousLabel: string }>();

  private readonly route = inject(Router);
  private readonly historyData = inject(GeneralHistoryService);
  private readonly apiService = inject(ApiService);
  private readonly userService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly toastr = inject(ToastrService);
  readonly dialog = inject(MatDialog);

  private token: string = '';
  private tokenData!: TokenData;
  private navigationSubscription!: Subscription;
  private navigationTarget: string = '';
  private navigationInProgress: boolean = false;
  private isNavigationPrevented: boolean = true;
  private navigationComplete: boolean = false;
  private readonly additionalRoutes = ['/students/user'];

  public medicalRecordNumber!: number;
  public mappedHistoryData!: dataTabs;
  public role: string = '';
  public currentSectionId: number | null = null;
  public currentStatus: string | null = null;
  public currentIndex: number = 0;
  public patientData!: cardPatient;

  ngOnInit(): void {
    this.loadInitialData();
    this.setupNavigationGuard();
  }

  private loadInitialData(): void {
    this.getRole();

    this.historyData.getHistoryClinics(this.patientUuid, this.idHistoryGeneral)
      .subscribe({
        next: (mappedData: dataTabs) => this.processHistoryResponse(mappedData)
      });
  }

  private processHistoryResponse(mappedData: dataTabs): void {
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
  }

  private setupNavigationGuard(): void {
    const allRoutes = [
      ...StudentItems.map(item => item.routerlink),
      ...this.additionalRoutes
    ];

    this.navigationSubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.navigationInProgress && !this.navigationComplete) {
        this.handleProtectedNavigation(event, allRoutes);
      }
    });
  }

  private handleProtectedNavigation(event: NavigationStart, protectedRoutes: string[]): void {
    if (protectedRoutes.includes(event.url)) {
      this.navigationTarget = event.url;
      this.openDialog('300ms', '200ms', Messages.CONFIRM_LEAVE_HC_GENERAL);
    }
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

  public getFirstTab() {
    if (this.mappedHistoryData.tabs.length > 0) {
      this.currentSectionId = this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
      this.currentStatus = this.mappedHistoryData.tabs[this.currentIndex].status;
    }
  }

  public getRole() {
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

  public openDialog(enterAnimationDuration: string, exitAnimationDuration: string, message: string): void {
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

  public ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  public onTabChange(index: number): void {
    this.currentIndex = index;
    this.currentSectionId = this.mappedHistoryData.tabs[index].idFormSection;
  }

  public getStatusHc(forceRequest: boolean = false) {
    const currentTab = this.mappedHistoryData.tabs[this.currentIndex];

    if (!forceRequest && (currentTab.status === STATUS.NO_STATUS || currentTab.status === STATUS.NO_REQUIRED)) {
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
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public onNextTab(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.mappedHistoryData.tabs.length) {
      this.currentIndex = this.mappedHistoryData.tabs.length - 1;
    }
  }

  public onPreviousTab(): void {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
  }
}
