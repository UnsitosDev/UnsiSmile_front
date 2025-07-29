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
            type: 'inputEvent',
            label: 'CURP',
            name: 'curp',
            placeholder: 'Ej: GALJ901231HDFNNS09',
            validators: [Validators.required, curpValidator()],
            errorMessages: {
                required: 'El campo CURP es requerido.',
                lastError: 'Introduzca una CURP válida'
            },
            onInputChange: {
                changeFunction: this.handleCurpChange.bind(this),
                length: 18
            }
        },
        {
            type: 'input',
            label: 'Primer Nombre',
            name: 'firstName',
            placeholder: 'Ej: Juan',
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
            placeholder: 'Ej: Carlos',
            errorMessages: {
                required: 'El campo Segundo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Paterno',
            name: 'firstLastName',
            placeholder: 'Ej: García',
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
            placeholder: 'Ej: López',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Materno es requerido.',
            }
        },
        {
            type: 'input',
            label: 'Teléfono',
            name: 'phone',
            placeholder: 'Ej: 9511234567',
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
            placeholder: 'DD/MM/AAAA',
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
            placeholder: 'Ej: ejemplo@dominio.com',
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
        {
            type: 'select',
            label: 'Discapacidad',
            name: 'hasDisability',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 'true', label: 'Sí' },
                { value: 'false', label: 'No' }
            ],
            errorMessages: {
                required: 'El campo Discapacidad es requerido.'
            }
        },
    ];

    private addressFields: FormField[] = [
        {
            type: 'inputEvent',
            label: 'Código postal',
            name: 'postalCode',
            placeholder: 'Ej: 68000',
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
            label: 'Nombre de estado',
            name: 'stateName',
            placeholder: 'Ej: Oaxaca',
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
            type: 'autocomplete',
            label: 'Nombre de municipio',
            name: 'municipalityName',
            placeholder: 'Ej: Oaxaca de Juárez',
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
            placeholder: 'Ej: Centro',
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
            placeholder: 'Ej: Reforma',
            required: true,
            validators: [Validators.required],
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
            placeholder: 'Ej: Independencia',
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
            placeholder: 'Ej: 123',
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
            placeholder: 'Ej: 4',
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
            type: 'autocompleteoptions',
            label: 'Nacionalidad',
            name: 'nationality',
            placeholder: 'Ej: Mexicana',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nacionalidad es requerido.'
            },
            onInputChange: {
                changeFunction: this.handleNationalityClick.bind(this),
                length: 1
            }
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
            type: 'autocompleteoptions',
            label: 'Ocupación',
            name: 'occupation',
            placeholder: 'Ej: Actor',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Ocupación es requerido.'
            },
            onInputChange: {
                changeFunction: this.handleOcupationClick.bind(this),
                length: 1  // Cambiar de 2 a 1 para que se active inmediatamente
            }
        },
        {
            type: 'autocompleteoptions',
            label: 'Grupo étnico',
            name: 'ethnicGroup',
            placeholder: 'Ej: No especificada',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Grupo étnico es requerido'
            },
            onInputChange: {
                changeFunction: this.handleEthnicGroupClick.bind(this),
                length: 1
            }
        },
        {
            type: 'autocompleteoptions',
            label: 'Religión',
            name: 'religion',
            placeholder: 'Ej: Religión no especificada',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Religión es requerido'
            },
            onInputChange: {
                changeFunction: this.handleReligionClick.bind(this),
                length: 1
            }
        },
        {
            type: 'datepicker',
            label: 'Última Consulta',
            name: 'lastConsultation',
            placeholder: 'DD/MM/AAAA',
            required: true,
            validators: [Validators.required, noFutureDateValidator()],
            errorMessages: {
                futureDate: 'La fecha de última consulta no puede ser una fecha futura'
            }
        },

    ];

    private guardianFields: FormField[] = [
        {
            type: 'inputEvent',
            label: 'CURP',
            name: 'guardianCurp',
            placeholder: 'Ej: GALJ901231HDFNNS09',
            validators: [Validators.required, curpValidator()],
            errorMessages: {
                required: 'El campo CURP es requerido.',
                lastError: 'Introduzca una CURP válida'
            },
            onInputChange: {
                changeFunction: this.handleGuardianCurpChange.bind(this),
                length: 18
            }
        },
        {
            type: 'input',
            label: 'Nombre',
            name: 'firstGuardianName',
            placeholder: 'Ej: María',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Segundo Nombre',
            name: 'secondGuardianName',
            placeholder: 'Ej: Guadalupe',
            required: false,
            errorMessages: {
                required: 'El campo Segundo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Paterno',
            name: 'lastGuardianName',
            placeholder: 'Ej: Sánchez',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Paterno es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Materno',
            name: 'secondLastGuardianName',
            placeholder: 'Ej: Torres',
            required: true,
            errorMessages: {
                required: 'El campo Apellido Materno es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Teléfono',
            name: 'phoneGuardian',
            placeholder: 'Ej: 9511234567',
            required: true,
            validators: [Validators.required, phoneNumberValidator()],
            errorMessages: {
                required: 'El campo Teléfono es requerido.',
                lastError: 'Por favor, introduce un número de teléfono válido.'
            }
        },
        {
            type: 'input',
            label: 'Correo Electrónico',
            name: 'emailGuardian',
            placeholder: 'Ej: ejemplo@dominio.com',
            required: true,
            validators: [Validators.required, emailValidator()],
            errorMessages: {
                required: 'El campo Correo Electrónico es requerido.',
                lastError: 'Por favor, introduce un correo electrónico válido (ejemplo: usuario@dominio.com)'
            }
        },
        {
            type: 'select',
            label: 'Estado civil de los padres',
            name: 'parentsMaritalStatus',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Estado civil de los padres es requerido.'
            },
            onClick: this.handleParentsMaritalStatusClick.bind(this)
        },
        {
            type: 'input',
            label: 'Pediatra o Médico Familiar',
            name: 'doctorName',
            placeholder: 'Ej: Dr. Juan Pérez',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Pediatra o Médico Familiar es requerido.'
            }
        },
        {
            type: 'select',
            label: 'Género',
            name: 'guardianGender',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Género es requerido.'
            },
            onClick: this.handleGuardianGenderClick.bind(this)  // Cambio aquí para usar un manejador específico
        },
        {
            type: 'datepicker',
            label: 'Fecha de Nacimiento',
            name: 'guardianBirthDate',
            placeholder: 'DD/MM/AAAA',
            required: true,
            validators: [Validators.required, noFutureDateValidator()],
            errorMessages: {
                required: 'El campo Fecha de nacimiento es requerido.',
                futureDate: 'La fecha de nacimiento no puede ser una fecha futura'
            }
        },
    ];


    // Eventos

    constructor() {
        this.handleGenderClick({} as MouseEvent);
        this.handleGuardianGenderClick({} as MouseEvent); // Añadir inicialización para género del guardián
        this.handleHousingClick({} as MouseEvent);
        this.handleNacionalityClick({} as MouseEvent);
        this.handleMaritalStatusClick({} as MouseEvent);
        this.handleParentsMaritalStatusClick({} as MouseEvent);
        // Removemos la carga automática de ocupaciones para que solo aparezcan al escribir
    }

    private handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        const genderField = this.personalDataFields.find(field => field.name === FieldNames.GENDER);
        genderField && (genderField.options = this.patientService.genderOptions);
    }

    // Nuevo método específico para el género del guardián
    private handleGuardianGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        const guardianGenderField = this.guardianFields.find(field => field.name === 'guardianGender');
        guardianGenderField && (guardianGenderField.options = this.patientService.genderOptions);
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
    
        // Usar el ID de localidad proporcionado o el almacenado
        const effectiveLocalityId = localityId || this.selectedLocalitId;
        
        // Si se proporciona un nuevo ID de localidad, almacenarlo
        if (localityId) {
            this.selectedLocalitId = localityId;
        }
    
        if (!effectiveLocalityId) {
            this.clearNeighborhoodOptions();
            this.clearStreetOptions();
            return;
        }
    
        this.patientService.getNeighborhoodDataPaginated(searchTerm, page, size, effectiveLocalityId).subscribe({
            next: (response) => {
                if (neighborhoodField) {                    // Mostrar las opciones sin filtrar inicialmente
                    neighborhoodField.options = response;
    
                    if (searchTerm && searchTerm.trim() !== '') {
                        // Buscar coincidencia parcial (como en los otros campos)
                        const match = response.find(option => 
                            option.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
                        );
    
                        if (match) {
                            this.selectedNeighborhoodId = match.value;
                            neighborhoodField.value = match.label;
    
                            // Cargar las calles solo cuando se selecciona una colonia
                            if (this.selectedNeighborhoodId) {
                                this.handleStreetClick('', 0, 1000, this.selectedNeighborhoodId);
                            }
                        }
                    }
                }
            },
            error: (error) => {
                console.error('Error al obtener colonias:', error);
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
        // Solo limpiar el ID de colonia, mantener el de localidad
        this.selectedNeighborhoodId = undefined;
        this.clearStreetOptions();
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
    

    // Modificar el método handleNationalityClick para cargar más opciones
    private handleNationalityClick(searchTerm: string, page: number = 0, size: number = 15): void {
        // Solo buscar si hay un término de búsqueda
        if (!searchTerm || searchTerm.trim() === '') {
            // Si no hay término de búsqueda, limpiar las opciones
            const nationalityField = this.otherDataFields.find(field => field.name === FieldNames.NATIONALITY);
            if (nationalityField) {
                nationalityField.options = [];
            }
            return;
        }
        
        this.patientService.getNationalityDataPaginated(searchTerm, page, size).subscribe({
            next: (response) => {
                const nationalityField = this.otherDataFields.find(field => field.name === FieldNames.NATIONALITY);
                if (nationalityField) {
                    nationalityField.options = response;
                }
            },
            error: (error) => {
                console.error('Error al obtener nacionalidades:', error);
                // En caso de error, limpiar las opciones
                const nationalityField = this.otherDataFields.find(field => field.name === FieldNames.NATIONALITY);
                if (nationalityField) {
                    nationalityField.options = [];
                }
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

    private handleOcupationClick(searchTerm: string, page: number = 0, size: number = 15): void {
        // Solo buscar si hay un término de búsqueda
        if (!searchTerm || searchTerm.trim() === '') {
            // Si no hay término de búsqueda, limpiar las opciones
            const occupationField = this.otherDataFields.find(field => field.name === FieldNames.OCCUPATION);
            if (occupationField) {
                occupationField.options = [];
            }
            return;
        }
        
        this.patientService.getOcupationDataPaginated(searchTerm, page, size).subscribe({
            next: (response) => {
                const occupationField = this.otherDataFields.find(field => field.name === FieldNames.OCCUPATION);
                if (occupationField) {
                    occupationField.options = this.patientService.occupationOptions;
                }
            },
            error: (error) => {
                console.error('Error al obtener ocupaciones:', error);
                // En caso de error, limpiar las opciones
                const occupationField = this.otherDataFields.find(field => field.name === FieldNames.OCCUPATION);
                if (occupationField) {
                    occupationField.options = [];
                }
            }
        });
    }

    private handleEthnicGroupClick(searchTerm: string, page: number = 0, size: number = 15): void {
        // Solo buscar si hay un término de búsqueda
        if (!searchTerm || searchTerm.trim() === '') {
            // Si no hay término de búsqueda, limpiar las opciones
            const ethnicGroupField = this.otherDataFields.find(field => field.name === FieldNames.ETHNIC_GROUP);
            if (ethnicGroupField) {
                ethnicGroupField.options = [];
            }
            return;
        }
        
        this.patientService.getEthnicGroupDataPaginated(searchTerm, page, size).subscribe({
            next: (response) => {
                const ethnicGroupField = this.otherDataFields.find(field => field.name === FieldNames.ETHNIC_GROUP);
                if (ethnicGroupField) {
                    ethnicGroupField.options = this.patientService.ethnicGroupOptions;
                }
            },
            error: (error) => {
                console.error('Error al obtener grupos étnicos:', error);
                // En caso de error, limpiar las opciones
                const ethnicGroupField = this.otherDataFields.find(field => field.name === FieldNames.ETHNIC_GROUP);
                if (ethnicGroupField) {
                    ethnicGroupField.options = [];
                }
            }
        });
    }


    private handleReligionClick(searchTerm: string, page: number = 0, size: number = 15): void {
        // Solo buscar si hay un término de búsqueda
        if (!searchTerm || searchTerm.trim() === '') {
            // Si no hay término de búsqueda, limpiar las opciones
            const religionField = this.otherDataFields.find(field => field.name === FieldNames.RELIGION);
            if (religionField) {
                religionField.options = [];
            }
            return;
        }
        
        this.patientService.getReligionDataPaginated(searchTerm, page, size).subscribe({
            next: (response) => {
                const religionField = this.otherDataFields.find(field => field.name === FieldNames.RELIGION);
                if (religionField) {
                    religionField.options = this.patientService.religionOptions;
                }
            },
            error: (error) => {
                console.error('Error al obtener religiones:', error);
                // En caso de error, limpiar las opciones
                const religionField = this.otherDataFields.find(field => field.name === FieldNames.RELIGION);
                if (religionField) {
                    religionField.options = [];
                }
            }
        });
    }

    private handlePostalCodeClick(param: string): void {
        this.patientService.getPostalCode(param);
    }

    public handleStreetClick(searchTerm: string, page: number = 0, size: number = 3, neighborhoodId?: string): void {
        const streetField = this.addressFields.find(field => field.name === FieldNames.STREET_NAME);
    
        const effectiveNeighborhoodId = neighborhoodId || this.selectedNeighborhoodId;
        
        if (!effectiveNeighborhoodId) {
            this.clearStreetOptions();
            return;
        }
    
        if (streetField && searchTerm) {
            streetField.value = searchTerm;
        }
    
        this.patientService.getStreetDataPaginated(searchTerm, page, size, effectiveNeighborhoodId)
            .subscribe({
                next: (response) => {
                    if (streetField) {
                        streetField.options = response;
                    }
                },
                error: (error) => {
                    this.clearStreetOptions();
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
    
    private handleParentsMaritalStatusClick(event: MouseEvent): void {
        this.patientService.getParentsMaritalStatusData();
        const parentsMaritalStatusField = this.guardianFields.find(field => field.name === FieldNames.PARENTS_MARITAL_STATUS);
        parentsMaritalStatusField && (parentsMaritalStatusField.options = this.patientService.parentsMaritalStatusOptions);
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

    // Método para manejar el cambio en el campo CURP
    public handleCurpChange(curp: string): void {
        if (curp && curp.length === 18) {
            this.patientService.getPersonByCurp(curp).subscribe(person => {
                if (person) {
                    // Emitir un evento para notificar que se encontró una persona
                    // Este evento será capturado por el componente
                    const event = new CustomEvent('personFound', { detail: person });
                    document.dispatchEvent(event);
                }
            });
        }
    }

    // Método para manejar el cambio en el campo CURP del tutor
    public handleGuardianCurpChange(curp: string): void {
        if (curp && curp.length === 18) {
            this.patientService.getGuardianByCurp(curp).subscribe(guardian => {
                if (guardian) {
                    // Emitir un evento para notificar que se encontró un tutor
                    const event = new CustomEvent('guardianFound', { detail: guardian });
                    document.dispatchEvent(event);
                }
            });
        }
    }
}