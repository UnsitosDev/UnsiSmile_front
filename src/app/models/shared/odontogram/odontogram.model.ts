import { ITooth } from "./odontogram";

export interface OdontogramPost {
    idPatient:     string;
    teeth:        Tooth[];
    idFormSection: number;
    idPatientClinicalHistory: number;
}

export interface Tooth {
    idTooth:    number;
    conditions: ToothCondition[];
    faces:      Face[];
}

export interface ToothCondition {
    idCondition: number;
    condition:   string;
    description: string;
}

export interface Face {
    idFace:     number;
    conditions: FaceCondition[];
}

export interface FaceCondition {
    idToothFaceCondition: number;
    condition:            string;
    description:          string;
}
 
export interface OdontogramResponse {
    idOdontogram: number;
    adultArcade:  Arcade[];
    childArcade:  Arcade[];
}

export interface Arcade {
    idTooth:    string;
    faces:      Face[];
    conditions: Condition[];
}

export interface Condition {
    idCondition: number;
    condition:   string;
    description: string;
}

export interface ToothEvent {
    faceId: string;
    index: number;
    tooth: ITooth;
}