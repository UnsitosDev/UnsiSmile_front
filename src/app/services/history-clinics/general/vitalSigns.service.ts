import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { bloodPressureValidator } from 'src/app/utils/validators';

@Injectable({
    providedIn: 'root'
})
export class VitalSignsFormService {
    private vitalSignsFields: FormField[] = [
        {
            type: 'input',
            typeInput: 'number',
            label: 'Peso',
            name: 'weight',
            placeholder: 'EJ: 70', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Peso es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Estatura',
            name: 'height',
            placeholder: 'EJ: 1.75', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Estatura es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Temperatura',
            name: 'temperature',
            placeholder: 'EJ: 36.5', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Temperatura es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Frecuencia Cardiaca',
            name: 'heartRate',
            placeholder: 'EJ: 72', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frecuencia Cardiaca es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Frecuencia Respiratoria',
            name: 'respiratoryRate',
            placeholder: 'EJ: 15', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frecuencia Respiratoria es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'text',
            label: 'Presión Arterial',
            name: 'bloodPressure',
            placeholder: 'EJ: 120/80', // Placeholder añadido
            required: true,
            validators: [Validators.required, bloodPressureValidator()],
            errorMessages: {
                required: 'El campo Presión Arterial es requerido.',
                lastError: 'Formato inválido. Ejemplo: 120/80.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Saturación de Oxígeno',
            name: 'oxygenSaturation',
            placeholder: 'EJ: 98', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Saturación de Oxígeno es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Glucosa',
            name: 'glucose',
            placeholder: 'EJ: 90', // Placeholder añadido
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Glucosa es requerido.'
            },
            value: null // Valor inicial
        },
        {
            type: 'input',
            typeInput: 'number',
            label: 'Pulso',
            name: 'pulse',
            placeholder: 'EJ: 72', // Placeholder añadido
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