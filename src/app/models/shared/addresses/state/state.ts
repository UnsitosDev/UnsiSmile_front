export interface stateRequest {

    "idState": number,
    "name": string

}

export interface stateResponse {

    "idState": string, //decia string
    "name": string

}

export interface stateGroupOptions {
    value: string;
    label: string;
}

export interface stateOptions {
    value: string;
    label: string;
}