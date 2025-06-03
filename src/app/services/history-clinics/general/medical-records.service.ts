import { inject, Injectable } from '@angular/core';
import { ClinicalHistoryCatalog, EMedicalRecords } from 'src/app/models/history-clinic/historyClinic';
import { ApiService } from '../../api.service';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { mapClinicalHistoryToDataTabs } from 'src/app/components/private/students/adapters/clinical-history.adapters'; // Asegúrate de que la ruta sea correcta
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralMedicalRecordService {

  private apiService = inject(ApiService);

  historyData: ClinicalHistoryCatalog[] = [];
  mappedHistoryData!: dataTabs;
 getHistoryClinics(idPatientClinicalHistory: number, idPatientUuid: string): Observable<dataTabs> {
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_HISTORY_CONFIG}/${idPatientClinicalHistory}/patients/${idPatientUuid}`,
        data: {},
      })
      .pipe(
        map((response: ClinicalHistoryCatalog) => {
          return mapClinicalHistoryToDataTabs(response);
        })
      );
  }


  getGeneralMedicalRecord(idPatient: string): Observable<dataTabs> {
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_GENERAL_MEDICAL_RECORD}?idPatient=${idPatient}`,
        data: {},
      })
      .pipe(
        map((response: ClinicalHistoryCatalog) => {
          return mapClinicalHistoryToDataTabs(response);
        })
      );
  }

  getHistoryClinicsStudent(idPatient: string, idClinicalHistory: number): Observable<dataTabs> {
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_HISTORY_CONFIG}/${idPatient}/patients/${idClinicalHistory}`,
        data: {},
      })
      .pipe(
        map((response: ClinicalHistoryCatalog) => {
          return mapClinicalHistoryToDataTabs(response);
        })
      );
  }

  getMedicalRecord(type: EMedicalRecords, idPatient: string): Observable<dataTabs> {
    
    const url = UriConstants.GET_HISTORY_CONFIG_BY_PATIENT
    .replace(':medicalRecordType', type.toString())
    .replace(':idPatient', idPatient);
    
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: url,
        data: {},
      })
      .pipe(
        map((response: ClinicalHistoryCatalog) => {
          return mapClinicalHistoryToDataTabs(response);
        })
      );
  }

}


