import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class multidiciplinaryEvaluationService {
    private clinicExamFields: FormField[] = [
        {
            type: 'input',
            label: 'Paladar',
            name: 'palate',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Paladar es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Istmo de las fauces',
            name: 'isthmusOfFauces',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Istmo de las fauces es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Mucosa yugal',
            name: 'buccalMucosa',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Mucosa yugal es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Nódulos linfáticos',
            name: 'lymphNodes',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Nódulos linfáticos es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Lengua',
            name: 'tongue',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Lengua es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Piso de boca',
            name: 'floorOfMouth',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Piso de boca es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Labios',
            name: 'lips',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Labios es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Glándulas salivales',
            name: 'salivaryGlands',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Glándulas salivales es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Encía',
            name: 'gingiva',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Encía es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Frenillos',
            name: 'frenula',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frenillos es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Saliva',
            name: 'saliva',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Saliva es requerido.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Otras señas particulares',
            name: 'otherDistinguishingFeatures',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Otras señas particulares es requerido.'
            },
            value: ''
        }
    ];

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
            type: 'input',
            label: 'Observaciones',
            name: 'observations',
            required: false, // Este campo no es obligatorio
            validators: [],
            errorMessages: {},
            value: ''
        }
    ];

    seccionClinicalExamFields: formSectionFields = {
        title : 'Examen Clinico',
        childFormSection: null,
        seccion: this.clinicExamFields
    }

    getClinicalExamFields(): formSectionFields{
        return this.seccionClinicalExamFields;
    }
}