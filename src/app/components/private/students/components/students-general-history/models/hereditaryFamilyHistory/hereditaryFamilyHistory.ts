import { hereditaryFamilyHistoryQuestionRequest, hereditaryFamilyHistoryQuestionResponse } from "../hereditaryFamilyHistoryQuestion/hereditaryFamilyHistoryQuestion"

export interface hereditaryFamilyHistoryRequest {
    "idFamilyHistory": number|null,
    "familyHistoryQuestion":hereditaryFamilyHistoryQuestionRequest,
    "mainResponse": "string",
    "responseDetail": "string"
}

export interface hereditaryFamilyHistoryResponse {

    "idFamilyHistory": number,
    "question": hereditaryFamilyHistoryQuestionResponse,
    "mainResponse": "string",
    "responseDetail": "string"
}