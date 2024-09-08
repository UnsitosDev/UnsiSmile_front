import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class radiographicAnalisisService {

    private radiographicAnalisisFields: FormField[] = [
        {
            type: 'input',
            label: 'Radiografía Periapical',
            name: 'periapicalRadiography',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre la radiografía periapical.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Radiografía Cefálica Lateral',
            name: 'lateralCephalometricRadiography',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre la radiografía cefálica lateral.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Radiografía Panorámica',
            name: 'panoramicRadiography',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre la radiografía panorámica.'
            },
            value: ''
        },
    ];

    getRadiographicAnalisisFields(): FormField[] {
        return this.radiographicAnalisisFields;
    }
}
