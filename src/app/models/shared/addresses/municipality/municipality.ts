import { stateRequest, stateResponse } from "../state/state"

export interface municipalityRequest {
    "idMunicipality": string | null,
    "name": string,
    "state": stateRequest
}

export interface municipalityResponse {


    "idMunicipality": string,
    "name": string,
    "state": stateResponse

}