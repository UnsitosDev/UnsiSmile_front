export interface guardianRequest {


    "idGuardian": number|null,
    "firstName": string,
    "lastName": string,
    "phone": string,
    "email": string

}

export interface guardianResponse {
    "idGuardian": number,
    "firstName": string,
    "lastName": string,
    "phone": string,
    "email": string
}