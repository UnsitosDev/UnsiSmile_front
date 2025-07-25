import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormSection, formSectionFields } from '@mean/models';
import { UriConstants } from '@mean/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RateFormSectionService {
  constructor(private http: HttpClient) {}

  getFormSection(
    formSectionId: string,
    idPatientClinicalHistory: number
  ): Observable<FormSection> {
    const url = UriConstants.GET_FORM_SECTION.replace(
      ':formSectionId',
      formSectionId.toString()
    ).replace(':idPatientMedicalRecord', idPatientClinicalHistory.toString());

    return this.http.get<FormSection>(url);
  }
}
