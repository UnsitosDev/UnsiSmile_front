import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { curpValidator, emailValidator, phoneNumberValidator, minimumAgeValidator } from '../utils/validators';
import { PatientService } from './patient/patient.service';
import { FieldNames } from '../models/form-fields/form-utils';


@Injectable({
    providedIn: 'root'
})
export class studentService {
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
            required: false,
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
            label: 'Matrícula',
            name: 'enrollment',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Matrícula es requerido.',

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
            validators: [Validators.required, phoneNumberValidator()],
            errorMessages: {
                required: 'El campo Telefono es requerido.',
                lastError: 'Por favor, introduce un número de teléfono válido.'
            }
        },
        {
            type: 'datepicker',
            label: 'Fecha de Nacimiento',
            name: 'birthDate',
            validators: [
                Validators.required,
                minimumAgeValidator(18)
            ],
            errorMessages: {
                required: 'El campo Fecha de Nacimiento es requerido.',
                underage: 'Debes ser mayor de 18 años'
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
        {
            type: 'select',
            label: 'Grupo',
            name: 'group',
            required: false,
            validators: [],
            errorMessages: {
                required: 'El campo Grupo es requerido.'
            },
            //onClick: this.handleGenderClick.bind(this)
        },
    ];


    // Eventos

    constructor() {
        this.handleGenderClick({} as MouseEvent);

    }

    private handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        const genderField = this.personalDataFields.find(field => field.name === FieldNames.GENDER);
        genderField && (genderField.options = this.patientService.genderOptions);
    }

    //futuro traer grupos

    //private handleGroupClick(event: MouseEvent): void {
     //   this.patientService.getGender();
       // const genderField = this.personalDataFields.find(field => field.name === FieldNames.GENDER);
        //genderField && (genderField.options = this.patientService.genderOptions);
    //}

    // Formularios
    getPersonalDataFields(): FormField[] {
        return this.personalDataFields;
    }

}