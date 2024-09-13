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

export interface dataTabs {
    title: string;
    tabs: formSectionFields[];
}

export interface formSectionFields {
    title: string;
    childFormSection: formSectionFields | null;
    seccion: FormField[] | null;    
}

export interface FormField {
    // Tipo de campo de formulario. Puede ser 'input', 'datepicker', 'checkbox', 
    // 'select', 'group', 'inputEvent', 'autocomplete', 'inputNumber', 
    // 'inputFile' o 'textArea'.
    type: 'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber' | 'inputFile' | 'textArea';
    // Nombre del campo, utilizado para identificarlo en el formulario.
    name: string; 
    // Etiqueta que se muestra junto al campo.
    label: string; 
    // Indica si el campo es obligatorio.
    required?: boolean; 
    // Opciones disponibles para campos de tipo 'select'.
    options?: FormFieldOption[];
    // Validadores personalizados que se aplican al campo. 
    validators?: ValidatorFn[]; 
    // Valor actual del campo.
    value?: any; 
    // Tipo de entrada HTML para campos de tipo 'input'.
    typeInput?: string;
    // Tipos de archivos permitidos en campos de tipo 'inputFile'. 
    accept?: string; 
    // Texto de marcador de posición que se muestra en el campo.
    placeholder?: string; 
    // Mensajes de error personalizados para diferentes validaciones.
    errorMessages?: { [key: string]: string }; 
    // Campos anidados para crear grupos de campos.
    fields?: FormField[];  
    // Función que se ejecuta al hacer clic en el campo.
    onClick?: (event: MouseEvent) => void;
    // Función que se ejecuta al cambiar el valor del campo. 
    onInputChange?: { 
        changeFunction: (param: string) => void;
        length: number
    }
    // Función que se ejecuta al cambiar el valor en campos de autocompletado.
    onInputAutocomplete?: { 
        changeFunction: (param: string) => void;
        length: number;
    };

}
