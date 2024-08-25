import { inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';
import { religionRequest } from 'src/app/models/shared/patients/Religion/religion';
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


@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private apiService = inject(ApiService<religionRequest>);
    religionData: religionRequest[] = [];
    getReligionData() {
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
                    console.log(this.housingResponseData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Calles
    streetsData: streetRequest[] = [];
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
                    console.log(this.streetsData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Colonias
    neighborhoodResponseData: neighborhoodRequest[] = [];
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
                    console.log(this.neighborhoodResponseData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Localidad
    localityData: localityRequest[] = [];
    getLocality() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_LOCALITIES}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.localityData = response;
                    console.log('localidades =', this.localityData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Municipios
    municipalityResponse: municipalityRequest[] = [];
    getMunicipalityData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_MUNICIPALITY}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.municipalityResponse = response;
                    console.log(this.municipalityResponse);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Estados
    stateResponseData: stateRequest[] = [];
    getStateData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_STATE}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.stateResponseData = response;
                    console.log(this.stateResponseData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Nacionalidad
    nationalityData: nationalityRequest[] = [];
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
                    this.nationalityData = response;
                    console.log(this.nationalityData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Estado civil
    maritalStatusData: maritalStatusRequest[] = [];
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
                    this.maritalStatusData = response;
                    console.log(this.maritalStatusData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Ocupacion
    occupationData: occupationRequest[] = [];
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
                    this.occupationData = response;
                    console.log('ocupacion', this.occupationData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Grupo etnico
    ethnicGroupData: ethnicGroupRequest[] = [];
    getEthnicGroupData() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_ETHNIC_GROUP}`,
                data: {},
            })
            .subscribe({
                next: (response) => {
                    this.ethnicGroupData = response;
                    console.log(this.ethnicGroupData);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }


}
