import { municipalityRequest, municipalityResponse } from "../municipality/municipality"

export interface localityRequest {
    "idLocality": string|null,
    "name": string,
    "postalCode": string,
    "municipality": municipalityRequest
}

export interface localityResponse {
    "idLocality": string,
    "name": string,
    "postalCode": string,
    "municipality": municipalityResponse
}

export interface localityOptions {
    value: string;
    label: string;
}