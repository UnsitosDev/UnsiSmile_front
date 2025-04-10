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
import { MatExpansionPanelDescription } from "@angular/material/expansion"

export interface patientRequest {
  hasDisability: boolean;
  nationalityId: number;
  person: {
    curp: string;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    phone: string;
    birthDate: string;
    email: string;
    gender: {
      idGender: number;
      gender: string;
    }
  };
  address: {
    idAddress: number;
    streetNumber: string;
    interiorNumber: string;
    housing: {
      idHousing: number;
      category: string;
    };
    street: {
      idStreet: number;
      name: string;
      neighborhood: {
        idNeighborhood: number;
        name: string;
        locality: {
          idLocality: number;
          name: string;
          postalCode: string;
          municipality: {
            idMunicipality: number;
            name: string;
            state: {
              idState: number;
              name: string;
            }
          }
        }
      }
    }
  };
  maritalStatus: {
    idMaritalStatus: number;
    maritalStatus: string;
  };
  occupation: {
    idOccupation: number;
    occupation: string;
  };
  ethnicGroup: {
    idEthnicGroup: number;
    ethnicGroup: string;
  };
  religion: {
    idReligion: number;
    religion: string;
  };
  guardian?: {
    idGuardian: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    parentalStatus: {
      idCatalogOption: number;
      optionName: string;
      idCatalog: number;
    };
    doctorName: string;
  };
}

export interface Patient {
    idPatient: string,
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
    medicalRecordNumber?: number
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

export interface parentsMaritalStatusResponse {
  "idCatalogOption": number,
  "optionName": string
}
