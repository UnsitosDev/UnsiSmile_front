import { FormGroup, ValidatorFn } from '@angular/forms';


// Interfaz para la configuración de onInputChange
export interface InputChangeConfig {
    service: string;
    method: string;
    minLength: number;
}
export interface HistoryData {
    title: string;
    tabs: formSectionFields[];
}

export interface dataTabs {
    title: string;
    tabs: formSectionFields[];
}

export interface formSectionFields {
    title: string;
    childFormSection: subSeccion[] | null;
    seccion: FormField[] | null;
}

export interface subSeccion {
    formName: string; // Nombre de la subsección
    questions: FormField[] ; 
}
export interface FormFieldOption {
    value: any;
    label: string;
}

export interface FormField {
    questionID?: number;
    grids?: string;
    type:'inputText' | 'inputNumber' | 'boolean' |'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber' | 'inputFile' | 'textArea'| 'multivalued';
    name: string;
    label: string;
    required?: boolean;
    options?: FormFieldOption[];
    validators?: ValidatorFn[];
    value?: any;
    typeInput?: string;
    accept?: string;
    placeholder?: string;
    errorMessages?: { [key: string]: string };
    fields?: FormField[];
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
