import { personRequest, personResponse } from "src/app/components/private/students/components/students-general-history/models/person/person"
import { addressRequest, addressResponse } from "../../addresses/address/address"
import { guardianRequest, guardianResponse } from "../Guardian/guardian"
import { religionResponse } from "../Religion/religion"
import { ethnicGroupResponse } from "../EthnicGroup/ethnicGroup"
import { occupationResponse } from "../Occupation/occupation"
import { maritalStatusResponse } from "../MaritalStatus/maritalStatus"
import { nationalityResponse } from "../Nationality/Nationality"
import { medicalHistoryResponse } from "../medicalHistory/medicalHistory"

export interface patientRequest {

  "idPatient": number | null,
  "admissionDate": Date,
  "isMinor": boolean,
  "hasDisability": boolean,
  "nationalityId": number,
  "person": personRequest,
  "address": addressRequest,
  "maritalStatusId": number,
  "occupationId": number,
  "ethnicGroupId": number,
  "religionId": number,
  "guardian": guardianRequest

}


export interface patientResponse {

  "idPatient": number,
    "admissionDate": Date,
    "isMinor": boolean,
    "hasDisability": boolean,
    "nationality": nationalityResponse,
    "person": personResponse,
    "address": addressResponse,
    "maritalStatus": maritalStatusResponse,
    "occupation": occupationResponse,
    "ethnicGroup": ethnicGroupResponse,
    "religion": religionResponse,
    "guardian": guardianResponse,
    "medicalHistoryResponse": medicalHistoryResponse
}

