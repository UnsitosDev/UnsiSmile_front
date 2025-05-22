export interface FormSectionReview {
    idFormSection:  number;
    formName:       string;
    isAnswered:     boolean;
    requiresReview: boolean;
    reviewStatus:   ReviewStatus;
    questions:      Question[];
}

interface Question {
    idQuestion:          number;
    questionText:        string;
    placeholder:         string;
    required:            boolean;
    order:               number;
    answerType:          AnswerType;
    catalog:             Catalog;
    answer:              Answer;
    questionValidations: QuestionValidation[];
}

interface Answer {
    idAnswer:            number;
    answerBoolean:       boolean;
    answerNumeric:       number;
    answerText:          string;
    answerDate:          Date;
    answerCatalogOption: CatalogOption;
    files:               File[];
}

interface CatalogOption {
    idCatalogOption: number;
    optionName:      string;
}

interface File {
    idFile:   string;
    fileName: string;
    filePath: string;
    fileType: string;
}

interface AnswerType {
    idAnswerType: number;
    description:  string;
}

interface Catalog {
    idCatalog:      number;
    catalogName:    string;
    catalogOptions: CatalogOption[];
}

interface QuestionValidation {
    idValidation:      number;
    validationValue:   string;
    validationMessage: string;
    validationType:    ValidationType;
}

interface ValidationType {
    idValidationType: number;
    validationCode:   string;
}

interface ReviewStatus {
    idReviewStatus: number;
    status:         string;
    message:        string;
}
