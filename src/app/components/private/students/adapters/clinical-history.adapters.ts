// clinical-history.adapters.ts

import { dataTabs, FormField, formSectionFields, subSeccion } from "src/app/models/form-fields/form-field.interface";
import { AnswerType, ClinicalHistoryCatalog, FormSection, Question, SubSection } from "src/app/models/history-clinic/historyClinic";

export function mapClinicalHistoryToDataTabs(catalog: ClinicalHistoryCatalog): dataTabs {
    // Mapea la estructura del catálogo a la estructura de datos esperada en dataTabs
    return {
        title: catalog.clinicalHistoryName,
        tabs: catalog.formSections.map(section => mapFormSectionToFormSectionFields(section))
    };
}

export function mapFormSectionToFormSectionFields(section: FormSection): formSectionFields {
    return {
        title: section.formName,
        childFormSection: section.subSections.length > 0
            ? section.subSections.map((subSection) => mapSubSectionToFormSectionFields(subSection))
            : null, // Si no hay subsecciones, asigna null
        seccion: section.questions.map((question) => mapQuestionToFormField(question)), // Mapea las preguntas de la sección principal
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
    return {
        grids:grids || 'w-full', // Cambiar aquí para mapear a cada pregunta
        type: determineFieldType(question.answerType),
        name: question.questionText.replace(/\s+/g, '_').toLowerCase(),
        label: question.questionText,
        required: question.required,
        placeholder: question.placeholder || undefined,
        options: question.catalog ? question.catalog.catalogOptions.map(option => ({
            value: option.idCatalogOption,
            label: option.optionName
        })) : undefined,
        errorMessages: {},
    };
}


export function determineFieldType(answerType: AnswerType): 'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber' | 'inputFile' | 'textArea' | 'multivalued' | 'boolean' {
    switch (answerType.description.toUpperCase()) {
        case 'TEXT':
            return 'input';
        case 'DATE':
            return 'datepicker';
        case 'CATALOG':
            return 'select';
        case 'NUMERIC': // Corresponde a 'input' para valores numéricos
            return 'input';
        case 'MULTIVALUED':
            return 'multivalued';
        case 'BOOLEAN':
            return 'boolean';
        case 'SHORT_TEXT':
            return 'input';
        default:
            return 'input'; // Valor por defecto
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
        default:
            return 'col-span-4'; // Valor por defecto
    }
}
