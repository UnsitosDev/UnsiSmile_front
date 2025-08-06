import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormFieldsService } from './form-fields.service';
import { FormField } from '../models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class FormDigitizerPatientService extends FormFieldsService {
    
    private expedientNumberField: FormField = {
        type: 'inputNumber',
        label: 'Número de Expediente',
        name: 'medicalRecordNumber',
        placeholder: 'Ej: 12345',
        required: true,
        validators: [Validators.required],
        errorMessages: {
            required: 'El campo Número de Expediente es requerido.',
            lastError: 'El campo Número de Expediente debe contener solo números.'
        }
    };

    constructor() {
        super();
    }

    // Agregar el campo de número de expediente a los datos personales
    override getPersonalDataFields(): FormField[] {
        const baseFields = super.getPersonalDataFields();
        return [this.expedientNumberField, ...baseFields];
    }

    // Método para obtener solo el campo de número de expediente
    getExpedientNumberField(): FormField {
        return this.expedientNumberField;
    }
}
