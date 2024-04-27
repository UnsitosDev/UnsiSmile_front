import { hereditaryFamilyHistoryQuestionRequest, hereditaryFamilyHistoryQuestionResponse } from "../hereditaryFamilyHistoryQuestion/hereditaryFamilyHistoryQuestion"

export interface hereditaryFamilyHistoryRequest {
    "idFamilyHistory": 0,
    "familyHistoryQuestion":hereditaryFamilyHistoryQuestionRequest,
    "mainResponse": "string",
    "responseDetail": "string"
}

export interface hereditaryFamilyHistoryResponse {

    "idFamilyHistory": 0,
    "question": hereditaryFamilyHistoryQuestionResponse,
    "mainResponse": "string",
    "responseDetail": "string"
}