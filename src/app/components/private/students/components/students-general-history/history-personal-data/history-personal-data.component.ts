import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';

interface StateData {
  idState: string;
  name: string;
}

interface MunicipalityData {
  idMunicipality: string;
  name: string;
  state: {
    idState: string;
    name: string;
  };
}

interface NeighborhoodData {
  idNeighborhood: number;
  name: string;
  locality: {
    idLocality: string;
    name: string;
    postalCode: string;
    municipality: {
      idMunicipality: string;
      name: string;
      state: {
        idState: string;
        name: string;
      };
    };
  };
}

interface AddressData {
  idStreet: number;
  name: string;
  neighborhood: {
    idNeighborhood: number;
    name: string;
    locality: {
      idLocality: string;
      name: string;
      postalCode: string;
      municipality: {
        idMunicipality: string;
        name: string;
        state: {
          idState: string;
          name: string;
        };
      };
    };
  };
}

interface HousingData {
  idHousing: string;
  category: string;
}

interface Religion {
  idReligion: number;
  religion: string;
}

interface Nacionalidad {
  idNationality: number;
  nationality: string;
}

interface Ocupacion {
  idOccupation: number;
  occupation: string;
}

interface EstadoCivil {
  idMaritalStatus: number;
  maritalStatus: string;
}

interface GrupoEtnico {
  idEthnicGroup: number;
  ethnicGroup: string;
}

interface Estado {
  idState: string;
  name: string;
}

interface Municipio {
  idMunicipality: string;
  name: string;
  state: Estado;
}

interface Localidad {
  idLocality: string;
  name: string;
  postalCode: string;
  municipality: Municipio;
}

interface Genero {
  idGender: number;
  gender: string;
}

@Component({
  selector: 'app-history-personal-data',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    NgIf,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './history-personal-data.component.html',
  styleUrl: './history-personal-data.component.scss',
})
export class HistoryPersonalDataComponent implements OnInit {
  // Crear un control de formulario para el input de texto
  controlNationality = new FormControl('');
  controlOcupation = new FormControl('');
  controlEthnicGroup = new FormControl('');
  controlMaritalStatus = new FormControl('');
  controlReligion = new FormControl('');
  controlLocalitie = new FormControl('');
  controlGender = new FormControl('');
  controlHousingData = new FormControl('');
  controlstreetsData = new FormControl('');
  controlNeighborhood = new FormControl('');
  controlMunicipality = new FormControl('');
  controlState = new FormControl('');
  // Crear un observable que devuelve un arreglo de strings que representan las nacionalidades filtradas
  filteredNationality: Observable<string[]>;
  filteredEthnicGroup: Observable<string[]>;
  filteredOcupations: Observable<string[]>;
  filteredMaritalStatus: Observable<string[]>;
  filteredReligion: Observable<string[]>;
  filteredLocality: Observable<string[]>;
  filterGender: Observable<string[]>;
  filterHousingData: Observable<string[]>;
  filterStreetsData: Observable<string[]>;
  filterNeighborhood: Observable<string[]>;
  filterMunicipality: Observable<string[]>;
  filterSates: Observable<string[]>;

  // Método que se encarga de filtrar las nacionalidades según el valor de búsqueda
  private _filter(value: string): string[] {
    // Normalizar el valor de búsqueda para que sea case-insensitive y sin espacios en blanco
    const filterValue = this._normalizeValue(value);
    // Convertir el arreglo de objetos nationalityData en un arreglo de strings que representan las nacionalidades
    return this.nationalityData
      .map((nacionalidad) => nacionalidad.nationality)
      .filter((nationalityData) =>
        this._normalizeValue(nationalityData).includes(filterValue)
      );
  }

  // Método que se encarga de filtrar los grupos etnicos según el valor de búsqueda
  private _filterEthnicGroup(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.ethnicGroupData
      .map((ethnicGroup) => ethnicGroup.ethnicGroup)
      .filter((ethnicGroupData) =>
        this._normalizeValue(ethnicGroupData).includes(filterValue)
      );
  }

  // Método que se encarga de filtrar las ocupaciones según el valor de búsqueda
  private _filterOcupations(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.occupationData
      .map((ocupacion) => ocupacion.occupation)
      .filter((occupationData) =>
        this._normalizeValue(occupationData).includes(filterValue)
      );
  }

