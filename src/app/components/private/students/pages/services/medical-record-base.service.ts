import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { dataTabs } from "@mean/models";
import { ApiService } from "@mean/services";
import { ROLES, STATUS } from "@mean/utils";

@Injectable({
  providedIn: 'root'
})
export abstract class MedicalRecordBaseService {
  protected constructor(
    protected apiService: ApiService,
    protected router: Router
  ) {}

  public processMedicalRecordData(mappedData: dataTabs, role: string): dataTabs {
    let processedData = { ...mappedData };
    if (role === ROLES.PROFESSOR) {
      processedData.tabs = processedData.tabs.filter(
        (tab) => tab.status === STATUS.IN_REVIEW
      );
    }
    return processedData;
  }

  protected getTabsForReview(historyData: dataTabs, role: string): dataTabs | null {
    if (role !== ROLES.CLINICAL_AREA_SUPERVISOR) {
      return historyData;
    }

    const filteredData = {
      ...historyData,
      tabs: historyData.tabs.filter(tab => tab.status === STATUS.IN_REVIEW)
    };

    if (filteredData.tabs.length === 0) {
      this.router.navigate(['/clinical-area-supervisor/history-clinics']);
      return null;
    }

    return filteredData;
  }
}