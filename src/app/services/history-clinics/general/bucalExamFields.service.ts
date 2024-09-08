import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class bucalExamService {
    private bucalExamFields: FormField[] = [
        {
            type: 'input',
            label: 'Examen Periapical',
            name: 'periapicalExam',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre el examen periapical.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Examen Cefálica Lateral',
            name: 'lateralCephalometricExam',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre el examen cefálica lateral.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Examen Panorámica',
            name: 'panoramicExam',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre el examen panorámico.'
            },
            value: ''
        },
    ];

    getbucalExamFields(): FormField[] {
        return this.bucalExamFields;
    }
}