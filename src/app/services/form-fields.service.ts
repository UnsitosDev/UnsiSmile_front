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
            validators: [Validators.email],
            errorMessages: {
                required: 'El campo Correo Electrónico es requerido.',
                email: 'Ingrese un correo electrónico válido.'
            }
        },
    ];


    // Eventos

    constructor() {
        this.handleGenderClick({} as MouseEvent);
        this.handleHousingClick({} as MouseEvent);
        this.handleStretClick({} as MouseEvent);
        this.handleNeighborhoodClick({} as MouseEvent);
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

    private handleNeighborhoodClick(event: MouseEvent): void {
        this.patientService.getNeighborhoodData();
        const neighborhoodField = this.addressFields.find(field => field.name === FieldNames.NEIGHBORHOOD_NAME);
        neighborhoodField && (neighborhoodField.options = this.patientService.neighborhoodOptions);
    }

    private handleLocalityClick(searchTerm: string, page: number = 0, size: number = 3): void {
        this.patientService.getLocalityDataPaginated(searchTerm, page, size).subscribe(response => {
            const localityField = this.addressFields.find(field => field.name === FieldNames.LOCALITY_NAME);
            if (localityField) {
                const newOptions = response.content.map(item => ({
                    value: item.idLocality ? item.idLocality.toString() : '',
                    label: item.name
                }));
                localityField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
            }
        });
    }

    private handleMunicipalityClick(searchTerm: string, page: number = 0, size: number = 3): void {
        this.patientService.getMunicipalityDataPaginated(searchTerm, page, size).subscribe(response => {
            const municipalityField = this.addressFields.find(field => field.name === FieldNames.MUNICIPALITY_NAME);
            if (municipalityField) {
                const newOptions = response.content.map(item => ({
                    value: item.idMunicipality ? item.idMunicipality.toString() : '',
                    label: item.name
                }));
                municipalityField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
            }
        });
    }

    public handleStateClick(searchTerm: string, page: number = 0, size: number = 3): void {
        this.patientService.getStateDataPaginated(searchTerm, page, size).subscribe(response => {
            const stateField = this.addressFields.find(field => field.name === FieldNames.STATE_NAME);
            if (stateField) {
                const newOptions = response.content.map(item => ({
                    value: item.idState ? item.idState.toString() : '',
                    label: item.name
                }));
                stateField.options = [...new Map(newOptions.map(item => [item.value, item])).values()];
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