import { ValidatorFn } from '@angular/forms';

export interface FormFieldOption {
    value: any;
    label: string;
}

export interface FormField {
    type: 'input' | 'datepicker' | 'checkbox' | 'select' | 'group'; // Tipos de campo permitidos
    name: string;
    label: string;
    required?: boolean;
    options?: FormFieldOption[]; // Opcional para campos select
    validators?: ValidatorFn[]; // Validadores personalizados
    value?: any;
    errorMessages?: { [key: string]: string };
    fields?: FormField[]; // Campos anidados para 'group'
}
