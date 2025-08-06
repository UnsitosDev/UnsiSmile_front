// odontogram.interface.ts
export interface ICondition {
  selected: any;
  idCondition: number;
  condition: string;
  description: string;
}

export interface IFace {
  idFace: string;
  conditions?: ICondition[];
}

export interface ITooth {
  idTooth: number;
  faces: IFace[];
  status: boolean;
  conditions: ICondition[];
}

export interface IOdontogram {
  teeth: ITooth[];
  observations: string;
}

export interface IOdontogramHandler {
  marked: ICondition;
  childrenArcade: IOdontogram;
  adultArcade: IOdontogram;
  observations: string;
}
