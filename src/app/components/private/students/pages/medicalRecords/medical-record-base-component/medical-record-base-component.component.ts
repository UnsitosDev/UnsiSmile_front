import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataTabs, EMedicalRecords } from '@mean/models';
import { AuthService } from '@mean/services';
import { ROLES } from '@mean/utils';
import { GeneralMedicalRecordService } from 'src/app/services/history-clinics/general/medical-records.service';
import { MedicalRecordBaseService } from '../../services/medical-record-base.service';

@Component({
  selector: 'app-medical-record-base-component',
  templateUrl: './medical-record-base-component.component.html',
  styleUrls: ['./medical-record-base-component.component.scss'],
})
export abstract class MedicalRecordBaseComponent implements OnInit, OnDestroy {
  @Input() patientUuid!: string;
  @Input() public readonlyTreatment: boolean = false;

  protected historyService = inject(GeneralMedicalRecordService);
  protected userService = inject(AuthService);
  protected router = inject(Router);
  private medicalRecordBaseService = inject(MedicalRecordBaseService);
  public isLoading: boolean = true;
  public ROLE = ROLES;

  currentIndex: number = 0;
  mappedHistoryData!: dataTabs;
  role!: string;
  currentSectionId!: string;
  currentStatus: string | null = null;
  patientMedicalRecord!: number;

  ngOnInit(): void {
    this.initializeUserRole();
    this.loadMedicalRecord();
  }

  ngOnDestroy(): void {}

  protected abstract getMedicalRecordType(): EMedicalRecords;

  protected initializeUserRole(): void {
    const token = this.userService.getToken() ?? '';
    const tokenData = this.userService.getTokenDataUser(token);
    this.role = tokenData.role[0].authority;
  }

  protected loadMedicalRecord(): void {
    this.historyService
      .getMedicalRecord(this.getMedicalRecordType(), this.patientUuid)
      .subscribe({
        next: (mappedData: dataTabs) =>
          this.handleMedicalRecordResponse(mappedData),
        complete: () => {
          this.isLoading = false;
          this.updateCurrentSection();
        },
        error: (error) => console.error('Error loading medical record:', error),
      });
  }

  private handleMedicalRecordResponse(mappedData: dataTabs): void {
    this.mappedHistoryData =
      this.medicalRecordBaseService.processMedicalRecordData(
        mappedData,
        this.role
      );
    this.updateCurrentSection();
    this.patientMedicalRecord = mappedData.idPatientMedicalRecord;
  }

  protected updateCurrentSection(): void {
    if (this.mappedHistoryData?.tabs?.length > 0) {
      this.currentSectionId =
        this.mappedHistoryData.tabs[this.currentIndex].idFormSection;
      this.currentStatus =
        this.mappedHistoryData.tabs[this.currentIndex].status;
    }
  }

  onNextTab(): void {
    if (this.currentIndex < this.mappedHistoryData.tabs.length - 1) {
      this.currentIndex++;
      this.updateCurrentSection();
    }
  }

  onPreviousTab(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCurrentSection();
    }
  }
}
