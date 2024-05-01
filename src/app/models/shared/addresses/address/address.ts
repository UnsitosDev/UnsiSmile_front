import { housingRequest, housingResponse } from "../housing/housing"
import { streetRequest, streetResponse } from "../street/street"

export interface addressRequest {
    "idAddress": number | null,
    "streetNumber": string,
    "interiorNumber": string,
    "housing": housingRequest,
    "street": streetRequest
}

export interface addressResponse {


    "idAddress": number | null,
    "streetNumber": string,
    "interiorNumber": string,
    "housing": housingResponse,
    "street": streetResponse

}