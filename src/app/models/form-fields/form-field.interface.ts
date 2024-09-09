import { FormGroup, ValidatorFn } from '@angular/forms';

export interface FormFieldOption {
    value: any;
    label: string;
}

// Interfaz para la configuración de onInputChange
export interface InputChangeConfig {
    service: string;
    method: string;
    minLength: number;
}

export interface FormField {
    type: 'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber';
    name: string;
    label: string;
    required?: boolean;
    options?: FormFieldOption[]; // Opcional para campos select
    validators?: ValidatorFn[]; // Validadores personalizados
    value?: any;
    placeholder?: string;
    errorMessages?: { [key: string]: string };
    fields?: FormField[]; // Campos anidados para 'group'
    onClick?: (event: MouseEvent) => void;
    onInputChange?: {
        changeFunction: (param: string) => void;
        length: number
    }
    onInputAutocomplete?: {
        changeFunction: (param: string) => void;
        length: number;
    };

}
