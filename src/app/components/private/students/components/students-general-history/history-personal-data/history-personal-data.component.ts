import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import { Observable, map, startWith } from 'rxjs';


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
  // Crear un observable que devuelve un arreglo de strings que representan las nacionalidades filtradas
  filteredNationality: Observable<string[]>;
  filteredEthnicGroup: Observable<string[]>;
  filteredOcupations: Observable<string[]>;
  filteredMaritalStatus: Observable<string[]>;

  // Método que se encarga de filtrar las nacionalidades según el valor de búsqueda
  private _filter(value: string): string[] {
    // Normalizar el valor de búsqueda para que sea case-insensitive y sin espacios en blanco
    const filterValue = this._normalizeValue(value);
    // Convertir el arreglo de objetos nationalityData en un arreglo de strings que representan las nacionalidades
    return this.nationalityData.map(nacionalidad => nacionalidad.nationality).filter(nationalityData => this._normalizeValue(nationalityData).includes(filterValue));
  }

  // Método que se encarga de filtrar los grupos etnicos según el valor de búsqueda
  private _filterEthnicGroup(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.ethnicGroupData.map(ethnicGroup => ethnicGroup.ethnicGroup).filter(ethnicGroupData => this._normalizeValue(ethnicGroupData).includes(filterValue));
  }

  // Método que se encarga de filtrar las ocupaciones según el valor de búsqueda
  private _filterOcupations(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.occupationData.map(ocupacion => ocupacion.occupation).filter(occupationData => this._normalizeValue(occupationData).includes(filterValue));
  }

  // Método que se encarga de filtrar las ocupaciones según el valor de búsqueda
  private _filterMaritalStatus(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.maritalStatusData.map(maritalSts => maritalSts.maritalStatus).filter(maritalStatusData => this._normalizeValue(maritalStatusData).includes(filterValue));
  }


  // Método que se encarga de normalizar el valor de búsqueda
  private _normalizeValue(value: string): string {
    // Convertir el valor a minúsculas
    return value.toLowerCase().replace(/\s/g, '');
  }

  birthDate: string;
  youngerForm: boolean = false;

  private apiService = inject(ApiService<Religion>);

  constructor() 
  {
    this.birthDate = ''; // Inicializamos la propiedad en el constructor
    // Inicializamos la propiedades oara filtros
    this.filteredNationality = new Observable<string[]>(); 
    this.filteredEthnicGroup = new Observable<string[]>();
    this.filteredOcupations = new Observable<string[]>();
    this.filteredMaritalStatus = new Observable<string[]>();

  }
  ngOnInit(): void {
    this.getReligion();
    this.getNacionality();
    this.getOcupation();
    this.getMaritalStatus();
    this.getEthnicGroup();
    this.getLocality();
    this.getGender();

    // Crear un observable que devuelve un arreglo de strings que representan las nacionalidades filtradas
    this.filteredNationality = this.controlNationality.valueChanges.pipe(
      // Inicializar el observable con un valor vacío para que se muestren todas las nacionalidades al principio
      startWith(''),
      // Cuando el valor del control cambia, aplicar el método _filter para filtrar las nacionalidades
      map(value => this._filter(value || '')),
    );

    // Crear un observable que devuelve un arreglo de strings que representan los grupos etnicos filtrados
    this.filteredEthnicGroup = this.controlEthnicGroup.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEthnicGroup(value || '')),
    );

    // Crear un observable que devuelve un arreglo de strings que representan las ocupaciones filtradas
    this.filteredOcupations = this.controlOcupation.valueChanges.pipe(
      startWith(''),
      map(value => this._filterOcupations(value || '')),
    );

    // Crear un observable que devuelve un arreglo de strings que representan los estados civiles filtrados
    this.filteredMaritalStatus = this.controlMaritalStatus.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMaritalStatus(value || '')),
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
          console.log(this.religionData);


        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Nacionalidad
  nationalityData: Nacionalidad[]=[];
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
          console.log(this.nationalityData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Ocupacion
  occupationData: Ocupacion[]=[];
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
          console.log('ocupacion',this.occupationData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

  // Estado civil 
  maritalStatusData: EstadoCivil[]=[];
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
          console.log(this.maritalStatusData);
        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

   // Grupo etnico
   ethnicGroupData: GrupoEtnico[]=[];
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
           console.log(this.ethnicGroupData);
         },
         error: (error) => {
           console.error('Error en la autenticación:', error);
         },
       });
   }

   // Localidad
   localityData: Localidad[]=[];
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
           console.log(this.localityData);
         },
         error: (error) => {
           console.error('Error en la autenticación:', error);
         },
       });
   }

   // Genero
   genderData: Genero[]=[];
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
