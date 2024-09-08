import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

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



    getPatientPosture(): FormField[] {
        return this.patientPostureFields;
    }
}