import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { addressesNumber, curpValidator, phoneNumberValidator } from '../utils/validators';
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
            required: true,
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
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Fecha de Nacimiento es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Correo electrónico',
            name: 'email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'El campo Correo electrónico es requerido.',
                lastError: 'Por favor, introduce un correo electrónico válido.'
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
//            onClick: this.handleStateClick.bind(this),
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
            label: 'Nombre de colonia',
            name: 'neighborhoodName',
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
            type: 'select',
            label: 'Nombre de calle',
            name: 'streetName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de calle es requerido.'
            },
            onClick: this.handleStretClick.bind(this)

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
            type: 'datepicker',
            label: 'Fecha de admisión',
            name: 'admissionDate',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Fecha de admisión es requerido.'
            }
        },
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
            type: 'select',
            label: 'Grupo étnico',
            name: 'ethnicGroup',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Grupo étnico es opcional.'
            },
            onClick: this.handleEthnicGroupClick.bind(this)
        },
        {
            type: 'select',
            label: 'Religión',
            name: 'religion',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Religión es opcional.'
            },
            onClick: this.handleReligionClick.bind(this),
            // onInputChange: {
            //     changeFunction: this.handleReligionClick.bind(this),
            //     length: 5
            // }

        },
        {
            type: 'datepicker',
            label: 'Última Consulta',
            name: 'lastConsultation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Última Consulta es opcional.'
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
            validators: [ Validators.email],
            errorMessages: {
                required: 'El campo Correo Electrónico es requerido.',
                email: 'Ingrese un correo electrónico válido.'
            }
        },
    ];


    // Eventos

    constructor(){
        this.handleGenderClick({} as MouseEvent);
        this.handleHousingClick({}as MouseEvent);
        this.handleStretClick({}as MouseEvent);
        //this.handleNeighborhoodClick({} as MouseEvent);
      //  this.handleMunicipalityClick({} as MouseEvent);
        //this.handleStateClick({} as MouseEvent);
        this.handleNacionalityClick({} as MouseEvent);
        this.handleMaritalStatusClick({} as MouseEvent);
        this.handleOcupationClick({} as MouseEvent);
       // this.handleEthnicGroupClick({} as MouseEvent);
        // this.handleReligionClick({} as MouseEvent);
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

    private handleStretClick(event: MouseEvent): void {
        this.patientService.getStreets();
        const streetsField = this.addressFields.find(field => field.name === FieldNames.STREET_NAME);
        streetsField && (streetsField.options = this.patientService.streetsOptions);
    }

    public handleNeighborhoodClick(searchTerm: string, page: number = 0, size: number = 3, localityId?: string): void {
        // Limpiar la colonia seleccionada si el término de búsqueda está vacío
        if (!searchTerm || searchTerm.trim() === '') {
            this.selectedNeighborhoodId = undefined;
            return;
        }
    
        const effectiveLocalityId = localityId || this.selectedLocalitId;
        console.log('Búsqueda de colonias - Parámetros:', { searchTerm, page, size, localityId: effectiveLocalityId });
    
        this.patientService.getNeighborhoodDataPaginated(searchTerm, page, size, effectiveLocalityId).subscribe(response => {
            console.log('Respuesta de colonias filtrada:', response);
    
            const neighborhoodField = this.addressFields.find(field => field.name === FieldNames.NEIGHBORHOOD_NAME);
            if (neighborhoodField) {
                const newOptions = response.content.map(item => ({
                    value: item.idNeighborhood ? item.idNeighborhood.toString() : '',
                    label: item.name
                }));
                neighborhoodField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
    
                // Si hay una única colonia o si hay un término de búsqueda exacto
                const exactMatch = response.content.find(item => 
                    item.name.toLowerCase() === searchTerm.toLowerCase()
                );
    
                // Limpiar la colonia anterior si no hay coincidencia exacta
                if (!exactMatch && this.selectedNeighborhoodId) {
                    this.selectedNeighborhoodId = undefined;
                }
    
                if (response.content.length === 1 || exactMatch) {
                    const selectedNeighborhood = exactMatch || response.content[0];
                    const newNeighborhoodId = selectedNeighborhood.idNeighborhood?.toString();
    
                    // Solo actualizar si la colonia ha cambiado
                    if (this.selectedNeighborhoodId !== newNeighborhoodId) {
                        this.selectedNeighborhoodId = newNeighborhoodId;
                        if (this.selectedNeighborhoodId) {
                            console.log('Colonia seleccionada, ID:', this.selectedNeighborhoodId);
                        }
                    }
                }
            }
        });
    }
    
    
    public handleLocalityClick(searchTerm: string, page: number = 0, size: number = 3, municipalityId?: string): void {
        // Limpiar la localidad seleccionada y las colonias si el término de búsqueda está vacío
        if (!searchTerm || searchTerm.trim() === '') {
            this.selectedLocalitId = undefined;
            this.clearNeighborhoodOptions();
            return;
        }
    
        const effectiveMunicipalityId = municipalityId || this.selectedMunicipalityId;
        console.log('Búsqueda de localidades - Parámetros:', { searchTerm, page, size, municipalityId: effectiveMunicipalityId });
    
        this.patientService.getLocalityDataPaginated(searchTerm, page, size, effectiveMunicipalityId).subscribe(response => {
            console.log('Respuesta de localidades filtrada:', response);
    
            const localityField = this.addressFields.find(field => field.name === FieldNames.LOCALITY_NAME);
            if (localityField) {
                const newOptions = response.content.map(item => ({
                    value: item.idLocality ? item.idLocality.toString() : '',
                    label: item.name
                }));
                localityField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
    
                // Si hay una única localidad o si hay un término de búsqueda exacto
                const exactMatch = response.content.find(item => 
                    item.name.toLowerCase() === searchTerm.toLowerCase()
                );
    
                // Limpiar la localidad anterior si no hay coincidencia exacta
                if (!exactMatch && this.selectedLocalitId) {
                    this.selectedLocalitId = undefined;
                    this.clearNeighborhoodOptions();
                }
    
                if (response.content.length === 1 || exactMatch) {
                    const selectedLocality = exactMatch || response.content[0];
                    const newLocalityId = selectedLocality.idLocality?.toString();
                    
                    // Solo actualizar si la localidad ha cambiado
                    if (this.selectedLocalitId !== newLocalityId) {
                        this.selectedLocalitId = newLocalityId;
                        if (this.selectedLocalitId) {
                            console.log('Localidad seleccionada, ID:', this.selectedLocalitId);
                            this.clearNeighborhoodOptions();
                            // Cargar las colonias usando el ID de la localidad
                            this.handleNeighborhoodClick('',0,1000, this.selectedLocalitId);
                        }
                    }
                }
            }
        });
    }
    
    private clearNeighborhoodOptions(): void {
        const neighborhoodField = this.addressFields.find(field => field.name === FieldNames.NEIGHBORHOOD_NAME);
        if (neighborhoodField) {
            neighborhoodField.options = [];
            // También limpiar el valor seleccionado si existe
            if (neighborhoodField.value) {
                neighborhoodField.value = '';
            }
        }
    }
    
    public handleMunicipalityClick(searchTerm: string, page: number = 0, size: number = 3, stateId?: string): void {
        const effectiveStateId = stateId || this.selectedStateId;
        console.log('Búsqueda de municipios - Parámetros:', { searchTerm, page, size, stateId: effectiveStateId });
    
        // Limpiar el municipio seleccionado y las localidades si el término de búsqueda está vacío
        if (!searchTerm || searchTerm.trim() === '') {
            this.selectedMunicipalityId = undefined;
            this.clearLocalityOptions();
            return;
        }
    
        this.patientService.getMunicipalityDataPaginated(searchTerm, page, size, effectiveStateId).subscribe(response => {
            console.log('Respuesta de municipios filtrada:', response);
    
            const municipalityField = this.addressFields.find(field => field.name === FieldNames.MUNICIPALITY_NAME);
            if (municipalityField) {
                const newOptions = response.content.map(item => ({
                    value: item.idMunicipality ? item.idMunicipality.toString() : '',
                    label: item.name
                }));
                municipalityField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
    
                // Si hay un único municipio o si hay un término de búsqueda exacto
                const exactMatch = response.content.find(item => 
                    item.name.toLowerCase() === searchTerm.toLowerCase()
                );
    
                // Limpiar el municipio anterior si no hay coincidencia exacta
                if (!exactMatch && this.selectedMunicipalityId) {
                    this.selectedMunicipalityId = undefined;
                    this.clearLocalityOptions();
                }
    
                if (response.content.length === 1 || exactMatch) {
                    const selectedMunicipality = exactMatch || response.content[0];
                    const newMunicipalityId = selectedMunicipality.idMunicipality?.toString();
                    
                    // Solo actualizar si el municipio ha cambiado
                    if (this.selectedMunicipalityId !== newMunicipalityId) {
                        this.selectedMunicipalityId = newMunicipalityId;
                        if (this.selectedMunicipalityId) {
                            console.log('Municipio seleccionado, ID:', this.selectedMunicipalityId);
                            this.clearLocalityOptions();
                            this.handleLocalityClick('', 0, 1000, this.selectedMunicipalityId);
                        }
                    }
                }
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

    public handleStateClick(searchTerm: string, page: number = 0, size: number = 3): void {
        console.log('Búsqueda de estado - Parámetros:', { searchTerm, page, size });
        
        this.patientService.getStateDataPaginated(searchTerm, page, size).subscribe(response => {
            console.log('Respuesta de estados:', response);
            
            const stateField = this.addressFields.find(field => field.name === FieldNames.STATE_NAME);
            if (stateField) {
                const newOptions = response.content.map(item => ({
                    value: item.idState ? item.idState.toString() : '',
                    label: item.name
                }));
                stateField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
                
                // Cuando se selecciona un estado, actualizar municipios
                if (response.content.length === 1) {
                    this.selectedStateId = response.content[0].idState?.toString();
                    if (this.selectedStateId) {
                        console.log('Estado seleccionado, ID:', this.selectedStateId);
                        // Aumentamos el tamaño a 1000 para asegurar que traemos todos los municipios
                        this.handleMunicipalityClick('', 0, 1000, this.selectedStateId);
                    }
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

    private handleOcupationClick(event: MouseEvent): void {
        this.patientService.getOcupationData();
        const occupationField = this.otherDataFields.find(field => field.name === FieldNames.OCCUPATION);
        occupationField && (occupationField.options = this.patientService.occupationOptions);
    }

     private handleEthnicGroupClick(event: MouseEvent): void {
        this.patientService.getEthnicGroupData();
        const ethnicGroupField = this.otherDataFields.find(field => field.name === FieldNames.ETHNIC_GROUP);
        ethnicGroupField && (ethnicGroupField.options = this.patientService.ethnicGroupOptions);
    }

    private handleReligionClick(event: MouseEvent): void {
        this.patientService.getReligionData();
        const religionField = this.otherDataFields.find(field => field.name === FieldNames.RELIGION);
        religionField && (religionField.options = this.patientService.religionOptions);
    }

    private handlePostalCodeClick(param: string): void {
        this.patientService.getPostalCode(param);
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