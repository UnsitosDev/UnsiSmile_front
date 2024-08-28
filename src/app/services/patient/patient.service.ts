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
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';


@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private apiService = inject(ApiService<religionRequest>);
    religionData: religionRequest[] = [];
    religionOptions: Array<{ value: string; label: string }> = [];
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
                    this.religionOptions = response.map((item: any) => ({
                        value: item.idReligion.toString(),
                        label: item.religion
                    }));
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
    housingOptions: Array<{ value: string; label: string }> = [];
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
                    this.localityOptions = response.map((item: any) => ({
                        value: item.idLocality.toString(),
                        label: item.name
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Municipios
    municipalityResponse:PaginatedData<municipalityRequest> [] = [];
    municipalityOptions: Array<{ value: string; label: string }> = [];
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
                    this.municipalityResponse = response.content;
                    this.municipalityOptions = this.municipalityResponse.map((item: any) => ({
                        value: item.idMunicipality.toString(),
                        label: item.name    
                    }));
                    console.log(this.municipalityResponse);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Estados
    stateResponseData: PaginatedData<stateRequest>[] = [];
    stateOptions: Array<{ value: string; label: string }> = [];
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
                    this.stateResponseData = response.content;
                    this.stateOptions = this.stateResponseData.map((item: any) => ({
                        value: item.idState.toString(),
                        label: item.name    
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Nacionalidad
    nationalityData: nationalityRequest[] = [];
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
                    this.nationalityData = response;
                    this.nationalityOptions = response.map((item: any) => ({
                        value: item.idNationality.toString(),
                        label: item.nationality    
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Estado civil
    maritalStatusData: maritalStatusRequest[] = [];
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
                    this.maritalStatusData = response;
                    this.maritalStatusOptions = response.map((item: any) => ({
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
    occupationData: occupationRequest[] = [];
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
                    this.occupationData = response;
                    this.occupationOptions = response.map((item: any) => ({
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
    ethnicGroupData: ethnicGroupRequest[] = [];
    ethnicGroupOptions: Array<{ value: string; label: string }> = [];
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
                    this.ethnicGroupOptions = response.map((item: any) => ({
                        value: item.idEthnicGroup.toString(),
                        label: item.ethnicGroup    
                    }));
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

    // Buscar por codigo postal
    postalCode: String = '70805';
    getPostalCode() {
        this.apiService
            .getService({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
                url: `${UriConstants.GET_POSTAL_CODE}`+ this.postalCode,
                data: {},
            })
            .subscribe({
                next: (response) => {

                    console.log('Codigo postal = ', response);
                },
                error: (error) => {
                    console.error('Error en la autenticación:', error);
                },
            });
    }

}
