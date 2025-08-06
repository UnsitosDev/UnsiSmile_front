export interface Condition {
  idCondition: number;
  condition: string;
  description: string;
}

export interface Face {
  idFace: string;
  conditions: Condition[];
}

export interface ToothProphylaxis {
  idTooth: string;
  faces: Face[];
  conditions: Condition[];
}

export interface DentalProphylaxis {
  idDentalProphylaxis: number;
  creationDate: string;
  teethProphylaxis: ToothProphylaxis[];
  percentage: number;
}
