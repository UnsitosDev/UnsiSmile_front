// form-fields.service.ts

import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class FormFieldsService {
    private formFields: FormField[] = [
        {
            type: 'input',
            label: 'Nombre',
            name: 'nombre',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Segundo Nombre',
            name: 'segundoNombre',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Segundo Nombre es requerido.'
            }
        },
        {
            type: 'select',
            label: 'País',
            name: 'pais',
            required: true,
            options: [
                { value: 'MX', label: 'México' },
                { value: 'US', label: 'Estados Unidos' }
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