  // Método que se encarga de filtrar las ocupaciones según el valor de búsqueda
  private _filterMaritalStatus(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.maritalStatusData
      .map((maritalSts) => maritalSts.maritalStatus)
      .filter((maritalStatusData) =>
        this._normalizeValue(maritalStatusData).includes(filterValue)
      );
  }

  // Método que se encarga de filtrar las reliogiones segun el valor de busqueda
  private _filterReligion(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.religionData
      .map((religionName) => religionName.religion)
      .filter((religionData) =>
        this._normalizeValue(religionData).includes(filterValue)
      );
  }

  // Método que se encarga de filtrar las las localidades segun el valor de busqueda
  private _filterLocality(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.localityData
      .map((locality) => locality.name)
      .filter((localityData) =>
        this._normalizeValue(localityData).includes(filterValue)
      );
  }

  // Método que se encarga de filtrar las los generos con el valor de busqueda
  private _filterGender(value: string): string[] {
    const filterGender = this._normalizeValue(value);
    return this.genderData
      .map((genderName) => genderName.gender)
      .filter((genderData) =>
        this._normalizeValue(genderData).includes(filterGender)
      );
  }

  // Método que se encarga de filtrar las los generos con el valor de busqueda
  private _filterGenderHousing(value: string): string[] {
    const filterGender = this._normalizeValue(value);
    return this.housingResponseData
      .map((housingName) => housingName.category)
      .filter((housingResponseData) =>
        this._normalizeValue(housingResponseData).includes(filterGender)
      );
  }

  // Método que se encarga de filtrar las calles
  private _filterStreets(value: string): string[] {
    const filterGender = this._normalizeValue(value);
    return this.streetsData
      .map((streetName) => streetName.name)
      .filter((streetsData) =>
        this._normalizeValue(streetsData).includes(filterGender)
      );
  }

  // Método que se encarga de filtrar las colonias
  private _filterNeighborhoods(value: string): string[] {
    const filterGender = this._normalizeValue(value);
    return this.neighborhoodResponseData
      .map((neighborhoodName) => neighborhoodName.name)
      .filter((neighborhoodResponseData) =>
        this._normalizeValue(neighborhoodResponseData).includes(filterGender)
      );
  }

  // Método que se encarga de filtrar los municipios
  private _filterMunicipality(value: string): string[] {
    const filterGender = this._normalizeValue(value);
    return this.municipalityResponse
      .map((municipalityName) => municipalityName.name)
      .filter((municipalityResponse) =>
        this._normalizeValue(municipalityResponse).includes(filterGender)
      );
  }

  private _filterState(value: string): string[] {
    const filterGender = this._normalizeValue(value);
    return this.stateResponseData
      .map((stateName) => stateName.name)
      .filter((stateResponseData) =>
        this._normalizeValue(stateResponseData).includes(filterGender)
      );
  }

  // Método que se encarga de normalizar el valor de búsqueda
  private _normalizeValue(value: string): string {
    // Convertir el valor a minúsculas
    return value.toLowerCase().replace(/\s/g, '');
  }

  birthDateU: string;
  youngerForm: boolean = false;

  private apiService = inject(ApiService<Religion>);

