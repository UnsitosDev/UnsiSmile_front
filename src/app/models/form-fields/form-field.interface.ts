import { FormGroup, ValidatorFn } from '@angular/forms';
import { Answer } from '../history-clinic/historyClinic';


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
    component?: string
}

export interface subSeccion {
    formName: string; // Nombre de la subsección
    questions: FormField[] ; 
}
export interface FormFieldOption {
    value: any;
    label: string;
}

export interface AnswerField {
    answerBoolean: boolean | null;
    answerCatalogOption: any | null;
    answerDate: string | null;
    answerNumeric: number | null;
    answerText: string | null;
    files: boolean | null;
    idAnswer: number | null;
}

export interface validationTypeField {
    idValidationType: number;  // ID del tipo de validación
    validationCode: string;     // Código de la validación
}

export interface ValidationField {
    idValidation: number;        // ID de la validación
    validationValue: string;     // Valor de validación (puede ser regex, min, max, etc.)
    validationMessage: string;   // Mensaje asociado a la validación
    validationType: validationTypeField;  // Tipo de validación
}

export interface FormField {
    answerField?: AnswerField;
    questionID?: number;
    grids?: string;
    type:'inputText' | 'inputNumber' | 'boolean' |'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber' | 'inputFile' | 'textArea'| 'multivalued';
    name: string ;
    label: string;
    validations?: ValidationField[];
    required?: boolean;
    options?: FormFieldOption[];
    validators?: ValidatorFn[];
    value?: any;
    typeInput?: string;
    accept?: string;
    placeholder?: any;
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
