import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UriConstants } from '@mean/utils';
import { Observable } from 'rxjs';
import { MedicalRecordCatalog } from 'src/app/models/history-clinic/medical-record.models';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordRepositoryService {

  constructor(private http: HttpClient) {}

  getMedicalRecordByPatientId(patientId: string): Observable<MedicalRecordCatalog> {
    return this.http.get<MedicalRecordCatalog>(
      `${UriConstants.GET_GENERAL_MEDICAL_RECORD}`, {
        params: { idPatient: patientId }
      }
    );
  }

  createMedicalRecord(patientId: string): Observable<void> {
    return this.http.post<void>(
      `${UriConstants.POST_GENERAL_MEDICAL_RECORD}`, 
      {},
      {
        params: { idPatient: patientId }
      }
    );
  }
}
