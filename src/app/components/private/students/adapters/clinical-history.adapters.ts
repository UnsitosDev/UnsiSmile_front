// clinical-history.adapters.ts

import { AnswerField, dataTabs, FormField, formSectionFields, subSeccion, ValidationField, validationsFront } from "src/app/models/form-fields/form-field.interface";
import { Answer, AnswerType, ClinicalHistoryCatalog, FormSection, Question, SubSection, Validation, ValidationType } from "src/app/models/history-clinic/historyClinic";


export function mapClinicalHistoryToDataTabs(catalog: ClinicalHistoryCatalog): dataTabs {
    // Mapea la estructura del catálogo a la estructura de datos esperada en dataTabs
    return {
        title: catalog.clinicalHistoryName,
        tabs: catalog.formSections.map(section => mapFormSectionToFormSectionFields(section)),

    };
}

export function mapFormSectionToFormSectionFields(section: FormSection): formSectionFields {
    return {
        title: section.formName,
        childFormSection: section.subSections.length > 0
            ? section.subSections.map((subSection) => mapSubSectionToFormSectionFields(subSection))
            : null, // Si no hay subsecciones, asigna null
        seccion: section.questions.map((question) => mapQuestionToFormField(question)), // Mapea las preguntas de la sección principal
        component: determineSeccion(section),
        isAnswered: section.isAnswered
    };
}

// Función recursiva para mapear subsecciones
function mapSubSectionToFormSectionFields(subSection: SubSection): subSeccion {
    return {
        formName: subSection.formName,
        questions: subSection.questions.map((question) => mapQuestionToFormField(question)), // Mapea las preguntas de la subsección
    };
}

export function mapQuestionToFormField(question: Question): FormField {
    const grids = determineFieldGrids(question.answerType); // No combinamos, solo usamos uno por pregunta

    // Buscar las validaciones MIN_LENGHT,  MAX_LENGHT, REGEX
    let minValidation = question.questionValidations?.find(v => v.validationType.validationCode === 'MIN_LENGHT');
    let maxValidation = question.questionValidations?.find(v => v.validationType.validationCode === 'MAX_LENGHT');
    let regexValidation = question.questionValidations?.find(v => v.validationType.validationCode === 'REGEX');

    // Crear el objeto validationFnt para almacenar las validaciones
    const validationFnt: validationsFront = {
        regex: regexValidation ? regexValidation.validationValue : undefined, // Usar regex si está presente
        message: regexValidation?.validationMessage || '' // Mensaje de validación de regex, si está disponible
    };

    return {
        answerField: mapAnswerToAnswerField(question.answer),
        questionID: question.idQuestion,
        grids: grids || 'w-full', // Cambiar aquí para mapear a cada pregunta
        type: determineFieldType(question.answerType),
        name: question.questionText.replace(/\s+/g, '_').toLowerCase(),
        label: question.questionText,
        required: question.required,
        placeholder: question.placeholder,
        options: question.catalog ? question.catalog.catalogOptions.map(option => ({
            value: option.idCatalogOption,
            label: option.optionName
        })) : undefined,
        errorMessages: {},
        validations: question.questionValidations ? question.questionValidations.map(mapValidations) : [],
        min: minValidation ? minValidation.validationValue : undefined, // Asignar min si existe MIN_LENGHT
        max: maxValidation ? maxValidation.validationValue : undefined,  // Asignar max si existe MAX_LENGHT 
        validationFnt: validationFnt // Asignar la función de validación
    };
}

export function mapValidations(validation: Validation): ValidationField {
    return {
        idValidation: validation.idValidation,
        validationMessage: validation.validationMessage,
        validationType: validation.validationType,
        validationValue: validation.validationValue
    }
}

// Función para mapear el objeto Answer a AnswerField
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

export function determineFieldType(answerType: AnswerType): 'inputText' | 'inputNumber' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputFile' | 'textArea' | 'multivalued' | 'boolean' {
    switch (answerType.description.toUpperCase()) {
        case 'TEXT':
            return 'textArea'; // Retorna input específico para texto
        case 'DATE':
            return 'datepicker';
        case 'CATALOG':
            return 'select';
        case 'NUMERIC': // Retorna input específico para números
            return 'inputNumber';
        case 'MULTIVALUED':
            return 'multivalued';
        case 'BOOLEAN':
            return 'boolean';
        case 'SHORT_TEXT':
            return 'inputText'; // Usa 'inputText' para textos cortos
        case 'PHOTO':
            return 'inputFile'
        case 'LONG_TEXT':
            return 'textArea'
        default:
            return 'inputText'; // Valor por defecto es inputText para manejar textos
    }
}

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
            return 'col-span-12';
        case 'LONG_TEXT':
            return 'col-span-12'
        default:
            return 'col-span-4'; // Valor por defecto
    }
}

export function determineSeccion(seccionType: FormSection): string {
    switch (seccionType.formName) {
        case 'Odontograma inicial':
            return 'odontograma'; // Devuelve el HTML del componente
        case 'Odontograma final':
            return 'odontogramaFinal'
        case 'Medición de bolsas inicial':
            return 'initialBag'
        default:
            return ''; // Retorna una cadena vacía si no se requiere un componente especial
    }
}