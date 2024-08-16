// odontogram.interface.ts
export interface ICondition {
    idCondition: Number,
    condition: string,
    description: string
}

export interface IFace {
    idFace: number,
    conditions?: ICondition[]
}

export interface ITooth {
    idTooth: number,
    faces: IFace[],
    status: true,
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