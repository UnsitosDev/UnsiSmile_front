// form-fields.service.ts

import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { curpValidator } from '../utils/validators';

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
            validators: [Validators.required],
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
                required: 'El campo CURP es requerido.',
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
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Teléfono es requerido.'
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
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Correo electrónico es requerido.'
            }
        },
        {
            type: 'select',
            label: 'GENERO',
            name: 'gender',
            required: true,
            options: [
                { value: '1', label: 'MASCULINO' },
                { value: '2', label: 'FEMENINO' }
            ],
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo País es requerido.'
            }
        }
    ];
    getFormFields(): FormField[] {
        return this.formFields;
    }
}