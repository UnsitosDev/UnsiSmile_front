export interface dentalCodeRequest {
    "idDentalCode": number|null,
    "code": string,
    "adult": boolean

}

export interface dentalCodeResponse {
    "idDentalCode": number,
    "code": string,
    "adult": boolean

}