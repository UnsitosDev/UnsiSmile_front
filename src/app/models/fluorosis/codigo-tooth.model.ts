export enum CodigoTooth {
  Normal = 0,
  Leve = 1,
  Moderado = 2,
  Intenso = 3,
  Hipoplasia = 4
}

export interface DentalTreatmentPayload {
  idTreatment: number;
  teeth: {
    idTooth: string;
    code: CodigoTooth;
  }[];
}
