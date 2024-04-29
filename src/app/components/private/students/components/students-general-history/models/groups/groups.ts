import { careersRequest, careersResponse } from "../careers/careers"

export interface groupsRequest {

    "groupName": string,
    "career": careersRequest
}

export interface groupsResponse {

    "idGroup": number,
    "groupName": string,
    "career": careersResponse

}