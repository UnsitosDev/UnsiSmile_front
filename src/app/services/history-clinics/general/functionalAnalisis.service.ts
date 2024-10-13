import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class functionalAnalisisService {

    private functionalAnalisisFields: FormField[] = [
        {
            type: 'input',
            label: 'Deglución',
            name: 'swallowing',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Deglución es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Fonación',
            name: 'phonation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Fonación es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Masticación',
            name: 'mastication',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Masticación es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Respiración',
            name: 'respiration',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Respiración es requerido.'
            },
            value: ''
        },
        {
            type: 'textArea',
            label: 'Observaciones',
            name: 'observations',
            placeholder: 'Anotar Observaciones',
            required: false, // Este campo no es obligatorio
            validators: [],
            errorMessages: {},
            value: ''
        }
    ];



    getFunctionalAnalisisFields(): FormField[] {
        return this.functionalAnalisisFields;
    }
}