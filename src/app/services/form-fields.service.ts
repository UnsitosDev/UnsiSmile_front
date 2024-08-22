// form-fields.service.ts

import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { curpValidator, phoneNumberValidator } from '../utils/validators';

@Injectable({
    providedIn: 'root'
})
export class FormFieldsService {
    private formFields: FormField[] = [
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
            type: 'input',
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
            label: 'Genero',
            name: 'gender',
            required: true,
            options: [
                { value: '1', label: 'Masculino' },
                { value: '2', label: 'Femenino' }
            ],
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo GENERO es requerido.'
            }
        }
    ];
    getFormFields(): FormField[] {
        return this.formFields;
    }
}