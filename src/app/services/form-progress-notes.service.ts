import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { ProfesorService } from './profesor.service';
import { bloodPressureValidator, heartRateValidator, oxygenSaturationValidator, respiratoryRateValidator, temperatureValidator } from '../utils/validators';

@Injectable({
    providedIn: 'root',
})

export class ProgressNotesService {
    private profesorService = inject(ProfesorService); // Inyectar ProfesorService

    public formProgressNotes: FormField[] = [
        {
            type: 'inputNumber',
            label: 'Presión arterial',
            name: 'bloodPressure',
            validators: [Validators.required, bloodPressureValidator()], // Validador personalizado
            errorMessages: {
                required: 'El campo Presión arterial es requerido.',
                lastError: 'El formato de la presión arterial es inválido (ej. 120/80).', // Mensaje de error personalizado
            },
        },
        {
            type: 'inputNumber',
            label: 'Temperatura',
            name: 'temperature',
            validators: [Validators.required, temperatureValidator()], // Validador personalizado
            errorMessages: {
                required: 'El campo Temperatura es requerido.',
                lastError: 'La temperatura debe estar entre 30 y 45 grados (ej. 36.5).', // Mensaje de error personalizado
            },
        },
        {
            type: 'inputNumber',
            label: 'Frecuencia cardíaca',
            name: 'heartRate',
            validators: [Validators.required, heartRateValidator()], // Validador personalizado
            errorMessages: {
                required: 'El campo Frecuencia cardíaca es requerido.',
                lastError: 'La frecuencia cardíaca debe estar entre 40 y 200 (ej. 80).', // Mensaje de error personalizado
            },
        },
        {
            type: 'inputNumber',
            label: 'Frecuencia respiratoria',
            name: 'respiratoryRate',
            validators: [Validators.required, respiratoryRateValidator()], // Validador personalizado
            errorMessages: {
                required: 'El campo Frecuencia respiratoria es requerido.',
                lastError: 'La frecuencia respiratoria debe estar entre 12 y 30 (ej. 20).', // Mensaje de error personalizado
            },
        },
        {
            type: 'inputNumber',
            label: 'Saturación de oxígeno',
            name: 'oxygenSaturation',
            validators: [Validators.required, oxygenSaturationValidator()], // Validador personalizado
            errorMessages: {
                required: 'El campo Saturación de oxígeno es requerido.',
                lastError: 'La saturación de oxígeno debe estar entre 90 y 100 (ej. 95).', // Mensaje de error personalizado
            },
        },
        {
            type: 'textArea',
            label: 'Diagnóstico',
            name: 'diagnosis',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Diagnóstico es requerido.',
            },
        },
        {
            type: 'textArea',
            label: 'Pronóstico',
            name: 'prognosis',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Pronóstico es requerido.',
            },
        },
        {
            type: 'textArea',
            label: 'Tratamiento',
            name: 'treatment',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Tratamiento es requerido.',
            },
        },
        {
            type: 'textArea',
            label: 'Indicaciones',
            name: 'indications',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Indicaciones es requerido.',
            },
        },
        {
            type: 'select',
            label: 'Profesor',
            name: 'professorClinicalAreaId',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Profesor es requerido.',
            },
            options: []
        }
    ];

    public getFormProgressNotes(): FormField[] {
        this.getProfesorOptions();
        return this.formProgressNotes;
    }

    private getProfesorOptions(): void {
        this.profesorService.getProfesorArea().subscribe({
            next: (response) => {
                const profesorField = this.formProgressNotes.find(
                    (field) => field.name === 'professorClinicalAreaId'
                );
                if (profesorField) {
                    profesorField.options = response.map((profesor: any) => ({
                        value: profesor.idCatalogOption,
                        label: profesor.optionName,
                    }));
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
}