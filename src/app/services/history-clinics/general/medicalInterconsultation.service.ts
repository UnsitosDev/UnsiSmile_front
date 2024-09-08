import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class medicalInterconsultationService {

    private medicalInterconsultationFields: FormField[] = [
        {
            type: 'input',
            label: 'Nombre de Médico',
            name: 'doctorName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el nombre del médico.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Razón de Interconsulta',
            name: 'referralReason',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa la razón de la interconsulta.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Motivo de Diagnóstico Presuntivo',
            name: 'presumptiveDiagnosisReason',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el motivo de diagnóstico presuntivo.'
            },
            value: ''
        },
        {
            type: 'input',
            label: 'Motivo de Envío y Servicio al que se Envía',
            name: 'referralMotivation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa el motivo de envío y servicio.'
            },
            value: ''
        }
    ];

    getMedicalInterconsultationFields(): FormField[] {
        return this.medicalInterconsultationFields;
    }
}
