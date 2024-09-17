import { inject, Injectable } from '@angular/core';
import { VitalSignsFormService } from './vitalSigns.service';
import { facialExamService } from './facialExam.service';
import { formSectionFields } from 'src/app/models/form-fields/form-field.interface';

export interface HistoryData {
  title: string;
  tabs: formSectionFields[];
}

@Injectable({
  providedIn: 'root'
})
export class GeneralHistoryService {

  private vitalSignsService = inject(VitalSignsFormService);
  private facialExamService = inject(facialExamService);

  constructor() { }

  getHistory(): HistoryData {
    const vitalSignsFields = this.vitalSignsService.getVitalSignsFields();
    const facialExamFields = this.facialExamService.getfacialExamFields();

    return {
      title: 'HISTORIA CLINICA GENERAL',
      tabs: [vitalSignsFields, facialExamFields]
    };
  }
}
