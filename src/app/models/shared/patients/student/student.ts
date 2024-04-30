import { personRequest, personResponse } from "src/app/components/private/students/components/students-general-history/models/person/person"

export interface studentRequest {

    "enrollment": "string",
    "user": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "username": "string",
        "role": {
            "idRole": 0,
            "role": "ROLE_ADMIN"
        }
    },
    "person": personRequest


}

export interface studentResponse {

    "enrollment": "string",
    "user": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "username": "string",
        "role": {
            "idRole": 0,
            "role": "ROLE_ADMIN"
        }
    },
    "person": personResponse

}