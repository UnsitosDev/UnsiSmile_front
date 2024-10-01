// clinical-history.adapters.ts

import { dataTabs, FormField, formSectionFields } from "src/app/models/form-fields/form-field.interface";
import { AnswerType, ClinicalHistoryCatalog, FormSection, Question } from "src/app/models/history-clinic/historyClinic";

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
        childFormSection: null,
        seccion: section.questions.map((question) => mapQuestionToFormField(question)),
    };
}

export function mapQuestionToFormField(question: Question): FormField {
    return {
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

export function determineFieldType(answerType: AnswerType): 'input' | 'datepicker' | 'checkbox' | 'select' | 'group' | 'inputEvent' | 'autocomplete' | 'inputNumber' | 'inputFile' | 'textArea' {
    switch (answerType.description) {
        case 'text':
            return 'input';
        case 'date':
            return 'datepicker';
        case 'checkbox':
            return 'checkbox';
        case 'select':
            return 'select';
        default:
            return 'input'; // Valor por defecto
    }
}
