import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class personalPathologicalHistoryFormService {
    private personalPathologicalHistoryFields : FormField[] = [
        {
            type: 'input',
            label: '¿Has sido hospitalizado?',
            name: 'hasBeenHospitalized',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Indica si has sido hospitalizado.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Motivo de la hospitalización',
            name: 'hospitalizationReason',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Indica si ha tomado algún medicamento recientemente.'
            },
            value: ''
        },
        
        {
            type: 'input',
            label: '¿Ha tomado algún medicamento recientemente?',
            name: 'hasTakenMedicationRecently',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Indica si ha tomado algún medicamento recientemente.'
            },
            value: ''
        },
        {
            type: 'input',
            label: '¿Cuál es el motivo?',
            name: 'medicationReason',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el motivo del medicamento.'
            },
            value: ''
        },
        {
            type: 'input',
            label: '¿Ha tenido algún problema con la anestesia dental o anestesia general?',
            name: 'hasHadAnesthesiaProblem',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Indica si ha tenido algún problema con la anestesia.'
            },
            value: ''
        },
        {
            type: 'input',
            label: '¿Cuál es el problema?',
            name: 'anesthesiaProblem',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el problema con la anestesia.'
            },
            value: ''
        },
        {
            type: 'input',
            label: '¿Es alérgico/a a algún medicamento o sustancia?',
            name: 'isAllergicToMedication',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Indica si es alérgico/a a algún medicamento o sustancia.'
            },
            value: ''
        },
        {
            type: 'input',
            label: '¿Cuál es la sustancia a la que es alérgico/a?',
            name: 'allergenicSubstance',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa la sustancia a la que es alérgico/a.'
            },
            value: ''
        },
        // Solo para mujeres
        {
            type: 'input',
            label: '¿Está embarazada?',
            name: 'isPregnant',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Indica si está embarazada.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Meses de embarazo',
            name: 'monthsOfPregnancy',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa los meses de embarazo.'
            },
            value: ''
        }
    ];

    getpathologicalHistoryFields(): FormField[] {
        return this.personalPathologicalHistoryFields;
    }
}