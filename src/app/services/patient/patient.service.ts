import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';
import { religionOptions, religionRequest, religionResponse } from 'src/app/models/shared/patients/Religion/religion';
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
import { ethnicGroupOptions, ethnicGroupRequest } from 'src/app/models/shared/patients/EthnicGroup/ethnicGroup';
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
                    // Verificar si la respuesta es un array o tiene propiedad content
                    const data = Array.isArray(response) ? response : response.content;
                    this.housingResponseData = data;
                    this.housingOptions = data?.map((item: any) => ({
                        value: item.idHousing.toString(),
                        label: item.category
                    })) || [];
                },
                error: (error) => {
                    console.error('Error al obtener tipos de vivienda:', error);
                    this.housingOptions = []; // Asegurar que siempre haya un array aunque sea vacío
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
                    this.streetsData = response.content;
                    this.streetsOptions = response.content.map((item: any) => ({
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
neighborhoodResponse: PaginatedData<neighborhoodRequest>[] = [];
neighborhoodOptions: Array<{ value: string; label: string }> = [];

getNeighborhoodData(searchTerm: string) {
    this.apiService
        .getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_NEIGHBORHOODS}?keyword=${searchTerm}`,
            data: {},
        })
        .subscribe({
            next: (response) => {
                this.neighborhoodResponse = response.content;
                this.neighborhoodOptions = response.content.map((item: any) => ({
                    value: item.idNeighborhood.toString(),
                    label: item.name,
                }));
            },
            error: (error) => {
                console.error('Error al obtener colonias:', error);
            },
        });
}

getNeighborhoodDataPaginated(searchTerm: string, page: number, size: number, localityId?: string): Observable<PaginatedData<neighborhoodRequest>> {
    if (!localityId) {
        console.log('Se requiere ID de localidad para buscar colonias');
        return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
            pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false },
            last: true,
            size: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            numberOfElements: 0,
            first: true,
            empty: true,
        });
    }

    const url = `${UriConstants.GET_NEIGHBORHOODS_LOCALITY}${localityId}?page=0&size=1000`;

    return this.apiService.getService({
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        url: url,
        data: {},
    }).pipe(
        map(response => {
            console.log('Respuesta inicial de colonias por localidad:', response);

            let filteredContent = response.content;

            if (searchTerm && searchTerm.trim() !== '') {
                const searchTermLower = searchTerm.toLowerCase();
                filteredContent = response.content.filter((item: neighborhoodRequest) => 
                    item.name.toLowerCase().includes(searchTermLower)
                );
            }

            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedContent = filteredContent.slice(startIndex, endIndex);

            return {
                content: paginatedContent,
                totalElements: filteredContent.length,
                totalPages: Math.ceil(filteredContent.length / size),
                number: page,
                size: size,
                pageable: response.pageable,
                last: endIndex >= filteredContent.length,
                first: page === 0,
                empty: paginatedContent.length === 0,
                numberOfElements: paginatedContent.length,
                sort: response.sort,
            };
        }),
        catchError(error => {
            console.error('Error en la petición de colonias:', error);
            return of({
                content: [],
                totalElements: 0,
                totalPages: 0,
                number: 0,
                pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false },
                last: true,
                size: 0,
                sort: { sorted: false, empty: true, unsorted: true },
                numberOfElements: 0,
                first: true,
                empty: true,
            });
        })
    );
}


   // Localidad
localityResponse: PaginatedData<localityRequest>[] = [];
localityOptions: Array<{ value: string; label: string }> = [];

getLocalityData(searchTerm: string) {
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
                this.localityResponse = response.content;
                this.localityOptions = response.content.map((item: any) => ({
                    value: item.idLocality.toString(),
                    label: item.name,
                }));
            },
            error: (error) => {
                console.error('Error en la obtención de localidades:', error);
            },
        });
}

getLocalityDataPaginated(searchTerm: string, page: number, size: number, municipalityId?: string): Observable<PaginatedData<localityRequest>> {
    if (!municipalityId) {
        console.log('Se requiere ID de municipio para buscar localidades');
        return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
    }

    const url = `${UriConstants.GET_LOCALITIES_MUNICIPALITY}${municipalityId}?page=0&size=1000`;
    
    return this.apiService.getService({
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        url: url,
        data: {},
    }).pipe(
        map(response => {
            console.log('Respuesta inicial de localidades por municipio:', response);
            
            let filteredContent = response.content;
            
            if (searchTerm && searchTerm.trim() !== '') {
                const searchTermLower = searchTerm.toLowerCase();
                filteredContent = response.content.filter((item: localityRequest) => 
                    item.name.toLowerCase().includes(searchTermLower)
                );
            }
            
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedContent = filteredContent.slice(startIndex, endIndex);
            
            return {
                content: paginatedContent,
                totalElements: filteredContent.length,
                totalPages: Math.ceil(filteredContent.length / size),
                number: page,
                size: size,
                pageable: response.pageable,
                last: endIndex >= filteredContent.length,
                first: page === 0,
                empty: paginatedContent.length === 0,
                numberOfElements: paginatedContent.length,
                sort: response.sort
            };
        }),
        catchError(error => {
            console.error('Error en la petición de localidades:', error);
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

getMunicipalityDataPaginated(searchTerm: string, page: number, size: number, stateId?: string): Observable<PaginatedData<municipalityRequest>> {
    if (!stateId) {
        console.log('Se requiere ID de estado para buscar municipios');
        return of({ content: [], totalElements: 0, totalPages: 0, number: 0, pageable: { pageNumber: 0, pageSize: 0, sort: { sorted: false, empty: true, unsorted: true }, offset: 0, paged: true, unpaged: false }, last: true, size: 0, sort: { sorted: false, empty: true, unsorted: true }, numberOfElements: 0, first: true, empty: true });
    }

    const url = `${UriConstants.GET_MUNICIPALITY_STATE}${stateId}?page=0&size=1000`;
    
    return this.apiService.getService({
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        url: url,
        data: {},
    }).pipe(
        map(response => {
            console.log('Respuesta inicial de municipios por estado:', response);
            
            let filteredContent = response.content;
            
            if (searchTerm && searchTerm.trim() !== '') {
                const searchTermLower = searchTerm.toLowerCase();
                filteredContent = response.content.filter((item: municipalityRequest) => 
                    item.name.toLowerCase().includes(searchTermLower)
                );
            }
            
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedContent = filteredContent.slice(startIndex, endIndex);
            
            return {
                content: paginatedContent,
                totalElements: filteredContent.length,
                totalPages: Math.ceil(filteredContent.length / size),
                number: page,
                size: size,
                pageable: response.pageable,
                last: endIndex >= filteredContent.length,
                first: page === 0,
                empty: paginatedContent.length === 0,
                numberOfElements: paginatedContent.length,
                sort: response.sort
            };
        }),
        catchError(error => {
            console.error('Error en la petición de municipios:', error);
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

    etnichGroupDataOptions: ethnicGroupOptions[]=[];
    getEthnicGroupDataPaginated(searchTerm: string, page: number, size: number): Observable<ethnicGroupOptions[]> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_ETHNIC_GROUP}?keyword=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            map((response) => {
                // Mapea las opciones de la respuesta
                    this.ethnicGroupOptions = response.content.map((item: ethnicGroupRequest) => ({
                        value: item.idEthnicGroup.toString(),
                        label: item.ethnicGroup, 
                    }));
                    return this.ethnicGroupOptions;  
            }),
        );
    }

    religionData: PaginatedData<religionResponse>[] = [];
    getReligionData(searchTerm: string) {
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

    religionOptions: religionOptions[] = [];    
    getReligionDataPaginated(searchTerm: string, page: number, size: number): Observable<religionOptions[]> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_RELIGION}?keyword=${searchTerm}&page=${page}&size=${size}`,
            data: {},
        }).pipe(
            map((response: { content: religionResponse[] }) => {
                // Mapea las opciones de la respuesta
                this.religionOptions = response.content.map((item: religionResponse) => ({
                    value: item.idReligion.toString(),
                    label: item.religion, 
                }));
                return this.religionOptions;  
            }),
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
