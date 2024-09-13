import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class bucalExamService {
    
    private bucalExamFields: FormField[] = [
        {
            type: 'select',
            label: 'Relacion molar derecha',
            name: 'rightMolarRelation',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 1, label: 'Clase I' },
                { value: 2, label: 'Clase II' },
                { value: 3, label: 'Clase III' },
            ],
            errorMessages: {
                required: 'Ingresa información sobre Relacion molar.'
            },
            value: ''
        },
        {
            type: 'select',
            label: 'Relacion molar izquierda',
            name: 'leftMolarRelation',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 1, label: 'Clase I' },
                { value: 2, label: 'Clase II' },
                { value: 3, label: 'Clase III' },
            ],
            errorMessages: {
                required: 'Ingresa información sobre Relacion molar.'
            },
            value: ''
        },
        {
            type: 'select',
            label: 'Relacion canina derecha',
            name: 'rightCanineRelation',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 1, label: 'Clase I' },
                { value: 2, label: 'Clase II' },
                { value: 3, label: 'Clase III' },
            ],
            errorMessages: {
                required: 'Ingresa información sobre Relacion canina.'
            },
            value: ''
        },
        {
            type: 'select',
            label: 'Relacion canina izquierda',
            name: 'leftCanineRelation',
            required: true,
            validators: [Validators.required],
            options: [
                { value: 1, label: 'Clase I' },
                { value: 2, label: 'Clase II' },
                { value: 3, label: 'Clase III' },
            ],
            errorMessages: {
                required: 'Ingresa información sobre Relacion canina.'
            },
            value: ''
        },

    ];

    private oralExamFields: formSectionFields[] = [
        {
            title: 'Examen Bucal',
            childFormSection: {
                title: 'Clasificacion de angle',
                childFormSection: null,
                seccion: this.bucalExamFields,
            },
            seccion: null
        }
    ];

    getOralExamFields(): formSectionFields {
        return this.oralExamFields[0];
    }
    

    // getbucalExamFields(): FormField[] {
    //     return this.bucalExamFields;
    // }
}