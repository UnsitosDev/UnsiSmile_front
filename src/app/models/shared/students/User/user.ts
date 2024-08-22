import { rolRequest, rolResponse } from "../Rol/rol"

export interface userRequest {
    "idUser": number | null,
    "username": string,
    "password": string,
    "role": rolRequest
}

export interface userResponse {
    "idUser": number,
    "username": string,
    "password": string,
    "role": rolResponse
}