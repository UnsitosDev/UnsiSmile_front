import { inject, Injectable } from '@angular/core';
import { MedicalRecordCatalog, EMedicalRecords } from 'src/app/models/history-clinic/medical-record.models';
import { ApiService } from '../../api.service';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { mapMedicalRecordToDataTabs } from 'src/app/components/private/students/adapters/medical-record.adapter'; // Asegúrate de que la ruta sea correcta
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralMedicalRecordService {

  private apiService = inject(ApiService);

  historyData: MedicalRecordCatalog[] = [];
  mappedHistoryData!: dataTabs;
 getHistoryClinics(idPatientMedicalRecord: number, idPatientUuid: string): Observable<dataTabs> {
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_MEDICAL_RECORD_CONFIG}/${idPatientMedicalRecord}/patients/${idPatientUuid}`,
        data: {},
      })
      .pipe(
        map((response: MedicalRecordCatalog) => {
          return mapMedicalRecordToDataTabs(response);
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
        map((response: MedicalRecordCatalog) => {
          return mapMedicalRecordToDataTabs(response);
        })
      );
  }

  getHistoryClinicsStudent(idPatient: string, idMedicalRecord: number): Observable<dataTabs> {
    return this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_MEDICAL_RECORD_CONFIG}/${idPatient}/patients/${idMedicalRecord}`,
        data: {},
      })
      .pipe(
        map((response: MedicalRecordCatalog) => {
          return mapMedicalRecordToDataTabs(response);
        })
      );
  }

  getMedicalRecord(type: EMedicalRecords, idPatient: string): Observable<dataTabs> {
    
    const url = UriConstants.GET_MEDICAL_RECORD_CONFIG_BY_PATIENT
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
        map((response: MedicalRecordCatalog) => {
          return mapMedicalRecordToDataTabs(response);
        })
      );
  }

}


