import { ITooth } from './odontogram';

export interface OdontogramPost {
  teeth: Tooth[];
  idPatient: string;
  idTreatment: number;
  observations: string;
}

export interface Tooth {
  idTooth: number;
  conditions: ToothCondition[];
  faces: Face[];
}

export interface ToothCondition {
  idCondition: number;
  condition: string;
  description: string;
}

export interface Face {
  idFace: number;
  conditions: FaceCondition[];
}

export interface FaceCondition {
  idToothFaceCondition: number;
  condition: string;
  description: string;
}

export interface OdontogramResponse {
  idOdontogram: number;
  adultArcade: Arcade[];
  childArcade: Arcade[];
  observations: string;
}

export interface Arcade {
  idTooth: string;
  faces: Face[];
  conditions: Condition[];
}

export interface Condition {
  idCondition: number;
  condition: string;
  description: string;
}

export interface ToothEvent {
  faceId: string;
  index: number;
  tooth: ITooth;
}
