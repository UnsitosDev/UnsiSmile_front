import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class VitalSignsFormService {
    private vitalSignsFields: FormField[] = [
        {
            type: 'input',
            label: 'Peso',
            name: 'weight',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Peso es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Estatura',
            name: 'height',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Estatura es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Temperatura',
            name: 'temperature',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Temperatura es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Frecuencia Cardiaca',
            name: 'heartRate',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frecuencia Cardiaca es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Frecuencia Respiratoria',
            name: 'respiratoryRate',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frecuencia Respiratoria es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Presión Arterial',
            name: 'bloodPressure',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Presión Arterial es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Saturación de Oxígeno',
            name: 'oxygenSaturation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Saturación de Oxígeno es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Glucosa',
            name: 'glucose',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Glucosa es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            label: 'Pulso',
            name: 'pulse',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Pulso es requerido.'
            },
            value: null // Valor inicial
        },
    ];

    getVitalSignsFields(): FormField[] {
        return this.vitalSignsFields;
    }
}