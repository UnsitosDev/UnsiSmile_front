import { inject, Injectable } from '@angular/core';
import { VitalSignsFormService } from './vitalSigns.service';
import { facialExamService } from './facialExam.service';
import { ClinicalHistoryCatalog } from 'src/app/models/history-clinic/historyClinic';
import { multidiciplinaryEvaluationService } from './clinicalExamFields.service';
import { patientPostureService } from './patientPostureFields.service';
import { bucalExamService } from './bucalExamFields.service';
import { radiographicAnalisisService } from './radiographicAnalisis.service';
import { modelsAndPhotosService } from './modelsAndPhotos.service';
import { laboratoryStudioBiopsyService } from './laboratoryStudioBiopsy.service';
import { medicalInterconsultationService } from './medicalInterconsultation.service';
import { ApiService } from '../../api.service';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { mapClinicalHistoryToDataTabs } from 'src/app/components/private/students/adapters/clinical-history.adapters'; // Asegúrate de que la ruta sea correcta
import { HistoryData } from 'src/app/models/form-fields/form-field.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralHistoryService {

  private apiService = inject(ApiService);

  historyData: ClinicalHistoryCatalog[] = [];
  mappedHistoryData!: dataTabs; 
  getHistoryClinics(id: number, idpatient: number): Observable<dataTabs> {
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_HISTORY_CONFIG}/${id}/patients/${idpatient}`,
        data: {},
      })
      .pipe(
        map((response: ClinicalHistoryCatalog) => {
          return mapClinicalHistoryToDataTabs(response);
        })
      );
  }



}


