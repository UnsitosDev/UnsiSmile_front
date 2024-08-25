import { inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';
import { religionRequest } from 'src/app/models/shared/patients/Religion/religion';
import { UriConstants } from '@mean/utils';
import { genderRequest } from 'src/app/models/models-students/genders/genders';


@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private apiService = inject(ApiService<religionRequest>);
    religionData: religionRequest[] = [];
    getReligion() {
        this.apiService
            .getListService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_RELIGION}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.religionData = response;
                    console.log(this.religionData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);

                },
            });
    }

    genderData: genderRequest[] = [];
    getGender() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_GENDER}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.genderData = response;
                    console.log(this.genderData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

}
