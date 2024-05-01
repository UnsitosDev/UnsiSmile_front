import { facialProfilesRequest, facialProfilesResponse } from "../facialProfiles/facialProfiles"

export interface facialFrontRequest {
    "idFacialExam": number|null,
    "distinguishingFeatures": "string",
    "facialProfile": facialProfilesRequest,
    "facialFront": facialFrontRequest
}

export interface facialFrontResponse {

    "idFacialExam": number,
    "distinguishingFeatures": "string",
    "facialProfile": facialProfilesResponse,
    "facialFront": facialFrontResponse
}