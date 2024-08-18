import { facialFrontRequest, facialFrontResponse } from "../facialFront/facialFront"
import { facialProfilesRequest, facialProfilesResponse } from "../facialProfiles/facialProfiles"

export interface facialExamRequest {
    "idFacialExam": number|null,
    "distinguishingFeatures": "string",
    "facialProfile": facialProfilesRequest,
    "facialFront": facialFrontRequest
}

export interface facialExamResponse {

    "idFacialExam": number,
    "distinguishingFeatures": "string",
    "facialProfile": facialProfilesResponse,
    "facialFront": facialFrontResponse
}