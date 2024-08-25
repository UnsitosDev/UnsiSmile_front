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
            options: [
                { value: '1', label: 'Masculino' },
                { value: '2', label: 'Femenino' }
            ],
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo GENERO es requerido.'
            },
            onClick: this.handleGenderClick.bind(this) // Usa bind para asegurar el contexto
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
            options: [
                { value: '1', label: 'Casa' },
                { value: '2', label: 'Departamento' },
                { value: '3', label: 'Otro' }
            ],
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Categoría de vivienda es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Nombre de calle',
            name: 'streetName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de calle es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Nombre de colonia',
            name: 'neighborhoodName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de colonia es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Nombre de localidad',
            name: 'localityName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de localidad es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Código postal',
            name: 'postalCode',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Código postal es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Nombre de municipio',
            name: 'municipalityName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de municipio es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Nombre de estado',
            name: 'stateName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre de estado es requerido.'
            }
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
            type: 'input',
            label: 'Nacionalidad',
            name: 'nationality',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nacionalidad es requerido.'
            }
        },
        {
            type: 'select',
            label: 'Estado civil',
            name: 'maritalStatus',
            required: true,
            options: [
                { value: '1', label: 'Soltero' },
                { value: '2', label: 'Casado' },
                { value: '3', label: 'Divorciado' },
                { value: '4', label: 'Viudo' }
            ],
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Estado civil es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Ocupación',
            name: 'occupation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Ocupación es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Grupo étnico',
            name: 'ethnicGroup',
            required: false,
            errorMessages: {
                required: 'El campo Grupo étnico es opcional.'
            }
        },
        {
            type: 'input',
            label: 'Religión',
            name: 'religion',
            required: false,
            errorMessages: {
                required: 'El campo Religión es opcional.'
            }
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
        }
    ];

    getPersonalDataFields(): FormField[] {
        return this.personalDataFields;
    }

    getAddressFields(): FormField[] {
        return this.addressFields;
    }

    getOtherDataFields(): FormField[] {
        return this.otherDataFields;
    }

     // Función para manejar el clic y llamar a getGender
     private handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
    }
}