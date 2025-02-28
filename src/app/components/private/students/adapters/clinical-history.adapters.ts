// clinical-history.adapters.ts

import { AnswerField, dataTabs, FormField, formSectionFields, subSeccion, ValidationField, validationsFront } from "src/app/models/form-fields/form-field.interface";
import { Answer, AnswerType, ClinicalHistoryCatalog, FormSection, Question, SubSection, Validation, ValidationType } from "src/app/models/history-clinic/historyClinic";

// Mapea el catálogo de historia clínica a la estructura de datos de las pestañas (dataTabs)
export function mapClinicalHistoryToDataTabs(catalog: ClinicalHistoryCatalog): dataTabs {
    // Mapea la estructura del catálogo a la estructura de datos esperada en dataTabs
    return {
        title: catalog.clinicalHistoryName, // Asigna el nombre de la historia clínica
        tabs: catalog.formSections.map(section => mapFormSectionToFormSectionFields(section)), // Mapea las secciones del formulario
        medicalRecordNumber: catalog.medicalRecordNumber 
    };
}

// Mapea una sección del formulario a la estructura de campos de la sección
export function mapFormSectionToFormSectionFields(section: FormSection): formSectionFields {
    return {
        title: section.formName, 
        childFormSection: section.subSections.length > 0
            ? section.subSections.map((subSection) => mapSubSectionToFormSectionFields(subSection)) 
            : null, // Si no hay subsecciones, asigna null
        seccion: section.questions.map((question) => mapQuestionToFormField(question)),
        component: determineSeccion(section), 
        isAnswered: section.isAnswered // Verifica si la sección ha sido respondida
    };
}

// Mapea una subsección a la estructura de campos de la subsección
function mapSubSectionToFormSectionFields(subSection: SubSection): subSeccion {
    return {
        formName: subSection.formName, // Asigna el nombre de la subsección
        questions: subSection.questions.map((question) => mapQuestionToFormField(question)), // Mapea las preguntas de la subsección
        isAnswered: subSection.isAnswered,
        order: subSection.order
    };
}

// Mapea una pregunta a un campo del formulario
export function mapQuestionToFormField(question: Question): FormField {

    const grids = determineFieldGrids(question.answerType); 

    // Busca las validaciones MIN_LENGHT, MAX_LENGHT y REGEX
    let minValidation = question.questionValidations?.find(v => v.validationType.validationCode === 'MIN_LENGHT');
    let maxValidation = question.questionValidations?.find(v => v.validationType.validationCode === 'MAX_LENGHT');
    let regexValidation = question.questionValidations?.find(v => v.validationType.validationCode === 'REGEX');

    // Crea el objeto validationFnt para almacenar las validaciones de regex
    const validationFnt: validationsFront = {
        regex: regexValidation ? regexValidation.validationValue : undefined,
        message: regexValidation?.validationMessage || ''
    };

    return {
        answerField: mapAnswerToAnswerField(question.answer), 
        questionID: question.idQuestion, 
        grids: grids || 'w-full', 
        type: determineFieldType(question.answerType), 
        name: question.questionText.replace(/\s+/g, '_').toLowerCase(), 
        label: question.questionText, 
        required: question.required, 
        order: question.order,
        placeholder: question.placeholder,
        options: question.catalog ? question.catalog.catalogOptions.map(option => ({
            value: option.idCatalogOption,
            label: option.optionName
        })) : undefined, // Mapea las opciones del catálogo
        errorMessages: {},
        min: minValidation ? minValidation.validationValue : undefined, 
        max: maxValidation ? maxValidation.validationValue : undefined,  
        validationFnt: validationFnt
    };
}

// Mapea una validación a un campo de validación
export function mapValidations(validation: Validation): ValidationField {
    return {
        idValidation: validation.idValidation,
        validationMessage: validation.validationMessage,
        validationType: validation.validationType,
        validationValue: validation.validationValue
    }
}

// Mapea una respuesta a un campo de respuesta (AnswerField)
 function mapAnswerToAnswerField(answer: Answer | null): AnswerField | undefined {
    if (!answer) {
        return undefined;
    }
    return {
        answerBoolean: answer.answerBoolean,
        answerCatalogOption: answer.answerCatalogOption,
        answerDate: answer.answerDate,
        answerNumeric: answer.answerNumeric,
        answerText: answer.answerText,
        files: answer.files,
        idAnswer: answer.idAnswer,
    };
}

// Determina el tipo de campo basado en el tipo de respuesta (AnswerType)
export function determineFieldType(answerType: AnswerType): 'inputText' | 'inputNumber' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputFile' | 'textArea' | 'multivalued' | 'boolean' {
    switch (answerType.description.toUpperCase()) {
        case 'TEXT':
            return 'textArea';
        case 'DATE':
            return 'datepicker';
        case 'CATALOG':
            return 'select';
        case 'NUMERIC': 
            return 'inputNumber';
        case 'MULTIVALUED':
            return 'multivalued';
        case 'BOOLEAN':
            return 'boolean';
        case 'SHORT_TEXT':
            return 'inputText'; 
        case 'PHOTO':
            return 'inputFile'
        case 'LONG_TEXT':
            return 'textArea'
        default:
            return 'inputText'; // Valor por defecto es inputText para manejar textos
    }
}

// Determina el tamaño del campo en la cuadrícula según el tipo de respuesta
export function determineFieldGrids(answerType: AnswerType): string {
    switch (answerType.description) {
        case 'MULTIVALUED':
            return 'col-span-12'; // Ocupa todo el ancho
        case 'BOOLEAN':
            return 'col-span-12'; // Ocupa todo el ancho
        case 'SHORT_TEXT':
            return 'col-span-4'; // Ocupa un tercio
        case 'NUMERIC':
            return 'col-span-4'; // Ocupa un tercio
        case 'PHOTO':
            return 'col-span-12'; // Ocupa todo el ancho
        case 'LONG_TEXT':
            return 'col-span-12'  // Ocupa todo el ancho
        default:
            return 'col-span-4'; // Valor por defecto
    }
}

// Determina el componente de la sección basado en su nombre
export function determineSeccion(seccionType: FormSection): string {
    switch (seccionType.formName) {
        case 'Odontograma inicial':
            return 'odontograma'; 
        case 'Odontograma final':
            return 'odontogramaFinal'
        case 'Medición de bolsas inicial':
            return 'initialBag'
        default:
            return ''; // Retorna una cadena vacía si no se requiere un componente especial
    }
}