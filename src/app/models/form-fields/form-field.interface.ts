import { ValidatorFn } from '@angular/forms';


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
    medicalRecordNumber: number;
    idClinicalHistoryCatalog: number;
    idPatientMedicalRecord: number
}

export interface formSectionFields {
    title: string;
    childFormSection: subSeccion[] | null;
    seccion: FormField[] | null;
    component?: string;
    isAnswered?: boolean;
    idFormSection: string;
    status: string;
    idReviewStatus: number;
    message: string;
    requiresReview: boolean;
}

export interface subSeccion {
    formName: string; // Nombre de la subsección
    questions: FormField[] ; 
    isAnswered?: boolean;
    order?: number;
}
export interface FormFieldOption {
    value: any;
    label: string;
}

export interface AnswerField {
    answerBoolean: boolean | null;
    answerCatalogOption: any | null;
    answerDate: string | number[] | null ;
    answerNumeric: number | null;
    answerText: string | null;
    files: any;
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

export interface validationsFront {
    regex?: string;
    message: string
}
export interface FormField {
    order?: number;
    min?: string;
    max?: string;
    validationFnt?: validationsFront;
    answerField?: AnswerField;
    questionID?: number;
    grids?: string;
    type:'autocompleteoptions'| 'inputText' | 'inputNumber' | 'boolean' |'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber' | 'inputFile' | 'textArea'| 'multivalued';
    name: string ;
    label: string;
    validations?: ValidationField[];
    required?: boolean;
    disabled?: boolean;
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
