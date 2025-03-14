export interface ThoothProphylaxis {
    idTooth: number,
    faces: IFaceProphylaxis[];
    conditions: IConditionProphylaxis[]
}

export interface IFaceProphylaxis {
    idFace: string,
    conditions?: IConditionProphylaxis[]
}

export interface IConditionProphylaxis {
    idCondition: number,
    condition: string,
    description: string
}

export interface IProphylaxis {
    theetProphylaxis: ThoothProphylaxis[]
}