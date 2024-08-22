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
            validators: [Validators.required] // Agregar validadores
        },
        {
            type: 'input',
            label: 'Segundo Nombre',
            name: 'segundoNombre',
            required: true,
            validators: [Validators.required] // Agregar validadores
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
            validators: [Validators.required] // Agregar validadores
        }
    ];
    getFormFields(): FormField[] {
        return this.formFields;
    }
}