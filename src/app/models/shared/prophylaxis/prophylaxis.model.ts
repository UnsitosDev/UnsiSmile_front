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

export interface ProphylaxisEntry {
    idDentalProphylaxis: number;
    teethProphylaxis: ToothProphylaxis[];
}

export interface ToothProphylaxis {
    idTooth: string;
    faces: ToothFace[];
    conditions: DentalCondition[];
}

export interface ToothFace {
    idFace: string;
    conditions: DentalCondition[];
}

export interface DentalCondition {
    idCondition: number;
    condition: string;
    description: string;
}


// response

export interface DentalProphylaxis {
    idDentalProphylaxis: number;
    teethProphylaxis: ToothProphylaxis[];
  }
  
  export interface ToothProphylaxis {
    idTooth: string;
    faces: Face[];
    conditions: Condition[]; // puede ser un array vacío
  }
  
  export interface Face {
    idFace: string;
    conditions: Condition[];
  }
  
  export interface Condition {
    idCondition: number;
    condition: string;
    description: string;
  }
  