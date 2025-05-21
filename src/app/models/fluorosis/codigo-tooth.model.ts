export enum CodigoTooth {
  Normal = 0,
  Leve = 1,
  Moderado = 2,
  Intenso = 3,
  Hipoplasia = 4
}

export interface DentalTreatmentPayload {
  idTreatment:  number;
  teeth: {
    idTooth:    string;
    code:       CodigoTooth;
  }[];
}

export interface FluorosisResponse {
  idFluorosis: number;
  creationDate: [number, number, number];
  teethFluorosis: ToothFluorosis[];
}

export interface ToothFluorosis {
  idTooth: string;
  faces: ToothFaceFluorosis[];
  conditions: never[];
}

export interface ToothFaceFluorosis {
  idFace: string;
  conditions: FaceConditionFluorosis[];
}

export interface FaceConditionFluorosis {
  idCondition: number;
}
