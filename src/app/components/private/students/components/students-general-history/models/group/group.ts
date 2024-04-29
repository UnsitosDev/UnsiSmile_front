import { careersRequest, careersResponse } from "../careers/careers"

export interface groupRequest {
    "id": number|null,
    "groupName": string,
    "career": careersRequest

}

export interface groupResponse {
    "idGroup": number,
    "groupName": string,
    "career": careersResponse

}