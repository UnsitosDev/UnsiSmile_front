// odontogram.interface.ts
export interface ICondition {
    idCondition: number,
    condition: string,
    description: string
}

export interface IFace {
    idFace: string,
    conditions?: ICondition[]
}

export interface ITooth {
    idTooth: number,
    faces: IFace[],
    status: true,
    conditions: ICondition[]
}

export interface IOdontogram {
    teeth: ITooth[]
}

export interface IOdontogramHandler {
    marked: ICondition,
    childrenArcade: IOdontogram,
    adultArcade: IOdontogram
}