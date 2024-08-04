// odontogram.interface.ts
export interface ICondition {
    idCondition: Number,
    condition: String,
    description: String
}

export interface IFace {
    idFace: number,
    condition: ICondition[]
}

export interface ITooth {
    idTooth: Number,
    faces: IFace[],
    conditions: ICondition[]
}

export interface IOdontogram {
    tooths: ITooth[]
}

export interface IOdontogramHandler {
    marked: ICondition,
    childrenArcade: IOdontogram,
    adultArcade: IOdontogram
}