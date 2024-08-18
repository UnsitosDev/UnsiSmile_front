import { genderRequest, genderResponse } from "../genders/genders"

export interface personRequest {
    "curp": string,
    "firstName": string,
    "secondName": string,
    "firstLastName": string,
    "secondLastName": string,
    "phone": number,
    "birthDate": Date,
    "email": string,
    "gender": genderRequest
}


export interface personResponse {
    "curp": string,
    "firstName": string,
    "secondName": string,
    "firstLastName": string,
    "secondLastName": string,
    "phone": string,
    "birthDate": Date,
    "email": string,
    "gender": genderResponse

}