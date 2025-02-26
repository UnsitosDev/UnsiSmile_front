export interface Answer {
    idAnswer: number;
    answerBoolean: boolean | null;
    answerNumeric: number | null;
    answerText: string | null;
    answerDate: string | null; 
    answerCatalogOption: any | null; 
    files: File[];
}

export interface File {
    idFile: string;
    fileName: string;
    filePath: string;
    fileType: string;
}

export interface AnswerType {
    idAnswerType: number;
    description: string;
}

export interface Question {
    idQuestion: number;
    questionText: string;
    placeholder: string | null;
    required: boolean;
    order: number;
    answerType: AnswerType;
    catalog: any | null; 
    answer: Answer;
    questionValidations: any[]; 
}

export interface FormSection {
    idFormSection: number;
    formName: string;
    isAnswered: boolean;
    subSections: any[]; 
    questions: Question[];
}