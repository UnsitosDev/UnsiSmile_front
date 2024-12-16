import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';
import { religionRequest, religionResponse } from 'src/app/models/shared/patients/Religion/religion';
import { UriConstants } from '@mean/utils';
import { genderRequest } from 'src/app/models/models-students/genders/genders';
import { housingRequest } from 'src/app/models/shared/addresses/housing/housing';
import { streetRequest } from 'src/app/models/shared/addresses/street/street';
import { neighborhoodRequest } from 'src/app/models/shared/addresses/neighborhood/neighborhood';
import { localityRequest } from 'src/app/models/shared/addresses/locality/locality';
import { municipalityRequest } from 'src/app/models/shared/addresses/municipality/municipality';
import { stateRequest } from 'src/app/models/shared/addresses/state/state';
import { nationalityRequest } from 'src/app/models/shared/patients/Nationality/Nationality';
import { maritalStatusRequest } from 'src/app/models/shared/patients/MaritalStatus/maritalStatus';
import { occupationRequest } from 'src/app/models/shared/patients/Occupation/occupation';
import { ethnicGroupRequest } from 'src/app/models/shared/patients/EthnicGroup/ethnicGroup';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { FormFieldOption } from 'src/app/models/form-fields/form-field.interface';


@Injectable({
    providedIn: 'root'
})
export class PatientService {
    constructor(private http: HttpClient) { }


    private apiService = inject(ApiService<religionRequest>);


    // Genero
    genderData: genderRequest[] = [];
    genderOptions: Array<{ value: string; label: string }> = [];
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
                    this.genderOptions = response.map((item: any) => ({
                        value: item.idGender.toString(),
                        label: item.gender
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Tipos de vivienda
    housingResponseData: housingRequest[] = [];
    housingOptions: FormFieldOption[] = [];
    getHousingData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_HOUSING}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.housingResponseData = response;
                    this.housingOptions = response.map((item: any) => ({
                        value: item.idHousing.toString(),
                        label: item.category
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Calles
    streetsData: streetRequest[] = [];
    streetsOptions: Array<{ value: string; label: string }> = [];
    getStreets() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_STREETS}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.streetsData = response;
                    this.streetsOptions = response.map((item: any) => ({
                        value: item.idStreet.toString(),
                        label: item.name
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Colonias
    neighborhoodResponseData: neighborhoodRequest[] = [];
    neighborhoodOptions: Array<{ value: string; label: string }> = [];
    getNeighborhoodData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_NEIGHBORHOODS}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.neighborhoodResponseData = response;
                    this.neighborhoodOptions = response.map((item: any) => ({
                        value: item.idNeighborhood.toString(),
                        label: item.name
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Localidad
    localityData: localityRequest[] = [];
    localityOptions: Array<{ value: string; label: string }> = [];
    getLocality(searchTerm: string) {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_LOCALITIES}?keyword=${searchTerm}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.localityData = response.content;
                    this.localityOptions = response.content.map((item: any) => ({
                        value: item.idLocality.toString(),
                        label: item.name
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    getLocalityDataPaginated(searchTerm: string, page: number, size: number): Observable<PaginatedData<localityRequest>> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_LOCALITIES}?keyword=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            catchError((error) => {
                console.error('Error en la autenticación:', error);
                return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
            })
        );
    }

    // Municipios
    municipalityResponse: PaginatedData<municipalityRequest>[] = [];
    municipalityOptions: Array<{ value: string; label: string }> = [];
    getMunicipalityData(searchTerm: string) {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_MUNICIPALITY}?keyword=${searchTerm}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.municipalityResponse = response.content;
                    this.municipalityOptions = response.content.map((item: any) => ({
                        value: item.idMunicipality.toString(),
                        label: item.name
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    getMunicipalityDataPaginated(searchTerm: string, page: number, size: number): Observable<PaginatedData<municipalityRequest>> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_MUNICIPALITY}?keyword=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            catchError((error) => {
                console.error('Error en la autenticación:', error);
                return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
            })
        );
    }

    // Nacionalidad
    nationalityRequest: PaginatedData<nationalityRequest>[] = [];
    nationalityOptions: Array<{ value: string; label: string }> = [];
    getNacionalityData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_NACIONALITY}`,
                data: {},
            })
            .subscribe({
                next: (response) => {

                    this.nationalityRequest = response.content;
                    this.nationalityOptions = this.nationalityRequest.map((item: any) => ({
                        value: item.idNationality.toString(),
                        label: item.nationality
                    }))
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }
    // Estados
    stateResponseData: PaginatedData<stateRequest>[] = [];
    stateOptions: Array<{ value: string; label: string }> = [];
    getStateDataPaginated(searchTerm: string, page: number, size: number): Observable<PaginatedData<stateRequest>> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_STATE}?search=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            catchError((error) => {
                console.error('Error en la autenticación:', error);
                return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
            })
        );
    }



    // Estado civil
    maritalStatusData: PaginatedData<maritalStatusRequest>[] = [];
    maritalStatusOptions: Array<{ value: string; label: string }> = [];
    getMaritalStatusData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_MARITAL_STATUS}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.maritalStatusData = response.content;
                    this.maritalStatusOptions = this.maritalStatusData.map((item: any) => ({
                        value: item.idMaritalStatus.toString(),
                        label: item.maritalStatus
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Ocupacion
    occupationData: PaginatedData<occupationRequest>[] = [];
    occupationOptions: Array<{ value: string; label: string }> = [];
    getOcupationData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_OCUPATION}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.occupationData = response.content;
                    this.occupationOptions = this.occupationData.map((item: any) => ({
                        value: item.idOccupation.toString(),
                        label: item.occupation
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Grupo etnico
    ethnicGroupData: PaginatedData<ethnicGroupRequest>[] = [];
    ethnicGroupOptions: Array<{ value: string; label: string }> = [];
    getEthnicGroupData(searchTerm: string) {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_ETHNIC_GROUP}?keyword=${searchTerm}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.ethnicGroupData = response.content;
                    this.ethnicGroupOptions = response.content.map((item: any) => ({
                        value: item.idEthnicGroup.toString(),
                        label: item.ethnicGroup
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    getEthnicGroupDataPaginated(searchTerm: string, page: number, size: number): Observable<PaginatedData<ethnicGroupRequest>> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_ETHNIC_GROUP}?keyword=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            catchError((error) => {
                console.error('Error en la autenticación:', error);
                return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
            })
        );
    }

    religionData: PaginatedData<religionResponse>[] = [];
    religionOptions: Array<{ value: string; label: string }> = [];
    getReligionData(searchTerm:string) {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_RELIGION}?keyword=${searchTerm}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.religionData = response.content;
                    this.religionOptions = this.religionData.map((item: any) => ({
                        value: item.idReligion.toString(),
                        label: item.religion
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);

                },
            });
    }

    getReligionDataPaginated(searchTerm: string, page: number, size: number): Observable<PaginatedData<religionResponse>> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_RELIGION}?keyword=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            catchError((error) => {
                console.error('Error en la autenticación:', error);
                return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
            })
        );
    }
    // Buscar por codigo postal
    locality: string = '';
    municipality: string = '';
    state: string = '';
    dat: any;

    getPostalCode(param: string): Observable<any> {
        return this.http.get<any>(`${UriConstants.GET_POSTAL_CODE}${param}`, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        });
    }

}
