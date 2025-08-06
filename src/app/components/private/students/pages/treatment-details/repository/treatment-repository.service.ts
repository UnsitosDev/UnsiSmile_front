import { Injectable } from '@angular/core';
import { TreatmentDetailResponse } from 'src/app/shared/models';
import { UriConstants } from '@mean/utils';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreatmentRepositoryService {
  constructor(private http: HttpClient) {}

  getTreatmentDetails(idTreatment: string): Observable<TreatmentDetailResponse> {
    const url = UriConstants.GET_TREATMENTS_DETAILS
      .replace(':idTreatmentDetail', idTreatment);
    return this.http.get<TreatmentDetailResponse>(url);
  }
}
