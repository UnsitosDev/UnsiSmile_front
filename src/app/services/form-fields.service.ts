import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { curpValidator, phoneNumberValidator } from '../utils/validators';
import { PatientService } from './patient/patient.service';

@Injectable({
    providedIn: 'root'
})
export class FormFieldsService {
        patientService = inject(PatientService);
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
            required: true,
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
            required: true,
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
            type: 'input',
            label: 'Número Exterior',
            name: 'exteriorNumber',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Número Exterior es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Número Interior',
            name: 'interiorNumber',
            required: false,
            errorMessages: {
                required: 'El campo Número Interior es opcional.'
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
            type: 'select',
            label: 'Nombre de colonia',
            name: 'neighborhoodName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de colonia es requerido.'
            },
            onClick: this.handleNeighborhoodClick.bind(this)
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
            onClick: this.handleMunicipalityClick.bind(this)
        },
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
            onClick: this.handleStateClick.bind(this)
        },
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
            required: false,
            errorMessages: {
                required: 'El campo Grupo étnico es opcional.'
            },
            onClick: this.handleEthnicGroupClick.bind(this)
        },
        {
            type: 'select',
            label: 'Religión',
            name: 'religion',
            required: false,
            errorMessages: {
                required: 'El campo Religión es opcional.'
            },
            onClick: this.handleReligionClick.bind(this)

        },
        {
            type: 'datepicker',
            label: 'Última Consulta',
            name: 'lastConsultation',
            required: false,
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


    // Eventos

    constructor() {
        // this.handleGenderClick({} as MouseEvent);
        // this.handleHousingClick({}as MouseEvent);
        // this.handleStretClick({}as MouseEvent);
        // this.handleNeighborhoodClick({} as MouseEvent);
    }
    private handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        // Acceder a genderOptions después de que se cargo
        const genderField = this.personalDataFields.find(field => field.name === 'gender');
        genderField && (genderField.options = this.patientService.genderOptions);
    }
    private handleHousingClick(event: MouseEvent): void {
        this.patientService.getHousingData();
        const housingField = this.addressFields.find(field => field.name === 'housingCategory');
        housingField && (housingField.options = this.patientService.housingOptions);
    }
    private handleStretClick(event: MouseEvent): void {
        this.patientService.getStreets();
        const streetsField = this.addressFields.find(field => field.name === 'streetName');
        streetsField && (streetsField.options = this.patientService.streetsOptions);
    }
    private handleNeighborhoodClick(event: MouseEvent): void {
        this.patientService.getNeighborhoodData();
        const neighborhoodField = this.addressFields.find(field => field.name === 'neighborhoodName');
        neighborhoodField && (neighborhoodField.options = this.patientService.neighborhoodOptions);
    }
    private handleLocalityClick(param: string): void {
        this.patientService.getLocality(param);
        const localityField = this.addressFields.find(field => field.name === 'localityName');
        localityField && (localityField.options = this.patientService.localityOptions);
    }
    private handleMunicipalityClick(event: MouseEvent): void {
        this.patientService.getMunicipalityData();
        const municipalityField = this.addressFields.find(field => field.name === 'municipalityName');
        municipalityField && (municipalityField.options = this.patientService.municipalityOptions);
    }
    private handleStateClick(event: MouseEvent): void {
        this.patientService.getStateData();
        const stateField = this.addressFields.find(field => field.name === 'stateName');
        stateField && (stateField.options = this.patientService.stateOptions);
    }
    private handleNacionalityClick(event: MouseEvent): void {
        this.patientService.getNacionalityData();
        const nationalityField = this.otherDataFields.find(field => field.name === 'nationality');
        nationalityField && (nationalityField.options = this.patientService.nationalityOptions);
    }
    private handleMaritalStatusClick(event: MouseEvent): void {
        this.patientService.getMaritalStatusData();
        const maritalStatusField = this.otherDataFields.find(field => field.name === 'maritalStatus');
        maritalStatusField && (maritalStatusField.options = this.patientService.maritalStatusOptions);
    }
    private handleOcupationClick(event: MouseEvent): void {
        this.patientService.getOcupationData();
        const occupationField = this.otherDataFields.find(field => field.name === 'occupation');
        occupationField && (occupationField.options = this.patientService.occupationOptions);
    }
    private handleEthnicGroupClick(event: MouseEvent): void {
        this.patientService.getEthnicGroupData();
        const ethnicGroupField = this.otherDataFields.find(field => field.name === 'ethnicGroup');
        ethnicGroupField && (ethnicGroupField.options = this.patientService.ethnicGroupOptions);
    }
    private handleReligionClick(event: MouseEvent): void {
        this.patientService.getReligionData();
        const religionField = this.otherDataFields.find(field => field.name === 'religion');
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
}