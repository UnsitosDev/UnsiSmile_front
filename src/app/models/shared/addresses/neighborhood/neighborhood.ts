import { localityRequest, localityResponse } from "../locality/locality"

export interface neighborhoodRequest {
    "idNeighborhood": number | null,
    "name": string,
    "locality": localityRequest
}

export interface neighborhoodResponse {


    "idNeighborhood": number,
    "name": string,
    "locality": localityResponse

}