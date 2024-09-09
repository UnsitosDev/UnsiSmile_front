import { inject, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';

@Injectable({
    providedIn: 'root'
})
export class personalPathologicalHistoryFormService {
    private personalPathologicalHistoryFields : FormField[] = [
            {
                type: "input",
                label: "¿Has sido hospitalizado? ¿Cuál fue el motivo?",
                name: "hospitalizationDetails",
                required: true,
                validators: [Validators.required],
                errorMessages: {
                    required: "Indica si has sido hospitalizado y el motivo."
                },
                value: ""
            },
            {
                type: "input",
                label: "¿Ha tomado algún medicamento recientemente? ¿Cuál es el motivo?",
                name: "medicationDetails",
                required: true,
                validators: [Validators.required],
                errorMessages: {
                    required: "Indica si has tomado medicamentos y el motivo."
                },
                value: ""
            },
            {
                type: "input",
                label: "¿Ha tenido algún problema con la anestesia dental o anestesia general? ¿Cuál fue el problema?",
                name: "anesthesiaProblemDetails",
                required: true,
                validators: [Validators.required],
                errorMessages: {
                    required: "Indica si has tenido problemas con la anestesia y cuál fue el problema."
                },
                value: ""
            },
            {
                type: "input",
                label: "¿Es alérgico/a a algún medicamento o sustancia? ¿Cuál es la sustancia?",
                name: "allergyDetails",
                required: true,
                validators: [Validators.required],
                errorMessages: {
                    required: "Indica si eres alérgico/a a algo y a qué sustancia."
                },
                value: ""
            },
            {
                type: "input",
                label: "¿Está embarazada? ¿Cuántos meses de embarazo tiene?",
                name: "pregnancyDetails",
                required: true,
                validators: [Validators.required],
                errorMessages: {
                    required: "Indica si está embarazada y los meses de embarazo."
                },
                value: ""
            }
    ];

    private noPersonalPathologicalHistoryFields: FormField[] = [
        {
            type: "input",
            label: "Horas que duerme al día",
            typeInput: 'number',
            name: "sleepHours",
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: "Ingresa las horas que duerme al día."
            },
            placeholder: "EJ: 8",
            value: ""
        },
        {
            type: "input",
            label: "Cuántas veces a la semana se baña",
            typeInput: 'number',
            name: "bathingFrequency",
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: "Indica cuántas veces se baña a la semana."
            },
            placeholder: "EJ: 7",
            value: ""
        },
        {
            type: "input",
            label: "Cuántas veces al día cepilla sus dientes",
            typeInput: 'number',
            name: "teethBrushingFrequency",
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: "Ingresa cuántas veces se cepilla los dientes."
            },
            placeholder: "EJ: 3",
            value: ""
        },
        {
            type: "select",
            label: "Su vivienda tiene Piso",
            name: "hasFloor",
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: "Selecciona si su vivienda tiene piso."
            },
            options: [
                { value: 1, label: 'Sí' },
                { value: 2, label: 'No' },
            ]
        },
        {
            type: "select",
            label: "Material de la Vivienda",
            name: "housingMaterial",
            required: true,
            validators: [Validators.required],
            errorMessages: {
                required: "Selecciona el material de su vivienda."
            },
            options: [
                { value: 1, label: 'Ladrillo' },
                { value: 2, label: 'Madera' },
                { value: 3, label: 'Adobe' }
            ]
        }
    ];

    getnoPathologicalHistoryFields(): FormField[] {
        return this.noPersonalPathologicalHistoryFields;
    }

    getpathologicalHistoryFields(): FormField[] {
        return this.personalPathologicalHistoryFields;
    }
}