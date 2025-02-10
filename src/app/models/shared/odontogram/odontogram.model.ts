export interface OdontogramPost {
    idPatient:     string;
    teeth:        Tooth[];
    idFormSection: string;
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
