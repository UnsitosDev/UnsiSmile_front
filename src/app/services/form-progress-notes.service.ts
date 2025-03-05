import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from '../models/form-fields/form-field.interface';
import { ProfesorService } from './profesor.service';
import { bloodPressureValidator, heartRateValidator, oxygenSaturationValidator, respiratoryRateValidator, temperatureValidator } from '../utils/validators';

interface ProfesorResponse {
    idProfessorClinicalArea: number;
    professorName: string;
    clinicalArea: {
        idClinicalArea: number;
        clinicalArea: string;
    };
}

interface ApiResponse {
    content: ProfesorResponse[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
@Injectable({
    providedIn: 'root',
})

export class ProgressNotesService {
    private profesorService = inject(ProfesorService);
    private currentPage = 0; // Página actual
    private hasMorePages = true; // Indica si hay más páginas para cargar

    public formProgressNotes: FormField[] = [
        {
            type: 'input',
            label: 'Presión arterial',
            name: 'bloodPressure',
            placeholder: 'Ej. 120/80', 
            validators: [Validators.required, bloodPressureValidator()],
            errorMessages: {
                required: 'El campo Presión arterial es requerido.',
                lastError: 'El formato de la presión arterial es inválido (ej. 120/80).',
            },
        },
        {
            type: 'inputNumber',
            label: 'Temperatura',
            name: 'temperature',
            placeholder: 'Ej. 36.5', 
            validators: [Validators.required, temperatureValidator()],
            errorMessages: {
                required: 'El campo Temperatura es requerido.',
                lastError: 'La temperatura debe estar entre 30 y 45 grados (ej. 36.5).',
            },
        },
        {
            type: 'inputNumber',
            label: 'Frecuencia cardíaca',
            name: 'heartRate',
            placeholder: 'Ej. 80', 
            validators: [Validators.required, heartRateValidator()],
            errorMessages: {
                required: 'El campo Frecuencia cardíaca es requerido.',
                lastError: 'La frecuencia cardíaca debe estar entre 40 y 200 (ej. 80).',
            },
        },
        {
            type: 'inputNumber',
            label: 'Frecuencia respiratoria',
            name: 'respiratoryRate',
            placeholder: 'Ej. 20', 
            validators: [Validators.required, respiratoryRateValidator()],
            errorMessages: {
                required: 'El campo Frecuencia respiratoria es requerido.',
                lastError: 'La frecuencia respiratoria debe estar entre 12 y 30 (ej. 20).',
            },
        },
        {
            type: 'inputNumber',
            label: 'Saturación de oxígeno',
            name: 'oxygenSaturation',
            placeholder: 'Ej. 95', 
            validators: [Validators.required, oxygenSaturationValidator()],
            errorMessages: {
                required: 'El campo Saturación de oxígeno es requerido.',
                lastError: 'La saturación de oxígeno debe estar entre 90 y 100 (ej. 95).',
            },
        },
        {
            type: 'textArea',
            label: 'Diagnóstico',
            name: 'diagnosis',
            placeholder: 'Ingrese el diagnóstico del paciente', 
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Diagnóstico es requerido.',
            },
        },
        {
            type: 'textArea',
            label: 'Pronóstico',
            name: 'prognosis',
            placeholder: 'Ingrese el pronóstico del paciente',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Pronóstico es requerido.',
            },
        },
        {
            type: 'textArea',
            label: 'Tratamiento',
            name: 'treatment',
            placeholder: 'Ingrese el tratamiento del paciente',
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Tratamiento es requerido.',
            },
        },
        {
            type: 'textArea',
            label: 'Indicaciones',
            name: 'indications',
            placeholder: 'Ingrese las indicaciones para el paciente', 
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
        if (!this.hasMorePages) return;

        this.profesorService.getProfesorArea(this.currentPage).subscribe({
            next: (response: ApiResponse) => {
                const profesorField = this.formProgressNotes.find(
                    (field) => field.name === 'professorClinicalAreaId'
                );

                if (profesorField) {
                    // Inicializar options como un array vacío si es undefined
                    if (!profesorField.options) {
                        profesorField.options = [];
                    }

                    // Mapear la respuesta a las opciones del select
                    const newOptions = response.content.map((profesor: ProfesorResponse) => ({
                        value: profesor.idProfessorClinicalArea,
                        label: profesor.professorName,
                    }));

                    // Agregar las nuevas opciones a las existentes
                    profesorField.options = [...profesorField.options, ...newOptions];

                    // Actualizar la página y verificar si hay más páginas
                    this.currentPage++;
                    this.hasMorePages = !response.last;
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }


    // Método para cargar más datos cuando el usuario hace scroll
    public loadMoreProfesores(): void {
        this.getProfesorOptions();
    }
}

