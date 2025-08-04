import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UriConstants } from '@mean/utils';
import { Observable } from 'rxjs';
import { OdontogramSimpleResponse } from '../models/odontogram-list.model';

@Injectable({
  providedIn: 'root'
})
export class OdontogramListService {
  constructor(private http: HttpClient) {}

  getOdontogramsByPatientMedicalRecordId(patientMedicalRecordId: number): Observable<OdontogramSimpleResponse[]> {
    const url = UriConstants.GET_ODONTOGRAMS_BY_PATIENT_MEDICAL_RECORD_ID
      .replace(':patientMedicalRecordId', patientMedicalRecordId.toString());
    
    return this.http.get<OdontogramSimpleResponse[]>(url);
  }

  getOdontogramsByPatientUuid(patientId: string): Observable<OdontogramSimpleResponse[]> {
    const url = UriConstants.GET_ODONTOGRAMS_BY_PATIEN_ID
      .replace(':patientId', patientId);
    
    return this.http.get<OdontogramSimpleResponse[]>(url);
  }

}
