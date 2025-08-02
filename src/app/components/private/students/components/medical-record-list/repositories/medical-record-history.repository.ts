import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UriConstants } from 'src/app/utils/uris.contants';
import { MedicalRecordHistoryResponse } from '../models/medical-record-history.model';

@Injectable({ providedIn: 'root' })
export class MedicalRecordHistoryRepository {
  constructor(private http: HttpClient) {}

  getMedicalRecordsByPatientId(
    idPatient: string, 
    page: number = 0, 
    size: number = 10,
    order: string = 'createdAt',
    asc: boolean = false
  ): Observable<MedicalRecordHistoryResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('order', order)
      .set('asc', asc.toString());
    
    return this.http.get<MedicalRecordHistoryResponse>(
      `${UriConstants.GET_MEDICAL_RECORDS_BY_PATIENT_ID}${idPatient}`,
      { params }
    );
  }
} 