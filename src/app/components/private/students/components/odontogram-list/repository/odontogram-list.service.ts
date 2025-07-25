import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UriConstants } from '@mean/utils';
import { Observable } from 'rxjs';
import { OdontogramTreatment } from '../models/odontogram-list.model';

@Injectable({
  providedIn: 'root'
})
export class OdontogramListService {
  constructor(private http: HttpClient) {}

  getOdontogramsByPatientMedicalRecordId(patientClinicalHistoryId: number): Observable<OdontogramTreatment[]> {
    const url = UriConstants.GET_ODONTOGRAMS_BY_PATIENT_MEDICAL_RECORD_ID
      .replace(':patientMedicalRecordId', patientClinicalHistoryId.toString());
    
    return this.http.get<OdontogramTreatment[]>(url);
  }
}
