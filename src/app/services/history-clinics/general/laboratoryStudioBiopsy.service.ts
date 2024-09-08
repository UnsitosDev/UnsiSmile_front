import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class laboratoryStudioBiopsyService {

    private laboratoryStudioBiopsyFields: FormField[] = [
        {
            type: 'input',
            label: 'Tipo de Estudio de Laboratorio',
            name: 'laboratoryStudyType',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el tipo de estudio de laboratorio.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Tipo de Biopsia',
            name: 'biopsyType',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el tipo de biopsia.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Región donde se realizó biopsia',
            name: 'biopsyRegion',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa la región donde se realizó la biopsia.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Laboratorio donde se envía el estudio',
            name: 'laboratoryForStudy',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el laboratorio donde se envía el estudio.'
            },
            value: ''
        },
    ];

    getLaboratoryStudioBiopsyFields(): FormField[] {
        return this.laboratoryStudioBiopsyFields;
    }
}
