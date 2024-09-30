import { inject, Injectable } from '@angular/core';
import { VitalSignsFormService } from './vitalSigns.service';
import { facialExamService } from './facialExam.service';
import { HistoryData } from 'src/app/models/history-clinic/historyClinic';
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

@Injectable({
  providedIn: 'root'
})
export class GeneralHistoryService {

  private vitalSignsService = inject(VitalSignsFormService);
  private facialExamService = inject(facialExamService);
  private clicalExamService = inject(multidiciplinaryEvaluationService);
  private patientPostureService = inject(patientPostureService);
  private bucalExamService = inject(bucalExamService);
  private radiographicAnalisisService = inject(radiographicAnalisisService);
  private modelsAndPhotosFieldsService = inject(modelsAndPhotosService);
  private laboratoryStudioBiopsyService = inject(laboratoryStudioBiopsyService);
  private medicalInterconsultationService = inject(medicalInterconsultationService);
  private apiService = inject(ApiService);

  constructor() { }

  getHistory(): HistoryData {
    const vitalSignsFields = this.vitalSignsService.getVitalSignsFields();
    const facialExamFields = this.facialExamService.getfacialExamFields();
    const clinicalExam = this.clicalExamService.getClinicalExamFields();
    const patientPosture = this.patientPostureService.getPatientPosture();
    const bucalExam = this.bucalExamService.getOralExamFields();
    const radiographicAnalisis = this.radiographicAnalisisService.getRadiographicAnalisisFields();
    const modelsAndPhotos = this.modelsAndPhotosFieldsService.getModelsAndPhotosFields();
    const laboratoryStudioBiopsy = this.laboratoryStudioBiopsyService.getLaboratoryStudioBiopsyFields();
    const seccionMedicalInterconsultation = this.medicalInterconsultationService.getMedicalInterconsultationFields();

    return {
      title: 'HISTORIA CLINICA GENERAL',
      tabs: [vitalSignsFields, facialExamFields, clinicalExam, patientPosture, bucalExam, radiographicAnalisis, modelsAndPhotos, laboratoryStudioBiopsy, seccionMedicalInterconsultation]
    };
  }


  getHistoryClinics(id: number, idpatient: number): void {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_HISTORY_CONFIG}/${id}?patientClinicalHistoryId=${idpatient}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}

