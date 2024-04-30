import { ethnicGroupResponse } from "src/app/models/shared/patients/EthnicGroup/ethnicGroup"
import { guardianRequest, guardianResponse } from "src/app/models/shared/patients/Guardian/guardian"
import { maritalStatusResponse } from "src/app/models/shared/patients/MaritalStatus/maritalStatus"
import { occupationResponse } from "src/app/models/shared/patients/Occupation/occupation"
import { religionResponse } from "src/app/models/shared/patients/Religion/religion"
import { addressRequest, addressResponse } from "../../addresses/address/address"
import { nationalityResponse } from "../Nationality/Nationality"
import { personRequest, personResponse } from "src/app/components/private/students/components/students-general-history/models/person/person"

export interface studentRequest {
  "idPatient": number|null,
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

export interface studentResponse {

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
  "guardian": guardianResponse

}