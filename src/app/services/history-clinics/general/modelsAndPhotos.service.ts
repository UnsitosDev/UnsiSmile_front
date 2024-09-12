import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class modelsAndPhotosService {

    private modelsAndPhotosFields: FormField[] = [
        {
            type: 'input',
            label: 'Modelos de Estudio',
            name: 'studyModels',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre los modelos de estudio.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Tipo de Arcada',
            name: 'archType',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el tipo de arcada.'
            },
            value: ''
        },
        {
            type: 'inputFile',
            label: 'Fotografías',
            name: 'photographs',
            accept: 'img',
            placeholder: 'PNG, JPG, GIF, BMP, TIFF, WEBP.',
            required: false,
            value: ''
        },

    ];

    getModelsAndPhotosFields(): FormField[] {
        return this.modelsAndPhotosFields;
    }
}
