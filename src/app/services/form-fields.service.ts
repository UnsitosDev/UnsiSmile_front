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
        const neighborhoodField = this.addressFields.find(field => field.name === FieldNames.NEIGHBORHOOD_NAME);
    
        // Permitir entrada manual
        if (neighborhoodField && searchTerm) {
            neighborhoodField.value = searchTerm;
        }
    
        const effectiveLocalityId = localityId || this.selectedLocalitId;
    
        if (!effectiveLocalityId) {
            this.clearNeighborhoodOptions();
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getNeighborhoodDataPaginated(searchTerm, page, size, effectiveLocalityId).subscribe({
            next: (response) => {
                if (neighborhoodField) {
                    neighborhoodField.options = searchTerm ? response : this.limitOptions(response);
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
                        );
    
                        if (exactMatch) {
                            this.selectedNeighborhoodId = exactMatch.value;
                            neighborhoodField.value = exactMatch.label;
                            this.clearStreetOptions();
                            
                            if (this.selectedNeighborhoodId) {
                                this.handleStreetClick('', 0, 1000, this.selectedNeighborhoodId);
                            }
                        }
                    }
                }
            },
            error: (error) => {
                // Mantener este error para debugging
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
        const localityField = this.addressFields.find(field => field.name === FieldNames.LOCALITY_NAME);
    
        // Permitir entrada manual
        if (localityField && searchTerm) {
            localityField.value = searchTerm;
        }
    
        const effectiveMunicipalityId = municipalityId || this.selectedMunicipalityId;
    
        if (!effectiveMunicipalityId) {
            this.clearLocalityOptions();
            this.clearNeighborhoodOptions();
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getLocalityDataPaginated(searchTerm, page, size, effectiveMunicipalityId).subscribe({
            next: (response) => {
                if (localityField) {
                    localityField.options = searchTerm ? response : this.limitOptions(response);
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
                        );
    
                        if (exactMatch) {
                            this.selectedLocalitId = exactMatch.value;
                            localityField.value = exactMatch.label;
                            
                            this.clearNeighborhoodOptions();
                            this.clearStreetOptions();
                            
                            if (this.selectedLocalitId) {
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
        const municipalityField = this.addressFields.find(field => field.name === FieldNames.MUNICIPALITY_NAME);
    
        // Permitir entrada manual
        if (municipalityField && searchTerm) {
            municipalityField.value = searchTerm;
        }
    
        const effectiveStateId = stateId || this.selectedStateId;
    
        if (!effectiveStateId) {
            this.clearMunicipalityOptions();
            this.clearLocalityOptions();
            this.clearNeighborhoodOptions();
            return;
        }
    
        this.patientService.getMunicipalityDataPaginated(searchTerm, page, size, effectiveStateId).subscribe({
            next: (response) => {
                if (municipalityField) {
                    municipalityField.options = searchTerm ? response : this.limitOptions(response);
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
                        );
    
                        if (exactMatch) {
                            this.selectedMunicipalityId = exactMatch.value;
                            municipalityField.value = exactMatch.label;
                            
                            this.clearLocalityOptions();
                            this.clearNeighborhoodOptions();
                            
                            if (this.selectedMunicipalityId) {
                                this.handleLocalityClick('', 0, 1000, this.selectedMunicipalityId);
                            }
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
        const stateField = this.addressFields.find(field => field.name === FieldNames.STATE_NAME);
    
        // Si hay texto, actualizarlo directamente en el campo
        if (stateField && searchTerm) {
            stateField.value = searchTerm;
        }
    
        this.patientService.getStateDataPaginated(searchTerm, page, size).subscribe({
            next: (response) => {
                if (stateField) {
                    stateField.options = searchTerm ? response : this.limitOptions(response);
                    
                    if (searchTerm && searchTerm.trim() !== '') {
                        const exactMatch = response.find(option => 
                            option.label.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        
                        if (exactMatch) {
                            this.selectedStateId = exactMatch.value;
                            stateField.value = exactMatch.label;
                            
                            this.clearMunicipalityOptions();
                            this.clearLocalityOptions();
                            this.clearNeighborhoodOptions();
                            
                            if (this.selectedStateId) {
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
        const streetField = this.addressFields.find(field => field.name === FieldNames.STREET_NAME);
    
        // Permitir entrada manual
        if (streetField && searchTerm) {
            streetField.value = searchTerm;
        }
    
        const effectiveNeighborhoodId = neighborhoodId || this.selectedNeighborhoodId;
    
        if (!effectiveNeighborhoodId) {
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getStreetDataPaginated(searchTerm, page, size, effectiveNeighborhoodId).subscribe({
            next: (response) => {
                if (streetField) {
                    streetField.options = searchTerm ? response : this.limitOptions(response);
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
    
    private limitOptions(options: any[], limit: number = 4): any[] {
        return options.slice(0, limit);
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