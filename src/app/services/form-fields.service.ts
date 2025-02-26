import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { addressesNumber, curpValidator, emailValidator, noFutureDateValidator, phoneNumberValidator } from '../utils/validators';
import { PatientService } from './patient/patient.service';
import { FieldNames } from '../models/form-fields/form-utils';


@Injectable({
    providedIn: 'root'
})
export class FormFieldsService {
    patientService = inject(PatientService);
    // Agregar variable para mantener el ID del estado seleccionado
    private selectedStateId: string | undefined;
    private selectedMunicipalityId: string | undefined;
    private selectedLocalitId: string | undefined;
    private selectedNeighborhoodId: string | undefined;

    private personalDataFields: FormField[] = [
        {
            type: 'input',
            label: 'Primer Nombre',
            name: 'firstName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Primer Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Segundo Nombre',
            name: 'secondName',
            errorMessages: {
                required: 'El campo Segundo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Paterno',
            name: 'firstLastName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Paterno es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Materno',
            name: 'secondLastName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Materno es requerido.',
            }
        },
        {
            type: 'input',
            label: 'CURP',
            name: 'curp',
            validators: [Validators.required, curpValidator()],
            errorMessages: {
                required: 'El campo CURP es requerido.',
                lastError: 'Introduzca una CURP válida'
            },
        },
        {
            type: 'input',
            label: 'Teléfono',
            name: 'phone',
            required: false,
            validators: [phoneNumberValidator()],
            errorMessages: {
                lastError: 'Por favor, introduce un número de teléfono válido.'
            }
        },
        {
            type: 'datepicker',
            label: 'Fecha de Nacimiento',
            name: 'birthDate',
            required: true,
            validators: [Validators.required, noFutureDateValidator()],
            errorMessages: {
                required: 'El campo Fecha de nacimiento es requerido.',
                futureDate: 'La fecha de nacimiento no puede ser una fecha futura'
            }
        },
        {
            type: 'input',
            label: 'Correo electrónico',
            name: 'email',
            validators: [
                Validators.required,
                emailValidator()
            ],
            errorMessages: {
                required: 'El campo Correo electrónico es requerido.',
                lastError: 'Por favor, introduce un correo electrónico válido (ejemplo: usuario@dominio.com)'
            }
        },
        {
            type: 'select',
            label: 'Género',
            name: 'gender',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo GENERO es requerido.'
            },
            onClick: this.handleGenderClick.bind(this)
        },
    ];

    private addressFields: FormField[] = [
        {
            type: 'autocomplete',
            label: 'Nombre de estado',
            name: 'stateName',
            value: this.patientService.state,
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de estado es requerido.'
            },
            onInputChange: {
                changeFunction: this.handleStateClick.bind(this),
                length: 5
            }
        },
        {
            type: 'inputEvent',
            label: 'Código postal',
            name: 'postalCode',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Código postal es requerido.'
            },
            onInputChange: {
                changeFunction: this.handlePostalCodeClick.bind(this),
                length: 5
            }
        },
        {
            type: 'autocomplete',
            label: 'Nombre de municipio',
            name: 'municipalityName',
            value: this.patientService.municipality,
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de municipio es requerido.'
            },
            onInputChange: {
                changeFunction: this.handleMunicipalityClick.bind(this),
                length: 5
            }
        },
        {
            type: 'autocomplete',
            label: 'Nombre de localidad',
            name: 'localityName',
            value: this.patientService.locality,
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de localidad es requerido.'
            },
            onInputChange: {
                changeFunction: this.handleLocalityClick.bind(this),
                length: 5
            }
        },
        {
            type: 'autocomplete',
            label: 'Nombre de colonia',
            name: 'neighborhoodName',
            required: false,
            errorMessages: {
                required: 'El campo Nombre de colonia es requerido.'
            },
            onInputChange: {
            changeFunction: this.handleNeighborhoodClick.bind(this),
            length: 5
                     }
        },
        {
            type: 'autocompleteoptions',
            label: 'Nombre de calle',
            name: 'streetName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de calle es requerido.'
            },
            onInputChange: {
                changeFunction: this.handleStreetClick.bind(this),
                length: 5
            }
        },
        {
            type: 'input',
            label: 'Número Exterior',
            name: 'exteriorNumber',
            required: true,
            validators: [Validators.required, addressesNumber()],
            errorMessages: {
                required: 'El campo Número Exterior es requerido.',
                lastError: 'El campo Número Exterior debe contener solo números.'
            }
        },
        {
            type: 'input',
            label: 'Número Interior',
            name: 'interiorNumber',
            validators: [addressesNumber()],
            errorMessages: {
                lastError: 'El campo Número Interior debe contener solo números.'
            }
        },
        {
            type: 'select',
            label: 'Categoría de vivienda',
            name: 'housingCategory',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Categoría de vivienda es requerido.'
            },
            onClick: this.handleHousingClick.bind(this)
        }
    ];

    private otherDataFields: FormField[] = [
        {
            type: 'select',
            label: 'Nacionalidad',
            name: 'nationality',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nacionalidad es requerido.'
            },
            onClick: this.handleNacionalityClick.bind(this)
        },
        {
            type: 'select',
            label: 'Estado civil',
            name: 'maritalStatus',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Estado civil es requerido.'
            },
            onClick: this.handleMaritalStatusClick.bind(this)
        },
        {
            type: 'select',
            label: 'Ocupación',
            name: 'occupation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Ocupación es requerido.'
            },
            onClick: this.handleOcupationClick.bind(this)
        },
        {
            type: 'autocompleteoptions',
            label: 'Grupo étnico',
            name: 'ethnicGroup',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Grupo étnico es opcional.'
            },
            onInputChange: {
                changeFunction: this.handleEthnicGroupClick.bind(this),
                length: 5
            }
        },
        {
            type: 'autocompleteoptions',
            label: 'Religión',
            name: 'religion',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Religión es opcional.'
            },
            onInputChange: {
                changeFunction: this.handleReligionClick.bind(this),
                length: 5
            }

        },
        {
            type: 'datepicker',
            label: 'Última Consulta',
            name: 'lastConsultation',
            required: true,
            validators: [Validators.required, noFutureDateValidator()],
            errorMessages: {
                futureDate: 'La fecha de última consulta no puede ser una fecha futura'
            }
        },
        {
            type: 'input',
            label: 'Motivo de Consulta',
            name: 'consultationReason',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Motivo de Consulta es requerido.'
            }
        },

    ];

    private guardianFields: FormField[] = [
        {
            type: 'input',
            label: 'Nombre',
            name: 'firstGuardianName',
            required: false,
            errorMessages: {
                required: 'El campo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido',
            name: 'lastGuardianName',
            required: false,
            errorMessages: {
                required: 'El campo Apellido es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Teléfono',
            name: 'phoneGuardian',
            required: false,
            validators: [phoneNumberValidator()],
            errorMessages: {
                lastError: 'Por favor, introduce un número de teléfono válido.'
            }
        },
        {
            type: 'input',
            label: 'Correo Electrónico',
            name: 'emailGuardian',
            required: false,
            validators: [emailValidator()],
            errorMessages: {
                lastError: 'Por favor, introduce un correo electrónico válido (ejemplo: usuario@dominio.com)'
            }
        },
    ];


    // Eventos

    constructor() {
        this.handleGenderClick({} as MouseEvent);
        this.handleHousingClick({} as MouseEvent);
        //this.handleStretClick({} as MouseEvent);
        //this.handleNeighborhoodClick({} as MouseEvent);
        this.handleNacionalityClick({} as MouseEvent);
        this.handleMaritalStatusClick({} as MouseEvent);
        this.handleOcupationClick({} as MouseEvent);
    }

    private handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        const genderField = this.personalDataFields.find(field => field.name === FieldNames.GENDER);
        genderField && (genderField.options = this.patientService.genderOptions);
    }

    private handleHousingClick(event: MouseEvent): void {
        this.patientService.getHousingData();
        const housingField = this.addressFields.find(field => field.name === FieldNames.HOUSING_CATEGORY);
        housingField && (housingField.options = this.patientService.housingOptions);
    }

    private handleStretClick(searchTerm: string, page: number = 0, size: number = 3): void {
        this.patientService.getStreetDataPaginated(searchTerm, page, size).subscribe(response => {
        const streetsField = this.addressFields.find(field => field.name === FieldNames.STREET_NAME);
        streetsField && (streetsField.options = this.patientService.streetsOptions);
    });
    }


    public handleNeighborhoodClick(searchTerm: string, page: number = 0, size: number = 3, localityId?: string): void {
        console.log('handleNeighborhoodClick called with:', {
            searchTerm,
            page,
            size,
            localityId,
            selectedLocalityId: this.selectedLocalitId
        });
    
        const effectiveLocalityId = localityId || this.selectedLocalitId;
        console.log('Effective localityId:', effectiveLocalityId);
    
        if (!effectiveLocalityId) {
            console.log('No localityId provided, clearing options');
            this.clearNeighborhoodOptions();
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getNeighborhoodDataPaginated(searchTerm, page, size, effectiveLocalityId).subscribe({
            next: (response) => {
                console.log('Neighborhood API response:', response);
                const neighborhoodField = this.addressFields.find(field => field.name === FieldNames.NEIGHBORHOOD_NAME);
                if (neighborhoodField) {
                    neighborhoodField.options = response;
                    console.log('Updated neighborhood options:', neighborhoodField.options);
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const searchTermLower = searchTerm.toLowerCase().trim();
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTermLower)
                        );
                        console.log('Exact match found:', exactMatch);
    
                        if (exactMatch) {
                            this.selectedNeighborhoodId = exactMatch.value;
                            console.log('Selected neighborhood ID:', this.selectedNeighborhoodId);
                            
                            // Actualizar el valor del campo
                            neighborhoodField.value = exactMatch.label;
                            
                            // Limpiar y cargar calles
                            this.clearStreetOptions();
                            if (this.selectedNeighborhoodId) {
                                console.log('Loading streets for neighborhood:', this.selectedNeighborhoodId);
                                this.handleStreetClick('', 0, 1000, this.selectedNeighborhoodId);
                            }
                        }
                    }
                }
            },
            error: (error) => {
                console.error('Error fetching neighborhoods:', error);
            }
        });
    }
    
    private clearNeighborhoodOptions(): void {
        const neighborhoodField = this.addressFields.find(field => field.name === FieldNames.NEIGHBORHOOD_NAME);
        if (neighborhoodField) {
            neighborhoodField.options = [];
            if (neighborhoodField.value) {
                neighborhoodField.value = '';
            }
        }
    }
    
    public handleLocalityClick(searchTerm: string, page: number = 0, size: number = 3, municipalityId?: string): void {
        console.log('handleLocalityClick called with:', {
            searchTerm,
            page,
            size,
            municipalityId,
            selectedMunicipalityId: this.selectedMunicipalityId
        });
    
        const effectiveMunicipalityId = municipalityId || this.selectedMunicipalityId;
        console.log('Effective municipalityId:', effectiveMunicipalityId);
    
        if (!effectiveMunicipalityId) {
            console.log('No municipalityId provided, clearing options');
            this.clearLocalityOptions();
            this.clearNeighborhoodOptions();
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getLocalityDataPaginated(searchTerm, page, size, effectiveMunicipalityId).subscribe({
            next: (response) => {
                console.log('Locality API response:', response);
                const localityField = this.addressFields.find(field => field.name === FieldNames.LOCALITY_NAME);
                if (localityField) {
                    localityField.options = response;
                    console.log('Updated locality options:', localityField.options);
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const searchTermLower = searchTerm.toLowerCase().trim();
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTermLower)
                        );
                        console.log('Exact match found:', exactMatch);
    
                        if (exactMatch) {
                            this.selectedLocalitId = exactMatch.value;
                            console.log('Selected locality ID:', this.selectedLocalitId);
                            
                            // Actualizar el valor del campo
                            localityField.value = exactMatch.label;
                            
                            // Limpiar campos dependientes
                            this.clearNeighborhoodOptions();
                            this.clearStreetOptions();
                            
                            // Cargar colonias con el ID de localidad
                            if (this.selectedLocalitId) {
                                console.log('Loading neighborhoods for locality:', this.selectedLocalitId);
                                this.handleNeighborhoodClick('', 0, 1000, this.selectedLocalitId);
                            }
                        }
                    }
                }
            },
            error: (error) => {
                console.error('Error fetching localities:', error);
            }
        });
    }
    
    private clearLocalityOptions(): void {
        const localityField = this.addressFields.find(field => field.name === FieldNames.LOCALITY_NAME);
        if (localityField) {
            localityField.options = [];
            // También limpiar el valor seleccionado si existe
            if (localityField.value) {
                localityField.value = '';
            }
        }
    }

    public handleMunicipalityClick(searchTerm: string, page: number = 0, size: number = 3, stateId?: string): void {
        console.log('handleMunicipalityClick called with:', {
            searchTerm,
            page,
            size,
            stateId,
            selectedStateId: this.selectedStateId,
            currentMunicipalityId: this.selectedMunicipalityId
        });
    
        const effectiveStateId = stateId || this.selectedStateId;
        console.log('Effective stateId:', effectiveStateId);
    
        if (!effectiveStateId) {
            console.log('No stateId provided, clearing options');
            this.clearMunicipalityOptions();
            this.clearLocalityOptions();
            this.clearNeighborhoodOptions();
            return;
        }
    
        this.patientService.getMunicipalityDataPaginated(searchTerm, page, size, effectiveStateId).subscribe({
            next: (response) => {
                console.log('Municipality API response:', response);
                const municipalityField = this.addressFields.find(field => field.name === FieldNames.MUNICIPALITY_NAME);
                if (municipalityField) {
                    municipalityField.options = response;
                    console.log('Updated municipality options:', municipalityField.options);
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const searchTermLower = searchTerm.toLowerCase().trim();
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTermLower)
                        );
                        console.log('Searching for match with term:', searchTermLower);
                        console.log('Exact match found:', exactMatch);
    
                        if (exactMatch) {
                            this.selectedMunicipalityId = exactMatch.value;
                            console.log('Selected municipality ID:', this.selectedMunicipalityId);
                            
                            // Actualizar el valor del campo
                            municipalityField.value = exactMatch.label;
                            
                            this.clearLocalityOptions();
                            this.clearNeighborhoodOptions();
                            
                            // Solo cargar localidades si tenemos un ID válido
                            if (this.selectedMunicipalityId) {
                                console.log('Loading localities for municipality:', this.selectedMunicipalityId);
                                this.handleLocalityClick('', 0, 1000, this.selectedMunicipalityId);
                            }
                        } else {
                            console.log('No exact match found, keeping current municipality:', this.selectedMunicipalityId);
                        }
                    }
                }
            },
            error: (error) => {
                console.error('Error fetching municipalities:', error);
            }
        });
    }
    

    private clearMunicipalityOptions(): void {
        const municipalityField = this.addressFields.find(field => field.name === FieldNames.MUNICIPALITY_NAME);
        if (municipalityField) {
            municipalityField.options = [];
            if (municipalityField.value) {
                municipalityField.value = '';
            }
        }
        this.selectedMunicipalityId = undefined;
    }

    public handleStateClick(searchTerm: string, page: number = 0, size: number = 3): void {
        console.log('handleStateClick called with:', { searchTerm, page, size });
        
        this.patientService.getStateDataPaginated(searchTerm, page, size).subscribe({
            next: (response) => {
                console.log('State API response:', response);
                const stateField = this.addressFields.find(field => field.name === FieldNames.STATE_NAME);
                if (stateField) {
                    stateField.options = response;
                    console.log('Updated state options:', stateField.options);
                    
                    if (searchTerm && searchTerm.trim() !== '') {
                        // Modificada la lógica de búsqueda para ser más flexible
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        console.log('Trying to match:', {
                            searchTerm: searchTerm.toLowerCase(),
                            options: response.map(opt => opt.label.toLowerCase())
                        });
                        console.log('Found match:', exactMatch);
                        
                        if (exactMatch) {
                            this.selectedStateId = exactMatch.value;
                            console.log('Setting selectedStateId to:', this.selectedStateId);
                            
                            // Actualizar el valor del campo
                            stateField.value = exactMatch.label;
                            
                            this.clearMunicipalityOptions();
                            this.clearLocalityOptions();
                            this.clearNeighborhoodOptions();
                            
                            // Asegurarnos de que el ID existe antes de hacer la llamada
                            if (this.selectedStateId) {
                                console.log('Triggering municipality load with stateId:', this.selectedStateId);
                                this.handleMunicipalityClick('', 0, 1000, this.selectedStateId);
                            }
                        }
                    }
                }
            },
            error: (error) => {
                console.error('Error fetching states:', error);
            }
        });
    }
    

    private handleNacionalityClick(event: MouseEvent): void {
        this.patientService.getNacionalityData();
        const nationalityField = this.otherDataFields.find(field => field.name === FieldNames.NATIONALITY);
        nationalityField && (nationalityField.options = this.patientService.nationalityOptions);
    }

    private handleMaritalStatusClick(event: MouseEvent): void {
        this.patientService.getMaritalStatusData();
        const maritalStatusField = this.otherDataFields.find(field => field.name === FieldNames.MARITAL_STATUS);
        maritalStatusField && (maritalStatusField.options = this.patientService.maritalStatusOptions);
    }

    private handleOcupationClick(event: MouseEvent): void {
        this.patientService.getOcupationData();
        const occupationField = this.otherDataFields.find(field => field.name === FieldNames.OCCUPATION);
        occupationField && (occupationField.options = this.patientService.occupationOptions);
    }

    private handleEthnicGroupClick(searchTerm: string, page: number = 0, size: number = 3): void {
        this.patientService.getEthnicGroupDataPaginated(searchTerm, page, size).subscribe(response => {
            const ethnicGroupField = this.otherDataFields.find(field => field.name === FieldNames.ETHNIC_GROUP);
            ethnicGroupField && (ethnicGroupField.options = this.patientService.ethnicGroupOptions);
        });
    }


    private handleReligionClick(searchTerm: string, page: number = 0, size: number = 3): void {
        this.patientService.getReligionDataPaginated(searchTerm, page, size).subscribe(response => {
            const religionField = this.otherDataFields.find(field => field.name === FieldNames.RELIGION);
            religionField && (religionField.options = this.patientService.religionOptions);
        });
    }

    private handlePostalCodeClick(param: string): void {
        this.patientService.getPostalCode(param);
    }

    public handleStreetClick(searchTerm: string, page: number = 0, size: number = 3, neighborhoodId?: string): void {
        console.log('handleStreetClick called with:', {
            searchTerm,
            page,
            size,
            neighborhoodId,
            selectedNeighborhoodId: this.selectedNeighborhoodId
        });
    
        const effectiveNeighborhoodId = neighborhoodId || this.selectedNeighborhoodId;
    
        if (!effectiveNeighborhoodId) {
            console.log('No neighborhoodId provided, clearing options');
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getStreetDataPaginated(searchTerm, page, size, effectiveNeighborhoodId).subscribe({
            next: (response) => {
                console.log('Street API response:', response);
                const streetField = this.addressFields.find(field => field.name === FieldNames.STREET_NAME);
                if (streetField) {
                    streetField.options = response;
                    console.log('Updated street options:', streetField.options);
                }
            },
            error: (error) => {
                console.error('Error fetching streets:', error);
            }
        });
    }
    
    private clearStreetOptions(): void {
        const streetField = this.addressFields.find(field => field.name === FieldNames.STREET_NAME);
        if (streetField) {
            streetField.options = [];
            if (streetField.value) {
                streetField.value = '';
            }
        }
    }
    
    // Formularios
    getPersonalDataFields(): FormField[] {
        return this.personalDataFields;
    }

    getAddressFields(): FormField[] {
        return this.addressFields;
    }

    getOtherDataFields(): FormField[] {
        return this.otherDataFields;
    }

    getGuardianDataFields(): FormField[] {
        return this.guardianFields;
    }
}