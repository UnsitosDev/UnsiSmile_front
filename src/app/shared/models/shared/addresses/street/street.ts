import { neighborhoodRequest, neighborhoodResponse } from "../neighborhood/neighborhood"

export interface streetRequest {

    "idStreet": number|null,
    "name": string,
    "neighborhood": neighborhoodRequest

}

export interface streetResponse {

    "idStreet": number,
    "name": string,
    "neighborhood": neighborhoodResponse
}