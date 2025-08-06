export interface guardianRequest {


    "idGuardian": number|null,
    "firstName": string,
    "lastName": string,
    "phone": string,
    "email": string

}

export interface guardianResponse {
    idGuardian: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    parentalStatus?: {
      idCatalogOption: number;
      optionName: string;
    };
    doctorName?: string;
  }
