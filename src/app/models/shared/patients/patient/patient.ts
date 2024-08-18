import { addressRequest, addressResponse } from "../../addresses/address/address"
import { ethnicGroupResponse } from "../EthnicGroup/ethnicGroup"
import { guardianRequest, guardianResponse } from "../Guardian/guardian"
import { maritalStatusResponse } from "../MaritalStatus/maritalStatus"
import { nationalityResponse } from "../Nationality/Nationality"
import { occupationResponse } from "../Occupation/occupation"
import { religionResponse } from "../Religion/religion"
import { medicalHistoryResponse } from "../medicalHistory/medicalHistory"
import { Pageable, Sort } from "../../paginatedResponse"
import { personRequest, personResponse } from "src/app/models/models-students/person/person"

export interface patientRequest {

  idPatient: number | null,
  admissionDate: Date,
  isMinor: boolean,
  hasDisability: boolean,
  nationalityId: number,
  person: personRequest,
  address: addressRequest,
  maritalStatusId: number,
  occupationId: number,
  ethnicGroupId: number,
  religionId: number,
  guardian: guardianRequest

}


export interface Patient {

  idPatient: number,
    admissionDate: Date,
    isMinor: boolean,
    hasDisability: boolean,
    nationality: nationalityResponse,
    person: personResponse,
    address: addressResponse,
    maritalStatus: maritalStatusResponse,
    occupation: occupationResponse,
    ethnicGroup: ethnicGroupResponse,
    religion: religionResponse,
    guardian: guardianResponse,
    medicalHistoryResponse: medicalHistoryResponse
}


export interface PatientResponse {
  content: Patient[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}