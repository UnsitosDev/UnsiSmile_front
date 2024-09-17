import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';


@Injectable({
    providedIn: 'root'
})
export class facialExamService {

    private facialProfileFields: FormField[] = [
        {
            type: 'select',
            label: 'Perfil Recto',
            name: 'idFacialProfile',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Selecciona un perfil recto.'
            },
            options: [
                { value: 1, label: 'Perfil Recto 1' },
                { value: 2, label: 'Perfil Recto 2' },
                { value: 3, label: 'Perfil Recto 3' },
            ]
        },
        {
            type: 'select',
            label: 'Frente Braquifacial',
            name: 'idFacialFront',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Selecciona un frente braquifacial.'
            },
            options: [
                { value: 1, label: 'Frente Braquifacial 1' },
                { value: 2, label: 'Frente Braquifacial 2' },
                { value: 3, label: 'Frente Braquifacial 3' },
            ]
        },
        {
            type: 'input',
            label: 'Señas particulares',
            name: 'distinguishingFeatures',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa las señas particulares.'
            },
            value: ''
        },
    ];

    private seccionFacialExamFields: formSectionFields = {

        title: 'Examen Facial',
        childFormSection: null,
        seccion: this.facialProfileFields

    }

    getfacialExamFields(): formSectionFields {
        return this.seccionFacialExamFields;
    }

}