  constructor() {
    this.birthDateU = ''; // Inicializamos la propiedad en el constructor
    // Inicializamos la propiedades oara filtros
    this.filteredNationality = new Observable<string[]>();
    this.filteredEthnicGroup = new Observable<string[]>();
    this.filteredOcupations = new Observable<string[]>();
    this.filteredMaritalStatus = new Observable<string[]>();
    this.filteredReligion = new Observable<string[]>();
    this.filteredLocality = new Observable<string[]>();
    this.filterGender = new Observable<string[]>();
    this.filterHousingData = new Observable<string[]>();
    this.filterStreetsData = new Observable<string[]>();
    this.filterNeighborhood = new Observable<string[]>();
    this.filterMunicipality = new Observable<string[]>();
    this.filterSates = new Observable<string[]>();
  }
  ngOnInit(): void {
    this.getReligion();
    this.getNacionality();
    this.getOcupation();
    this.getMaritalStatus();
    this.getEthnicGroup();
    this.getLocality();
    this.getGender();
    this.getHousingData();
    this.getStreets();
    this.getNeighborhoodData();
    this.getStateData();
    // this.getMunicipalityData();
    //   console.log(this.patientForm.value);

    // Crear un observable que devuelve un arreglo de strings que representan las nacionalidades filtradas
    this.filteredNationality = this.controlNationality.valueChanges.pipe(
      // Inicializar el observable con un valor vacío para que se muestren todas las nacionalidades al principio
      startWith(''),
      // Cuando el valor del control cambia, aplicar el método _filter para filtrar las nacionalidades
      map((value) => this._filter(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan los grupos etnicos filtrados
    this.filteredEthnicGroup = this.controlEthnicGroup.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEthnicGroup(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan las ocupaciones filtradas
    this.filteredOcupations = this.controlOcupation.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterOcupations(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan los estados civiles filtrados
    this.filteredMaritalStatus = this.controlMaritalStatus.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterMaritalStatus(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan las religiones filtradas
    this.filteredReligion = this.controlReligion.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterReligion(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan las localidades filtradas
    this.filteredLocality = this.controlLocalitie.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterLocality(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan las localidades filtradas
    this.filterGender = this.controlGender.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGender(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan las categorias de casas filtradas
    this.filterHousingData = this.controlHousingData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGenderHousing(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan los nombres de las calles filtradas
    this.filterStreetsData = this.controlstreetsData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterStreets(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan los nombres de las colonias filtradas
    this.filterNeighborhood = this.controlNeighborhood.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterNeighborhoods(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan los municipios filtrados
    this.filterMunicipality = this.controlMunicipality.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterMunicipality(value || ''))
    );

    // Crear un observable que devuelve un arreglo de strings que representan los estados filtrados
    this.filterSates = this.controlState.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterState(value || ''))
    );
  }

  onFechaNacimientoChange() {
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(this.birthDate);
    const diferenciaAnios =
      fechaActual.getFullYear() - fechaSeleccionada.getFullYear();

    // Verificar si han pasado menos de 18 años
    if (diferenciaAnios < 18) {
      this.youngerForm = true;
    } else {
      this.youngerForm = false;
    }
  }

  // Religion
  religionData: Religion[] = [];
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
          // console.log(this.religionData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Nacionalidad
  nationalityData: Nacionalidad[] = [];
  getNacionality() {
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
          // console.log(this.nationalityData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Ocupacion
  occupationData: Ocupacion[] = [];
  getOcupation() {
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
          // console.log('ocupacion',this.occupationData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Estado civil
  maritalStatusData: EstadoCivil[] = [];
  getMaritalStatus() {
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
          // console.log(this.maritalStatusData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Grupo etnico
  ethnicGroupData: GrupoEtnico[] = [];
  getEthnicGroup() {
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
          // console.log(this.ethnicGroupData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Localidad
  localityData: Localidad[] = [];
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
          // console.log('localidades =',this.localityData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Genero
  genderData: Genero[] = [];
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
          // console.log(this.genderData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Tipos de vivienda
  housingResponseData: HousingData[] = [];
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
  streetsData: AddressData[] = [];
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
          // console.log(this.streetsData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Colonias
  neighborhoodResponseData: NeighborhoodData[] = [];
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
          // console.log(this.neighborhoodResponseData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Municipios
  municipalityResponse: MunicipalityData[] = [];
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
          // console.log(this.municipalityResponse);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Estados
  stateResponseData: StateData[] = [];
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
          // console.log(this.stateResponseData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  idPatient: number = 0;
  admissionDate: string = '2024-05-01';
  isMinor: boolean = false;
  hasDisability: boolean = false;
  nationalityId: number = 0;
  curp: string = '';
  firstName: string = '';
  secondName: string = '';
  firstLastName: string = '';
  secondLastName: string = '';
  phone: string = '';
  birthDate: string = '2024-05-01';
  email: string = '';
  genderId: number = 1;
  gender: string = '';
  addressId: number = 1;
  streetNumber: string = '';
  interiorNumber: string = '';
  housingId: string = '';
  housingCategory: string = '';
  streetId: string = '';
  streetName: string = '';
  neighborhoodId: number = 1;
  neighborhoodName: string = '';
  localityId: string = '';
  localityName: string = '';
  postalCode: string = '';
  municipalityId: string = '';
  municipalityName: string = '';
  stateId: string = '';
  stateName: string = '';
  maritalStatusId: number = 1;
  occupationId: number = 1;
  ethnicGroupId: number = 1;
  religionId: number = 1;
  guardianId: number = 1;
  guardianFirstName: string = '';
  guardianLastName: string = '';
  guardianPhone: string = '';
  guardianEmail: string = '';

  // Variables para buscar id's
  foundHousing: HousingData | undefined;

  findHousing(): void {
    const housingCategoryToFind = this.housingCategory;

    this.foundHousing = this.housingResponseData.find((housing) => {
      return housing.category === housingCategoryToFind;
    });

    if (this.foundHousing) {
      console.log('Se encontró el objeto de vivienda:');
      console.log(this.foundHousing);
    } else {
      console.log(
        'No se encontró ningún objeto de vivienda con la categoría proporcionada.'
      );
    }
  }

  // Buscar id genero
  foundGender: Genero | undefined;

  findGender(): void {
    const genderToFind = this.gender;

    this.foundGender = this.genderData.find((gender) => {
      return gender.gender === genderToFind;
    });

    if (this.foundGender) {
      console.log('Se encontró el género:');
      console.log(this.foundGender);
    } else {
      console.log('No se encontró ningún género con el nombre proporcionado.');
    }
  }

  // Buscar id calle
  foundStreet: AddressData | undefined;

  findStreet(): void {
    const streetNameToFind = this.streetName;

    this.foundStreet = this.streetsData.find((street) => {
      return street.name === streetNameToFind;
    });

    if (this.foundStreet) {
      console.log('Se encontró la calle:');
      console.log(this.foundStreet);
    } else {
      console.log('No se encontró ninguna calle con el nombre proporcionado.');
    }
  }

  createPatient() {
    // Buscando vivienda
    if (!this.foundHousing) {
      console.error('No se ha encontrado ninguna vivienda.');
      return;
    }

    // Buscando genero
    if (!this.foundGender) {
      console.error('No se ha encontrado ningún género.');
      return;
    }

    // Buscando calle
    if (!this.foundStreet) {
      console.error('No se ha encontrado ninguna calle.');
      return;
    }

    const patient = {
      idPatient: this.idPatient,
      admissionDate: this.admissionDate,
      isMinor: this.isMinor,
      hasDisability: this.hasDisability,
      nationalityId: this.nationalityId,
      person: {
        curp: this.curp,
        firstName: this.firstName,
        secondName: this.secondName,
        firstLastName: this.firstLastName,
        secondLastName: this.secondLastName,
        phone: this.phone,
        birthDate: this.birthDate,
        email: this.email,
        gender: {
          idGender: this.foundGender.idGender,
          gender: this.gender,
        },
      },
      address: {
        idAddress: this.addressId,
        streetNumber: this.streetNumber,
        interiorNumber: this.interiorNumber,
        housing: {
          idHousing: this.foundHousing.idHousing,
          category: this.housingCategory,
        },
        street: {
          idStreet:this.foundStreet.idStreet,
          name:  this.streetName,
          neighborhood: {
            idNeighborhood: this.neighborhoodId,
            name: this.neighborhoodName,
            locality: {
              idLocality: this.localityId,
              name: this.localityName,
              postalCode: this.postalCode,
              municipality: {
                idMunicipality: this.municipalityId,
                name: this.municipalityName,
                state: {
                  idState: this.stateId,
                  name: this.stateName,
                },
              },
            },
          },
        },
      },
      maritalStatusId: this.maritalStatusId,
      occupationId: this.occupationId,
      ethnicGroupId: this.ethnicGroupId,
      religionId: this.religionId,
      guardian: {
        idGuardian: this.guardianId,
        firstName: this.guardianFirstName,
        lastName: this.guardianLastName,
        phone: this.guardianPhone,
        email: this.guardianEmail,
      },
    };

    console.log(patient);

    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_PATIENT}`,
        data: patient,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          console.log('solicitudpost');
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }
}
