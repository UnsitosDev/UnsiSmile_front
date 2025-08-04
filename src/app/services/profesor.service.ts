import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UriConstants } from '@mean/utils';
import { FormField } from '../models/form-fields/form-field.interface';
import { curpValidator, phoneNumberValidator, employeeNumberValidator, emailValidator } from '../utils/validators';
import { PatientService } from './patient/patient.service';
import { FieldNames } from '../models/form-fields/form-utils';

@Injectable({
    providedIn: 'root'
})
export class ProfesorService {
    apiService = inject(ApiService);
    patientService = inject(PatientService);
    responsibleProfessor = 13;
    careerOptions: Array<{ value: string; label: string }> = [];


    private personalDataFields: FormField[] = [
        {
            type: 'input',
            label: 'Primer Nombre',
            name: 'firstName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Primer Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Segundo Nombre',
            name: 'secondName',
            required: false,
            errorMessages: {
                required: 'El campo Segundo Nombre es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Paterno',
            name: 'firstLastName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Paterno es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Apellido Materno',
            name: 'secondLastName',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Apellido Materno es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Numero de trabajador',
            name: 'employeeNumber',
            required: true,
            validators: [Validators.required, employeeNumberValidator()],
            errorMessages: {
                required: 'El campo Numero de trabajador es requerido.'
            }
        },
        {
            type: 'input',
            label: 'CURP',
            name: 'curp',
            required: true,
            validators: [Validators.required, curpValidator()],
            errorMessages: {
                required: 'El campo CURP es requerido.',
                lastError: 'Introduzca una CURP válida'
            }
        },
        {
            type: 'input',
            label: 'Teléfono',
            name: 'phone',
            required: false,
            validators: [phoneNumberValidator()],
            errorMessages: {
                lastError: 'Por favor, introduce un número de teléfono válido.'
            }
        },
        {
            type: 'datepicker',
            label: 'Fecha de Nacimiento',
            name: 'birthDate',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Fecha de Nacimiento es requerido.'
            }
        },
        {
            type: 'input',
            label: 'Correo electrónico',
            name: 'email',
            required: true,
            validators: [Validators.required, Validators.email, emailValidator()],
            errorMessages: {
                required: 'El campo Correo electrónico es requerido.',
                lastError: 'Por favor, introduce un correo electrónico válido.'
            }
        },
        {
            type: 'select',
            label: 'Género',
            name: 'gender',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Género es requerido.'
            },
            onClick: this.handleGenderClick.bind(this)
        },
        {
            type: 'select',
            label: 'Carrera',
            name: 'career',
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: 'El campo Carrera es requerido.'
            },
            onClick: this.handleCareerClick.bind(this)
        }
    ];

    constructor() {
        this.patientService.getGender();
        setTimeout(() => {
            this.handleGenderClick({} as MouseEvent);
        }, 0);
    }

    public getProfesorArea(): Observable<any> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_PROFESSOR_CLINICAL_AREAS}`,
            data: {},
        });
    }

    private handleGenderClick(event: MouseEvent): void {
        this.patientService.getGender();
        const genderField = this.personalDataFields.find(field => field.name === FieldNames.GENDER);
        if (genderField) {
            genderField.options = this.patientService.genderOptions;
        }
    }

    private handleCareerClick(): void {
        this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: UriConstants.GET_CAREERS,
            data: {}
        }).subscribe({
            next: (response: Array<{ idCareer: string, career: string }>) => {
                this.careerOptions = response.map(item => ({
                    value: item.idCareer,
                    label: item.career
                }));
                const careerField = this.personalDataFields.find(field => field.name === 'career');
                if (careerField) {
                    careerField.options = this.careerOptions;
                }
            }
        });
    }

    getPersonalDataFields(): FormField[] {
        return this.personalDataFields;
    }
}
