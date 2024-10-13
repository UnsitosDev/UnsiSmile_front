import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class patientPostureService {

    private patientPostureFields: FormField[] = [
        {
            type: 'input',
            label: 'ATM – Palpación',
            name: 'atmPalpation',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'Ingresa información sobre la palpación de ATM.'
            },
            value: ''
        },
    ];

    public seccionPatientPosture: formSectionFields = {
        title: 'Postura del Paciente',
        childFormSection: null,
        seccion: this.patientPostureFields
    }

    getPatientPosture(): formSectionFields {
        return this.seccionPatientPosture;
    }
}