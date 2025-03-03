import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { ProfesorService } from './profesor.service';

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
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Presión arterial es requerido.'
            }
        },
        {
            type: 'inputNumber',
            label: 'Temperatura',
            name: 'temperature',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Temperatura es requerido.'
            }
        },
        {
            type: 'inputNumber',
            label: 'Frecuencia cardíaca',
            name: 'heartRate',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frecuencia cardíaca es requerido.'
            }
        },
        {
            type: 'inputNumber',
            label: 'Frecuencia respiratoria',
            name: 'respiratoryRate',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Frecuencia respiratoria es requerido.',
            }
        },
        {
            type: 'inputNumber',
            label: 'Saturación de oxígeno',
            name: 'phone',
            validators: [Validators.required],
            errorMessages: {
                require: 'El campo Saturación de oxígeno es requerido.'
            }
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